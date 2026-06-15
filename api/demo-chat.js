// ═══════════════════════════════════════════════════════════════
// KLAAR — Demo Chat API (Vercel Edge Function)
// Bestand: api/demo-chat.js
//
// Live AI demo voor de landingspagina — geen auth vereist.
// Roept Claude API aan met een Klaar sales-rep systeem prompt.
// Streamt de response terug via SSE.
//
// Vereiste env var in Vercel dashboard:
//   ANTHROPIC_API_KEY = sk-ant-...
// ═══════════════════════════════════════════════════════════════

export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `Je bent de Klaar Assistent — AI-adviseur van Klaar horeca-software.

## Antwoordregels (ALTIJD volgen)
- MAX 60 woorden per antwoord
- Gebruik bullets (max 3) als er meerdere punten zijn
- Geen intro-zinnen ("Goed dat je dat vraagt" etc.) — direct beginnen
- Geen afsluitende vraag tenzij strikt nodig
- Altijd Nederlands

## Klaar modules
- Recept Studio — recepten, kostprijs per portie, marge
- Allergenenkaart — EU-14 allergenen, NVWA-klaar
- HACCP Logger — temp-logs, afwijkingen, inspectie-klaar
- Kostprijs — foodcost %, marge berekenen
- Catering & Events — kostprijs/persoon, keukensheet, inkooplijst
- Leveranciers — facturen scannen, prijstrends
- Menubuilder — marge per gerecht, menupsychologie

## Wie je bent
Horeca-adviseur. Direct, concreet, warm. Noem gratis trial max 1x per gesprek.`;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS });
  }

  let message, history, systemContext, clientMaxTokens;
  try {
    ({ message, history = [], systemContext = '', maxTokens: clientMaxTokens = 0 } = await req.json());
  } catch {
    return new Response(JSON.stringify({ error: 'Ongeldig verzoek' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...CORS }
    });
  }

  if (!message?.trim()) {
    return new Response(JSON.stringify({ error: 'Geen bericht' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...CORS }
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API niet geconfigureerd' }), {
      status: 503, headers: { 'Content-Type': 'application/json', ...CORS }
    });
  }

  // Build messages: previous turns + current user message
  const messages = [
    ...history.slice(-8).filter(m => m.role && m.content),
    { role: 'user', content: message.trim() }
  ];

  // Use module/dashboard system context if provided, otherwise use marketing prompt
  const finalSystem = systemContext
    ? `${systemContext}\n\n---\nANTWOORDREGELS: Wees beknopt. Bullets als er meerdere punten zijn. Geen lange intro-zinnen. Altijd Nederlands.`
    : SYSTEM_PROMPT;

  // Modules specify their own max_tokens (HACCP=2048, Leveranciers=8192, etc.)
  // Cap at 1500 for cost control; marketing chat stays at 280 (no systemContext)
  const maxTokens = systemContext
    ? Math.min(Math.max(clientMaxTokens || 600, 200), 1500)
    : 280;

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      system: finalSystem,
      messages,
      stream: true,
    }),
  });

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text().catch(() => 'onbekende fout');
    console.error('Anthropic error:', anthropicRes.status, err);
    return new Response(JSON.stringify({ error: 'AI niet beschikbaar, probeer opnieuw' }), {
      status: 502, headers: { 'Content-Type': 'application/json', ...CORS }
    });
  }

  return new Response(anthropicRes.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      ...CORS,
    },
  });
}
