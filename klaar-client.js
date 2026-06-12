// ═══════════════════════════════════════════════════════════════
// KLAAR — Gedeelde Supabase client + AI proxy helper
// Versie: 1.1.0
//
// Gebruik in elke module:
//   <script src="../klaar-client.js"></script>
//   of (als dezelfde map): <script src="./klaar-client.js"></script>
//
// Vereist: Supabase JS CDN (geladen vóór dit script)
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
// ═══════════════════════════════════════════════════════════════

// ── Configuratie ─────────────────────────────────────────────────
const KLAAR_SUPABASE_URL     = 'https://imiqoxsjdynliydsuihc.supabase.co'
const KLAAR_SUPABASE_ANON    = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltaXFveHNqZHlubGl5ZHN1aWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNzk3MzEsImV4cCI6MjA5Njg1NTczMX0.HuwCd7MMbQppxIjatxEP1F8j0qPRzjxhSSVsE91dVD4'
const KLAAR_AI_PROXY_URL     = `${KLAAR_SUPABASE_URL}/functions/v1/ai-proxy`

// ── Client aanmaken ───────────────────────────────────────────────
// window.klaarSupabase is beschikbaar in alle modules
window.klaarSupabase = supabase.createClient(KLAAR_SUPABASE_URL, KLAAR_SUPABASE_ANON)

// ── Auth helpers ──────────────────────────────────────────────────

/**
 * Huidige sessie ophalen
 * @returns {Promise<Session|null>}
 */
async function klaarGetSession() {
  const { data: { session } } = await window.klaarSupabase.auth.getSession()
  return session
}

/**
 * Inloggen met email OTP (6-cijferige code)
 * Werkt ook via file:// en op elk apparaat
 */
async function klaarSignInWithOTP(email) {
  const { error } = await window.klaarSupabase.auth.signInWithOtp({ email })
  if (error) throw error
}

/**
 * OTP code verifiëren
 */
async function klaarVerifyOTP(email, token) {
  const { data, error } = await window.klaarSupabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })
  if (error) throw error
  return data.session
}

/**
 * Uitloggen
 */
async function klaarSignOut() {
  await window.klaarSupabase.auth.signOut()
  // Stuur terug naar index.html
  const levels = window.location.pathname.split('/').filter(Boolean).length
  const prefix = levels > 1 ? '../'.repeat(levels - 1) : './'
  window.location.href = prefix + 'index.html'
}

/**
 * Auth guard — roep aan in elke module on load
 * Redirect naar index.html als niet ingelogd
 */
async function klaarRequireAuth() {
  const session = await klaarGetSession()
  if (!session) {
    const levels = window.location.pathname.split('/').filter(Boolean).length
    const prefix = levels > 1 ? '../'.repeat(levels - 1) : './'
    window.location.href = prefix + 'index.html?redirect=' + encodeURIComponent(window.location.href)
    return null
  }
  return session
}

// ── AI Proxy helpers ──────────────────────────────────────────────

/**
 * Claude aanroepen via de Supabase Edge Function proxy (non-streaming)
 *
 * Drop-in vervanger voor directe Anthropic fetch calls zonder stream:true.
 *
 * @param {Object} anthropicBody  - Zelfde body als directe Anthropic call (stream mag NIET true zijn)
 * @param {string} moduleName     - bv. '01-recept-studio'
 * @returns {Promise<Object>}     - Zelfde response als Anthropic API
 */
async function klaarAI(anthropicBody, moduleName = 'onbekend') {
  const session = await klaarGetSession()
  if (!session) throw new Error('Niet ingelogd — klaarAI vereist authenticatie')

  const response = await fetch(KLAAR_AI_PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ ...anthropicBody, _module: moduleName }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }))
    throw new Error(err.error || `AI proxy fout: ${response.status}`)
  }

  return response.json()
}

/**
 * Claude aanroepen via proxy — streaming modus
 *
 * Retourneert de raw fetch Response zodat de module de SSE stream kan lezen.
 * Gebruik voor chat-widgets met real-time typing-animatie.
 * Gebruik klaarAI() voor alle andere (non-streaming) calls.
 *
 * @param {Object} anthropicBody  - Moet stream:true bevatten
 * @param {string} moduleName     - bv. '01-recept-studio'
 * @returns {Promise<Response>}   - Raw fetch Response voor SSE verwerking
 */
async function klaarAIStream(anthropicBody, moduleName = 'onbekend') {
  const session = await klaarGetSession()
  if (!session) throw new Error('Niet ingelogd — klaarAIStream vereist authenticatie')

  return fetch(KLAAR_AI_PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ ...anthropicBody, _module: moduleName }),
  })
}

// ── Export op window zodat modules het kunnen gebruiken ───────────
window.klaarGetSession    = klaarGetSession
window.klaarSignInWithOTP = klaarSignInWithOTP
window.klaarVerifyOTP     = klaarVerifyOTP
window.klaarSignOut       = klaarSignOut
window.klaarRequireAuth   = klaarRequireAuth
window.klaarAI            = klaarAI
window.klaarAIStream      = klaarAIStream
