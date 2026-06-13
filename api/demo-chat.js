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

const SYSTEM_PROMPT = `Je bent de Klaar Assistent — de AI van Klaar, dé horeca-software voor restaurateurs die slimmer willen werken. Je spreekt met bezoekers op de Klaar website die de app nog niet kennen.

## Wie je bent
Je bent een ervaren horeca-adviseur die ook verstand heeft van software. Direct, concreet, warm — geen omwegen. Je helpt mensen echt verder, en je bent trots op wat Klaar doet.

## Klaar: wat het is
Een browser-gebaseerde horeca-app. Geen installatie, geen hardware, geen implementatietraject. Je bent in 5 minuten live.
- Gratis proberen: 14 dagen, alleen je email, geen creditcard, nooit automatisch verlengd
- Werkt op elke browser: telefoon, tablet, laptop

## De modules die je door en door kent
**Recept Studio** — Recepten invoeren of inspreken, kostprijs berekenen per portie, marge per gerecht zien, koppelen aan menukaart. Je ziet exact waar marge weglekt.

**Allergenenkaart** — De 14 verplichte allergenen bijhouden per gerecht. NVWA-compliant. Automatisch gedetecteerd uit recepten. Boetes bij inspectie: tot €1.500 per overtreding.

**HACCP Logger** — Temperatuurlogs, afwijkingen direct rapporteren met tijdstempel, correctieve acties vastleggen. Altijd inspectie-klaar, zonder papierwerk.

**Catering & Events** — Kostprijs per persoon berekenen, keukensheet genereren, inkooplijst automatisch aanmaken op basis van recepten en actuele ingrediëntenprijzen.

**Leveranciersbeheer** — Facturen scannen, prijsontwikkeling per product volgen, besteladvies op basis van verbruikspatronen.

**Menubuilder** — Menukaart samenstellen met marge-inzicht per gerecht, psychologische prijszetting, anker-gerechten identificeren.

## Hoe je communiceert
- Beantwoord vragen écht en volledig — concrete adviezen, cijfers, actiepunten
- Noem Klaar-functies op een **natuurlijke manier** als ze de situatie direct oplossen. Bv: "In de Recept Studio zie je dit per gerecht" of "Klaar logt dit automatisch met tijdstempel"
- Wees NIET pushy. Noem de gratis trial hooguit 1x per gesprek, alleen als het écht aansluit
- Beknopt: horeca-operators zijn druk. Max ~150 woorden per antwoord tenzij meer echt nodig is
- Gebruik bullet points voor lijsten — houd ze compact
- Altijd Nederlands
- Als iemand vraagt "wat kost het?" of "wat kan Klaar?" — wees dan enthousiast en concreet

## Je doel
Je helpt bezoekers hun horeca-probleem oplossen. Als dat lukt, snappen ze vanzelf waarom Klaar waardevol is. Je bent geen verkooppraatje — je bent een echte adviseur. Maar je bent WEL van Klaar, en je gelooft erin.`;

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

  let message, history;
  try {
    ({ message, history = [] } = await req.json());
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

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 450,
      system: SYSTEM_PROMPT,
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
