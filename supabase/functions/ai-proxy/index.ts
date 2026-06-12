// ═══════════════════════════════════════════════════════════════
// KLAAR — Anthropic AI Proxy (Supabase Edge Function)
// Bestand: supabase/functions/ai-proxy/index.ts
//
// Wat dit doet:
//   1. Verificeert dat de request van een ingelogde KLAAR-gebruiker komt
//   2. Forwardt de request naar de Anthropic API (met server-side key)
//   3. Logt token-gebruik per gebruiker voor billing (alleen non-streaming)
//   4. Blokkeert unauthenticated requests
//
// Deploy: supabase functions deploy ai-proxy
// ═══════════════════════════════════════════════════════════════

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ANTHROPIC_API_KEY      = Deno.env.get('ANTHROPIC_API_KEY')!
const SUPABASE_URL           = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // ── CORS preflight ──────────────────────────────────────────────
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  try {
    // ── 1. Auth verificatie ─────────────────────────────────────────
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized — geen geldig token' }, 401)
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return json({ error: 'Unauthorized — ongeldig token' }, 401)
    }

    // ── 2. Request body parsen ──────────────────────────────────────
    const body = await req.json()
    const { _module = 'unknown', ...anthropicBody } = body

    // Alleen claude-* modellen doorlaten (veiligheidscheck)
    if (!anthropicBody.model?.startsWith('claude-')) {
      return json({ error: 'Ongeldig model' }, 400)
    }

    // ── 3. Doorsturen naar Anthropic ────────────────────────────────
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':       'application/json',
        'x-api-key':          ANTHROPIC_API_KEY,
        'anthropic-version':  '2023-06-01',
      },
      body: JSON.stringify(anthropicBody),
    })

    // ── Streaming passthrough ───────────────────────────────────────
    // Als stream:true, pipe de SSE response direct door.
    // Usage-logging voor streaming: TODO (vereist parsing van message_delta event)
    if (anthropicBody.stream) {
      return new Response(anthropicRes.body, {
        status: anthropicRes.status,
        headers: {
          'Content-Type':  'text/event-stream',
          'Cache-Control': 'no-cache',
          ...CORS_HEADERS,
        },
      })
    }

    // ── Non-streaming: await JSON, log usage, return ────────────────
    const result = await anthropicRes.json()

    // ── 4. Gebruik loggen ───────────────────────────────────────────
    if (result.usage) {
      await supabase.from('api_usage').insert({
        user_id:       user.id,
        model:         anthropicBody.model,
        input_tokens:  result.usage.input_tokens  ?? 0,
        output_tokens: result.usage.output_tokens ?? 0,
        module:        _module,
      }).throwOnError()
    }

    // ── 5. Response teruggeven ──────────────────────────────────────
    return new Response(JSON.stringify(result), {
      status:  anthropicRes.status,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })

  } catch (err) {
    console.error('ai-proxy error:', err)
    return json({ error: err instanceof Error ? err.message : 'Interne fout' }, 500)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  })
}
