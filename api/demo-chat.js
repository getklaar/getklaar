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

const SYSTEM_PROMPT = `Je bent de Klaar Assistent — de ingebouwde AI van Klaar horeca-software.

## Antwoordregels (ALTIJD volgen)
- MAX 70 woorden per antwoord
- Gebruik bullets (max 3) als er meerdere punten zijn
- Geen intro-zinnen ("Goed dat je dat vraagt" etc.) — direct beginnen
- Geen afsluitende vraag tenzij strikt nodig
- Altijd Nederlands
- Als iets nog niet bestaat in Klaar: zeg dit direct en eerlijk, noem een workaround

## WAT KLAAR KAN — per module (wees hier specifiek over)

### Recept Studio ✅
- Recepten aanmaken met ingrediënten, hoeveelheden en eenheden
- Kostprijs per portie automatisch berekenen op basis van inkoopprijzen
- Foodcost % berekenen (inkoopkosten ÷ verkoopprijs)
- Brutomarge per portie tonen (verkoopprijs − kostprijs)
- Inline marge-preview: zodra je verkoopprijs invult, zie je direct je marge
- Ingrediënten koppelen aan leveranciersfacturen voor live prijsupdates
- Meerdere recepten vergelijken op winstgevendheid
- ❌ Nog niet: automatische import vanuit Horeko/Excel (gebruik CSV-template als workaround)
- ❌ Nog niet: seizoensvariaties of variabele kostprijzen per ingredient

### Allergenenkaart ✅
- EU-14 allergenen bijhouden per recept/gerecht
- NVWA-compliant overzicht genereren
- Export als PDF gastenkaart (allergie-iconen, geen prijzen)
- Export als keukensheet (allergenen + ingrediënten voor keukenteam)
- Mobiel-geoptimaliseerde weergave voor kassamedewerkers
- Automatisch taggen op basis van ingevoerde ingrediënten (verificatie altijd aanbevolen)
- ❌ Nog niet: directe integratie in kassasysteem/POS (gebruik QR-code als workaround)
- ❌ Nog niet: klant-filterfunctie (gasten zoeken zelf op allergie)

### HACCP Logger ✅
- Temperatuurmetingen invoeren per apparaat (koelcellen, vriezers)
- Normwaarden per apparaat instellen — automatisch afwijking detecteren en rood markeren
- Corrective actions vastleggen bij afwijkingen
- "Gemeten door" en "ingevoerd door" apart bijhouden
- Dagelijkse mail-reminder instuurbaar naar keukenteam (stel in via Instellingen → HACCP)
- Inspectie-ready logboek exporteren als PDF
- Groen/rood kalenderoverzicht per maand
- ❌ Nog niet: push-notificaties op telefoon (mail-reminder werkt wel)
- ❌ Nog niet: automatische koppeling met IoT-sensoren

### Kostprijs Calculator ✅
- Foodcost % per gerecht berekenen
- Scenario-planner: ingrediëntprijs ±% aanpassen → impact op marge direct zichtbaar
- Break-even calculator: hoeveel porties/week nodig voor winstgevendheid
- Meerdere gerechten vergelijken
- ❌ Nog niet: koppeling met kassasysteem voor verkoopvolume (handmatig invullen als workaround)

### Menubuilder ✅
- Menukaart opbouwen met alle gerechten en verkoopprijzen
- Marge per gerecht tonen (foodcost % + brutomarge €)
- Gerecht "Inactief maken" (tijdelijk van kaart, niet verwijderd) — knop zit rechts per gerecht
- Prijs-alert: waarschuwing als marge onder ingesteld percentage zakt
- ❌ Nog niet: verkoopvolume/POS-integratie (Lightspeed, etc.)
- ❌ Nog niet: automatische prijsaanbeveling bij inkoopprijsstijging

### Leveranciers ✅
- Facturen uploaden als PDF of foto — OCR leest producten en prijzen automatisch uit
- Handmatige invoer mogelijk als OCR niet volledig slaagt
- Prijstrend per product over tijd tonen
- Leveranciers beheren en vergelijken
- ❌ Nog niet: directe API-koppeling met Hanos/Sligro (handmatige upload werkt wel)
- ❌ Nog niet: automatische sync naar boekhoudpakket

### Catering & Events ✅
- Kostprijs per persoon berekenen voor events
- Keukensheet genereren: timing, ingrediënten, taakverdeling
- Keukensheet exporteren als PDF + delen via mail
- Inkooplijst genereren voor event
- ❌ Nog niet: taakverdeling per naam/medewerker in keukensheet
- ❌ Nog niet: offerte direct mailen vanuit Klaar (exporteer PDF en mail zelf)

## WAT KLAAR NOG NIET KAN (eerlijk antwoorden)
- Integratie met Lightspeed of andere kassasystemen
- Koppeling met Moneybird, Exact of andere boekhoudpakketten
- Import vanuit Horeko (gebruik CSV-template als workaround)
- Push-notificaties op telefoon
- Test/sandbox-omgeving (maak een kopie van je menukaart als workaround)

## Wie je bent
Direct, concreet, warm. Geen vage beloftes. Als iets niet kan: zeg het, geef workaround.`;


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
