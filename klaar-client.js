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
 * Berekent de absolute URL naar index.html — werkt voor zowel file:// als https://
 * file://: zoekt /Klaar/ in het pad en bouwt absolute URL
 * https://: gebruikt directory depth (modules zitten 1 niveau diep)
 */
function _klaarIndexHref() {
  const href = window.location.href
  if (href.startsWith('file:')) {
    const m = href.match(/(file:\/\/\/[^?#]*?\/Klaar\/)/)
    if (m) return m[1] + 'index.html'
    // Fallback: één map omhoog vanuit module-map
    return href.replace(/\/[^/]+\/[^/]+$/, '/index.html')
  }
  // https://: relatief pad op basis van directory-diepte
  const segs = window.location.pathname.split('/').filter(Boolean)
  segs.pop() // verwijder bestandsnaam
  const depth = segs.length
  return (depth > 0 ? '../'.repeat(depth) : './') + 'index.html'
}

/**
 * Uitloggen
 */
async function klaarSignOut() {
  await window.klaarSupabase.auth.signOut()
  window.location.href = _klaarIndexHref()
}

/**
 * Auth guard — roep aan in elke module on load
 * Redirect naar index.html als niet ingelogd
 */
async function klaarRequireAuth() {
  // Dev bypass voor lokaal testen (nooit in productie actief zetten)
  if (localStorage.getItem('klaar_devmode') === 'klaar2026') {
    return { user: { email: 'dev@klaar.local', id: 'dev-local' }, access_token: null }
  }
  const session = await klaarGetSession()
  if (!session) {
    const indexUrl = _klaarIndexHref()
    window.location.href = indexUrl + '?redirect=' + encodeURIComponent(window.location.href)
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

// ── Dev Modus ─────────────────────────────────────────────────────
// Activeren: open index.html?dev=klaar2026
// Uitschakelen: klik "Uitschakelen" banner, of open index.html?cleardev=1
window.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search)

  if (params.get('dev') === 'klaar2026') {
    localStorage.setItem('klaar_devmode', 'klaar2026')
    const url = new URL(window.location.href)
    url.searchParams.delete('dev')
    try { history.replaceState({}, '', url) } catch(e) {}
  }
  if (params.get('cleardev') === '1') {
    localStorage.removeItem('klaar_devmode')
    const url = new URL(window.location.href)
    url.searchParams.delete('cleardev')
    try { history.replaceState({}, '', url) } catch(e) {}
  }

  if (localStorage.getItem('klaar_devmode') === 'klaar2026') {
    const b = document.createElement('div')
    b.id = '_klaarDevBanner'
    b.style.cssText = [
      'position:fixed', 'bottom:0', 'left:0', 'right:0', 'z-index:99999',
      'background:#e8ff47', 'color:#0a0a0a',
      'font-family:monospace', 'font-size:11px', 'font-weight:700',
      'padding:5px 16px', 'text-align:center', 'letter-spacing:1px',
      'display:flex', 'align-items:center', 'justify-content:center', 'gap:16px'
    ].join(';')
    b.innerHTML = '⚙ DEV MODUS — Auth uitgeschakeld (AI proxy vereist nog echte login)' +
      ' <button onclick="localStorage.removeItem(\'klaar_devmode\');location.reload();" ' +
      'style="background:none;border:1px solid #0a0a0a;color:#0a0a0a;cursor:pointer;' +
      'font-family:monospace;font-size:11px;font-weight:700;padding:2px 10px;letter-spacing:1px;">' +
      'Uitschakelen</button>'
    document.body.appendChild(b)
  }
})

// ── Module Navigatie Switcher ─────────────────────────────────────
// Auto-injecteert in elke module-header — geen HTML-aanpassing nodig
;(function () {
  const KLAAR_MODS = [
    { n: '01', label: 'Recept Studio',   path: '01-recept-studio/klaar-recept-studio.html' },
    { n: '02', label: 'Allergenenkaart', path: '02-allergenenkaart/klaar-allergenenkaart.html' },
    { n: '03', label: 'HACCP',           path: '03-haccp/klaar-haccp.html' },
    { n: '04', label: 'Kostprijs',       path: '04-kostprijs/klaar-kostprijs.html' },
    { n: '05', label: 'Menubuilder',     path: '05-menubuilder/klaar-menubuilder.html' },
    { n: '07', label: 'Leveranciers',    path: '07-leveranciers/klaar-leveranciers.html' },
    { n: '10', label: 'Catering',        path: '10-catering-events/klaar-catering.html' },
  ]

  window.addEventListener('DOMContentLoaded', function () {
    // Alleen in module-pagina's — index.html heeft geen module-header
    const curHref  = window.location.href
    const indexHref = _klaarIndexHref()
    const isIndex  = curHref.endsWith('index.html') || curHref.endsWith('/')
    const rootDir  = indexHref.replace('index.html', '')
    if (isIndex) return

    const curMod = KLAAR_MODS.find(m => curHref.includes(m.path.split('/')[0]))

    // CSS
    const sty = document.createElement('style')
    sty.textContent = `
#_kNavBtn {
  display:flex; align-items:center; gap:6px;
  padding:0 12px; height:28px;
  background:none; border:1px solid var(--border,#333);
  color:var(--gray,#888); cursor:pointer;
  font-family:'DM Mono',monospace; font-size:10px;
  letter-spacing:.09em; text-transform:uppercase; transition:all .15s;
  white-space:nowrap; flex-shrink:0;
}
#_kNavBtn:hover, #_kNavBtn._open { border-color:var(--lime,#e8ff47); color:var(--lime,#e8ff47); }
#_kNavPanel {
  position:fixed; top:58px; right:14px; z-index:9100;
  background:var(--surface,#111); border:1px solid var(--border2,#333);
  min-width:220px; padding:5px 0;
  box-shadow:0 12px 44px rgba(0,0,0,.85);
  display:none;
}
#_kNavPanel._open { display:block; animation:_kIn .12s ease; }
@keyframes _kIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:none} }
._kHome {
  display:flex; align-items:center;
  padding:7px 14px; font-size:11px; color:var(--gray,#777);
  font-family:'DM Mono',monospace; letter-spacing:.08em; text-transform:uppercase;
  transition:color .1s; text-decoration:none;
}
._kHome:hover { color:var(--lime,#e8ff47); }
._kSep { height:1px; background:var(--border,#222); margin:4px 0; }
._kMod {
  display:flex; align-items:center; gap:9px;
  padding:6px 14px; font-size:12px;
  color:var(--gray,#888); text-decoration:none;
  font-family:'DM Sans',sans-serif; transition:all .1s;
  border-left:2px solid transparent;
}
._kMod:hover { background:rgba(232,255,71,.05); color:var(--white,#eee); border-left-color:rgba(232,255,71,.25); }
._kMod.cur { color:var(--lime,#e8ff47); border-left-color:var(--lime,#e8ff47); background:rgba(232,255,71,.07); }
._kNum { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:.1em; color:var(--border2,#444); width:20px; flex-shrink:0; }
._kMod.cur ._kNum { color:rgba(232,255,71,.5); }
`
    document.head.appendChild(sty)

    // Dropdown panel
    const panel = document.createElement('div')
    panel.id = '_kNavPanel'
    let panelHtml = `<a class="_kHome" href="${indexHref}">← Dashboard</a><div class="_kSep"></div>`
    KLAAR_MODS.forEach(function (m) {
      const isCur = curMod && curMod.n === m.n
      panelHtml += `<a class="_kMod${isCur ? ' cur' : ''}" href="${rootDir}${m.path}"><span class="_kNum">${m.n}</span>${m.label}</a>`
    })
    panel.innerHTML = panelHtml
    document.body.appendChild(panel)

    // Knop injecteren in header-acties
    const actions = document.querySelector('.h-actions') || document.querySelector('.nav-acties')
    if (!actions) return

    const btn = document.createElement('button')
    btn.id    = '_kNavBtn'
    btn.title = 'Wissel van module'
    btn.innerHTML = '<svg width="12" height="9" viewBox="0 0 12 9" fill="currentColor" aria-hidden="true"><rect width="12" height="1.4" rx=".7"/><rect y="3.8" width="12" height="1.4" rx=".7"/><rect y="7.6" width="12" height="1.4" rx=".7"/></svg>Modules'
    actions.prepend(btn)

    btn.addEventListener('click', function (e) {
      e.stopPropagation()
      const open = panel.classList.toggle('_open')
      btn.classList.toggle('_open', open)
    })
    document.addEventListener('click', function () {
      panel.classList.remove('_open')
      btn.classList.remove('_open')
    })
    panel.addEventListener('click', function (e) { e.stopPropagation() })
  })
})()

// ── Export op window zodat modules het kunnen gebruiken ───────────
window.klaarGetSession    = klaarGetSession
window.klaarSignInWithOTP = klaarSignInWithOTP
window.klaarVerifyOTP     = klaarVerifyOTP
window.klaarSignOut       = klaarSignOut
window.klaarRequireAuth   = klaarRequireAuth
window.klaarAI            = klaarAI
window.klaarAIStream      = klaarAIStream
