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
    const dashHref = rootDir + 'dashboard/'
    let panelHtml = `<a class="_kHome" href="${dashHref}">← Dashboard</a><div class="_kSep"></div>`
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

// ── Module AI Assistent Panel ─────────────────────────────────────
// Als module al een .chat-panel heeft: voeg alleen voice-knop toe
// Anders: injecteer volledige AI-zijbalk
;(function () {
  window.addEventListener('DOMContentLoaded', function () {
    const curHref = window.location.href
    const isIndex = curHref.endsWith('index.html') || curHref.endsWith('/')
    const isDashboard = curHref.includes('/dashboard/')
    if (isIndex || isDashboard) return

    // If module already has its own AI panel, only inject voice button
    if (document.querySelector('.chat-panel') || document.querySelector('.chat-input-area')) {
      _klaarInjectVoice()
      return
    }

    const MODS = [
      { n: '01', label: 'Recept Studio',   path: '01-recept-studio' },
      { n: '03', label: 'HACCP',           path: '03-haccp' },
      { n: '04', label: 'Kostprijs',       path: '04-kostprijs' },
      { n: '05', label: 'Menubuilder',     path: '05-menubuilder' },
      { n: '07', label: 'Leveranciers',    path: '07-leveranciers' },
      { n: '10', label: 'Catering',        path: '10-catering-events' },
    ]
    const curMod = MODS.find(m => curHref.includes(m.path))
    const modName = curMod ? curMod.label : 'Klaar'

    // ── CSS ──
    const sty = document.createElement('style')
    sty.textContent = `
#_kAISide {
  position: fixed; top: 0; right: -320px; bottom: 0; width: 320px;
  background: #111; border-left: 1px solid rgba(232,255,71,0.18);
  display: flex; flex-direction: column; z-index: 8000;
  transition: right 0.25s cubic-bezier(0.2,0,0,1);
  font-family: 'DM Sans', sans-serif;
}
#_kAISide._open { right: 0; }
#_kAIHead {
  padding: 0 16px; height: 52px; display: flex; align-items: center;
  justify-content: space-between; border-bottom: 1px solid rgba(232,255,71,0.15);
  flex-shrink: 0;
}
#_kAIHeadTitle {
  font-family: 'Bebas Neue', 'DM Sans', sans-serif; font-size: 18px;
  letter-spacing: 1px; color: #e8ff47;
}
#_kAIClose {
  background: none; border: none; color: #888; cursor: pointer;
  font-size: 18px; padding: 4px 8px; transition: color 0.1s;
}
#_kAIClose:hover { color: #e8ff47; }
#_kAIMsgs {
  flex: 1; overflow-y: auto; padding: 14px 14px 8px; display: flex;
  flex-direction: column; gap: 8px; scroll-behavior: smooth;
}
#_kAIMsgs::-webkit-scrollbar { width: 3px; }
#_kAIMsgs::-webkit-scrollbar-thumb { background: #333; }
._kAIBot {
  background: #1a1a1a; border: 1px solid #2a2a2a;
  padding: 9px 12px; font-size: 13px; color: #f5f2eb;
  line-height: 1.6; align-self: flex-start; max-width: 92%;
}
._kAIUser {
  background: #e8ff47; color: #0a0a0a;
  padding: 8px 12px; font-size: 13px; font-weight: 500;
  align-self: flex-end; max-width: 86%;
}
#_kAISuggest {
  padding: 6px 14px 8px; display: flex; flex-wrap: wrap; gap: 5px;
  border-top: 1px solid rgba(232,255,71,0.08);
}
._kAISugg {
  font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.5px;
  border: 1px solid #2a2a2a; color: #888; background: none;
  padding: 4px 8px; cursor: pointer; transition: all 0.1s;
}
._kAISugg:hover { border-color: #e8ff47; color: #e8ff47; }
#_kAIInputRow {
  border-top: 1px solid rgba(232,255,71,0.15);
  display: flex; flex-shrink: 0;
}
#_kAIInput {
  flex: 1; background: transparent; border: none; outline: none;
  color: #f5f2eb; font-family: 'DM Sans', sans-serif; font-size: 13px;
  padding: 12px 12px;
}
#_kAIInput::placeholder { color: #555; }
#_kAIVoice {
  background: none; border: none; border-left: 1px solid #1e1e1e;
  color: #888; cursor: pointer; padding: 0 10px; font-size: 15px;
  transition: color 0.1s;
}
#_kAIVoice:hover, #_kAIVoice._rec { color: #e8ff47; }
#_kAIVoice._rec { animation: _kPulse 1s infinite; }
@keyframes _kPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
#_kAISend {
  background: #e8ff47; border: none; color: #0a0a0a;
  font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 700;
  padding: 0 16px; cursor: pointer; letter-spacing: 1px; transition: opacity 0.1s;
}
#_kAISend:hover { opacity: 0.85; }
#_kAIToggle {
  display: flex; align-items: center; gap: 6px;
  padding: 0 12px; height: 28px;
  background: none; border: 1px solid rgba(232,255,71,0.35);
  color: #e8ff47; cursor: pointer;
  font-family: 'DM Mono', monospace; font-size: 10px;
  letter-spacing: .09em; text-transform: uppercase; transition: all .15s;
  white-space: nowrap; flex-shrink: 0;
}
#_kAIToggle:hover { background: rgba(232,255,71,0.08); }
`
    document.head.appendChild(sty)

    // ── Panel HTML ──
    const panel = document.createElement('div')
    panel.id = '_kAISide'
    panel.innerHTML = `
      <div id="_kAIHead">
        <div id="_kAIHeadTitle">🤖 AI — ${modName}</div>
        <button id="_kAIClose" onclick="document.getElementById('_kAISide').classList.remove('_open')" title="Sluit">✕</button>
      </div>
      <div id="_kAIMsgs">
        <div class="_kAIBot">Hoi! Ik ken ${modName}. Wat wil je weten?</div>
      </div>
      <div id="_kAISuggest">
        <button class="_kAISugg" onclick="_kAISend('Hoe gebruik ik ${modName}?')">Hoe gebruik ik dit?</button>
        <button class="_kAISugg" onclick="_kAISend('Wat kan ik hier mee besparen?')">Besparen?</button>
        <button class="_kAISugg" onclick="_kAISend('Geef me een tip voor ${modName}')">Tip</button>
      </div>
      <div id="_kAIInputRow">
        <input id="_kAIInput" type="text" placeholder="Stel een vraag..." maxlength="300"
               onkeydown="if(event.key==='Enter')_kAISend()" />
        <button id="_kAIVoice" onclick="_kAIVoice()" title="Inspreken">🎤</button>
        <button id="_kAISend" onclick="_kAISend()">→</button>
      </div>
    `
    document.body.appendChild(panel)

    // ── Toggle knop in module header ──
    const actions = document.querySelector('.h-actions') || document.querySelector('.nav-acties')
    if (actions) {
      const btn = document.createElement('button')
      btn.id = '_kAIToggle'
      btn.innerHTML = '🤖 AI'
      btn.title = 'AI Assistent openen'
      btn.addEventListener('click', function (e) {
        e.stopPropagation()
        document.getElementById('_kAISide').classList.toggle('_open')
      })
      actions.prepend(btn)
    }

    // ── AI chat logic ──
    let _kAILoading = false
    window._kAISend = async function (msg) {
      const inp = document.getElementById('_kAIInput')
      const text = msg || inp.value.trim()
      if (!text || _kAILoading) return
      inp.value = ''
      _kAILoading = true

      const msgs = document.getElementById('_kAIMsgs')
      const uEl = document.createElement('div')
      uEl.className = '_kAIUser'; uEl.textContent = text
      msgs.appendChild(uEl)
      msgs.scrollTop = msgs.scrollHeight

      const thinkEl = document.createElement('div')
      thinkEl.className = '_kAIBot'
      thinkEl.innerHTML = '<span style="color:#555;font-family:\'DM Mono\',monospace;font-size:10px">▍</span>'
      msgs.appendChild(thinkEl)
      msgs.scrollTop = msgs.scrollHeight

      // Build module context
      const ctx = `Je bent AI-assistent in de ${modName} module van Klaar horeca-software.`
        + ` Antwoord in max 60 woorden, bullets als nodig, geen intro-zinnen, altijd Nederlands.`

      try {
        const res = await fetch('/api/demo-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, systemContext: ctx })
        })
        if (!res.ok) throw new Error('err')
        const reader = res.body.getReader()
        const dec = new TextDecoder()
        let full = ''
        thinkEl.innerHTML = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = dec.decode(value)
          for (const line of chunk.split('\n')) {
            if (line.startsWith('data: ')) {
              const d = line.slice(6).trim()
              if (d === '[DONE]') break
              try {
                const j = JSON.parse(d)
                if (j.type === 'content_block_delta' && j.delta?.type === 'text_delta') {
                  full += j.delta.text
                  thinkEl.innerHTML = full.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')
                  msgs.scrollTop = msgs.scrollHeight
                }
              } catch {}
            }
          }
        }
        if (!full) thinkEl.innerHTML = 'Probeer opnieuw.'
      } catch {
        thinkEl.innerHTML = 'Verbindingsfout — check je internetverbinding.'
      }
      _kAILoading = false
    }

    // ── Voice input ──
    let _kRec = null
    window._kAIVoice = function () {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition
      const btn = document.getElementById('_kAIVoice')
      if (!SR) {
        const inp = document.getElementById('_kAIInput')
        inp.placeholder = 'Gebruik Chrome voor spraak'
        setTimeout(() => { inp.placeholder = 'Stel een vraag...' }, 2500)
        return
      }
      if (_kRec) { try { _kRec.stop() } catch {} _kRec = null; btn.classList.remove('_rec'); return }
      _kRec = new SR()
      _kRec.lang = 'nl-NL'
      _kRec.interimResults = true
      btn.classList.add('_rec')
      _kRec.onresult = function (e) {
        let final = '', interim = ''
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) final += e.results[i][0].transcript
          else interim += e.results[i][0].transcript
        }
        document.getElementById('_kAIInput').value = final || interim
      }
      _kRec.onend = function () {
        btn.classList.remove('_rec')
        _kRec = null
        const val = document.getElementById('_kAIInput').value.trim()
        if (val) _kAISend(val)
      }
      _kRec.onerror = function () { btn.classList.remove('_rec'); _kRec = null }
      _kRec.start()
    }
  })
})()

// ── Voice button injectie voor bestaande .chat-panel modules ─────
function _klaarInjectVoice() {
  // Wait a tick for module DOM to finish rendering
  setTimeout(function () {
    const inputArea = document.querySelector('.chat-input-area')
    if (!inputArea) return
    if (inputArea.querySelector('#_klaarVoiceBtn')) return // al geïnjecteerd
    const chatInput = inputArea.querySelector('.chat-input') || inputArea.querySelector('textarea')
    if (!chatInput) return

    // Maak voice-knop (zelfde stijl als .chat-upload-btn)
    const btn = document.createElement('button')
    btn.id = '_klaarVoiceBtn'
    btn.className = 'chat-upload-btn'
    btn.title = 'Inspreken (nl-NL) — klik om te beginnen, klik opnieuw om te stoppen'
    btn.textContent = '🎤'

    let rec = null
    btn.addEventListener('click', function () {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SR) {
        const prev = chatInput.placeholder
        chatInput.placeholder = '→ Gebruik Chrome voor spraak'
        setTimeout(function () { chatInput.placeholder = prev }, 2500)
        return
      }
      if (rec) {
        try { rec.stop() } catch (e) {}
        rec = null
        btn.style.color = ''
        btn.style.borderColor = ''
        return
      }
      rec = new SR()
      rec.lang = 'nl-NL'
      rec.interimResults = true
      rec.maxAlternatives = 1
      btn.style.color = '#e8ff47'
      btn.style.borderColor = '#e8ff47'

      rec.onresult = function (e) {
        let final = '', interim = ''
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) final += e.results[i][0].transcript
          else interim += e.results[i][0].transcript
        }
        chatInput.value = final || interim
        chatInput.dispatchEvent(new Event('input', { bubbles: true }))
      }
      rec.onend = function () {
        btn.style.color = ''
        btn.style.borderColor = ''
        rec = null
        const val = chatInput.value.trim()
        if (val) {
          const sendBtn = inputArea.querySelector('.chat-send')
          if (sendBtn && !sendBtn.disabled) sendBtn.click()
        }
      }
      rec.onerror = function () {
        btn.style.color = ''
        btn.style.borderColor = ''
        rec = null
      }
      rec.start()
    })

    // Invoegen vóór de send-knop
    const sendBtn = inputArea.querySelector('.chat-send')
    if (sendBtn) inputArea.insertBefore(btn, sendBtn)
    else inputArea.appendChild(btn)
  }, 200)
}

// ── Export op window zodat modules het kunnen gebruiken ───────────
window.klaarGetSession    = klaarGetSession
window.klaarSignInWithOTP = klaarSignInWithOTP
window.klaarVerifyOTP     = klaarVerifyOTP
window.klaarSignOut       = klaarSignOut
window.klaarRequireAuth   = klaarRequireAuth
window.klaarAI            = klaarAI
window.klaarAIStream      = klaarAIStream

// ── klaarAIStream override: route via Vercel /api/demo-chat ───────
// Alle modules gebruiken klaarAIStream — dit stuurt ze door naar de
// werkende API key op Vercel i.p.v. de Supabase proxy.
// Het Anthropic streaming formaat (SSE) is identiek, dus de modules
// werken zonder aanpassingen.
window.klaarAIStream = async function (anthropicBody, moduleName) {
  const msgs      = anthropicBody.messages || []
  const lastMsg   = msgs[msgs.length - 1]
  const message   = typeof lastMsg?.content === 'string'
    ? lastMsg.content
    : (lastMsg?.content?.[0]?.text || '')

  const history = msgs.slice(0, -1).map(function (m) {
    return {
      role:    m.role,
      content: typeof m.content === 'string' ? m.content : (m.content?.[0]?.text || '')
    }
  })

  // Pass the module's own rich system prompt as systemContext
  const systemContext = anthropicBody.system || ''
  // Pass max_tokens from module (HACCP=2048, Leveranciers=8192, etc.) — demo-chat caps at 1500
  const maxTokens = anthropicBody.max_tokens || 600

  return fetch('/api/demo-chat', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ message, history, systemContext, maxTokens })
  })
}
