# Klaar — Module 01: Recept Studio

## Wat doet dit?
Spraak-naar-recept module voor de horecasector. Gebruikers spreken een recept in (of typen het), Claude structureert het naar een professioneel receptkaartje met ingrediënten, stappen, bereidingstijd en allergenen.

## Bestanden
- `klaar-recept-studio.html` — werkende module (open in Chrome of Edge)
- `backups/` — datumgestempelde backups

## Techniek
- **Spraak:** Web Speech API (browser ingebouwd, geen setup)
- **AI:** Claude API (`claude-sonnet-4-6`) via directe browser fetch
- **Opslag:** localStorage (alles lokaal, geen server nodig)
- **Talen:** Nederlands (`nl-NL`) en Engels (`en-US`)

## Features (volledig werkend)
- 🎙️ Live spraakopname — auto-stop bij tab-switch, live timer (🔴 0:42), toast bij auto-stop
- ✨ Claude genereert gestructureerd recept van ruwe spraak
- 🗂️ Kaartweergave (grid) als standaard — 2-3 kolommen, kaarten met foto/titel/categorie/tijd/moeilijkheid/allergenen
- 🔍 Filter chips (Alle/Amuse/Soep/Voorgerecht/etc.) + zoekbalk op naam + ingrediënt
- 👁️ Quick-preview sliding panel — klik kaart → paneel schuift in met volledig recept, stappen, allergenen, events
- ➕/➖ Portie-calculator in preview (client-side, Math.round) — base-waarden ongewijzigd opgeslagen
- 🏷️ Editbare allergeenchips — verwijder (×) of voeg toe (+) met dropdown EU-14 + NM + icons
- 🗓️ Events koppeling — preview toont "Ingepland in events" vanuit `klaar_events` localStorage
- 🖨️ Print-klaar receptkaart — opent in nieuw tabblad, Klaar-header, bedrijfsnaam, porties geschaald indien actief
- 📷 Foto toevoegen aan recept (upload, base64)
- 🟡 Concept / ✅ Compleet status
- 🗑️ Verwijderen met bevestiging
- 💾 Auto-save concept bij typen/navigeren
- ⚙️ Instellingen: API key + bedrijfsnaam + adres (voor print)

## API Key instellen
Klik ⚙️ rechtsboven → vul Claude API key in (`sk-ant-...`)
Key staat opgeslagen in: `/Users/cloudchief/Desktop/Klaar/KLAAR-API-KEYS.md`
Sleutel beheren: https://console.anthropic.com/settings/keys

## Allergenen — datamodel
Allergenen worden opgeslagen als objecten voor structureerde scraping:
```json
"allergens": [
  {"code": "G", "name": "Gluten"},
  {"code": "M", "name": "Melk"},
  {"code": "NM", "name": "Nootmuskaat"}
]
```
EU-14 codes: G, S, E, Vi, P, So, M, N, Se, Mo, Sa, Su, L, W  
Extra: NM (Nootmuskaat) — veelgebruikt in horeca, kan reacties geven bij notenallergici  
De receptkaart heeft ook `data-allergens` en `data-recipe-id` attributen voor de toekomstige scrapingmodule.

## Deployment
- **GitHub:** github.com/getklaar/getklaar
- **Vercel:** getklaar.vercel.app (auto-deploy bij elke push naar main)
- **Domein:** getklaar.app (Cloudflare — nog te koppelen aan Vercel)
- Elke gebruiker vult zelf zijn API key in via ⚙️ (opgeslagen in eigen localStorage)
- Multi-user / gedeelde API key → later via Supabase backend

## Bekende bugs (opgelost)
- Spraak onthield alleen laatste zin bij pauzes → opgelost met `finalTranscript` accumulator
- Recipe niet scrollbaar → opgelost met flex-direction + flex-shrink fixes
- "Non ISO-8859-1 code point" fetch error → API key wordt gesanitized bij opslaan én bij gebruik (strip non-ASCII + trim)

## Layout — 3-panelen structuur
- **Sidebar** (200px): folder-navigatie + zoeken + "+ Nieuw recept"
- **Hoofdpaneel**: filter bar (chips + zoek) + kaartgrid OF editor-view
- **Preview panel** (420px, slides in): volledig recept, portie-calc, allergeenchips, events

## Datamodel — allergenen (bijgewerkt)
```json
"allergens": [{"code": "G", "name": "Gluten", "icon": "🌾"}]
```
Icons: G=🌾, S=🦐, E=🥚, Vi=🐟, P=🥜, So=🫘, M=🥛, N=🌰, Se=🌿, Mo=🌻, Sa=🌱, Su=🍇, L=🌾, W=🦪, NM=🫚

## Nog te doen / ideeën
- [ ] Recept bewerken na generatie (ingrediënten/stappen handmatig aanpassen in preview)
- [ ] Koppeling met andere Klaar-modules
- [ ] Module 02: Allergenenkaart — leest allergenen uit alle recepten → overzichtskaart per gerecht
- [ ] Drag & drop kaarten tussen folders
- [ ] Supabase backend voor multi-user (geparkeerd)

## Datamodel — allergenen (voor module 02)
```json
"allergens": [{"code": "G", "name": "Gluten"}, {"code": "M", "name": "Melk"}]
```
EU-14 codes: G, S, E, Vi, P, So, M, N, Se, Mo, Sa, Su, L, W + NM (Nootmuskaat)
Receptkaart heeft `data-allergens` (JSON) en `data-recipe-id` attributen voor scraping.

## Folders — logica
- Nieuw recept → altijd in 📥 Niet ingedeeld (folder: null)
- Type wijzigen → folder updatet automatisch mee (tenzij handmatig verplaatst)
- Handmatig slepen heeft altijd voorrang
- Collapse-staat folders opgeslagen in localStorage (`klaar_folder_state`)

## Chat Assistent (toegevoegd 2026-06-12)

Module 01 heeft een volledig chat-widget met:
- SSE streaming via Claude Haiku (claude-haiku-4-5-20251001)
- Contextbewust: leest `klaar_recipes` (receptenbibliotheek) EN `klaar_ingredienten` (grondstoffen) bij elke chat
- Suggesties: Overzicht, Allergenengaten, Analyse, Seizoen
- POS-context: weet van unTill, Lightspeed, Hanos, Bidfood etc.
- Commerciële intelligentie: subtiele upsell max 1x per gesprek

Bekende gedragsregels in system prompt:
- RESPONSLENGTE: max 3-4 zinnen, geen headers, geen bold, max 1 emoji
- RECEPT UIT BIBLIOTHEEK: als gebruiker vraagt naar recept "vanuit ingrediëntenbibliotheek" → gebruikt klaar_ingredienten, combineert NIET bestaande recepten
- Sparse data: bij < 5 ingrediënten → eerlijk over beperking + toch bruikbaar recept + ontbrekende items noemen

## Buglog
- 2026-06-12: Chatbot gaf te lange antwoorden (headers, bold, genummerde lijsten) → RESPONSLENGTE-blok toegevoegd aan system prompt
- 2026-06-12: "Recept vanuit bibliotheek" combineerde bestaande recepten i.p.v. losse ingrediënten → klaar_ingredienten toegevoegd aan context + BELANGRIJK ONDERSCHEID instructie

## In een nieuwe chat gebruiken
Zeg tegen Claude: "Lees /Users/cloudchief/Desktop/Klaar/01-recept-studio/klaar-recept-studio.html en MODULE.md — dit is module 01 van het Klaar project. [jouw vraag]"
