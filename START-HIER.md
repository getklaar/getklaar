# START-HIER — Klaar App Briefing voor nieuwe chat

Lees dit bestand als eerste. Daarna lees je de specifieke bestanden voor de module waaraan je gaat werken.

---

## Wat is Klaar?

**Klaar** is een modulaire horeca-management SaaS voor de Nederlandse markt.  
"The Operating System for the Serving Industry."

- Stack: **statische HTML-bestanden** — alles CSS/JS/HTML inline, geen build-stap, geen externe dependencies (behalve Google Fonts via CDN)
- Data: **localStorage** gedeeld tussen modules — geen backend, geen database
- Design: donker, minimaal, professioneel — Bebas Neue headers, DM Sans body, DM Mono labels
- Kleuren: `--black: #0a0a0a` · `--surface: #111111` · `--bg: #f5f5f3` · `--lime: #e8ff47` · `--border: #2a2a2a`

---

## Bestandslocaties

```
/Users/cloudchief/Desktop/Klaar/
├── index.html                          ← Hoofddashboard (toegangspunt app)
├── README.md                           ← Projectoverzicht + werkwijze
├── DASHBOARD-PROMPT.md                 ← Chat-prompt voor dashboard-werk
├── START-HIER.md                       ← Dit bestand
├── 01-recept-studio/
│   ├── klaar-recept-studio.html        ← Module 01 ✅ LIVE
│   └── MODULE.md
├── 02-allergenenkaart/
│   ├── klaar-allergenenkaart.html      ← Module 02 ✅ LIVE
│   └── MODULE.md
├── 03-haccp/
│   ├── klaar-haccp.html                ← Module 03 ✅ LIVE
│   └── MODULE.md
├── 04-kostprijs/
│   ├── klaar-kostprijs.html            ← Module 04 🔧 In ontwikkeling (v2.1)
│   └── MODULE.md                       ← LEES DIT voor details unit-conversie systeem
├── 07-leveranciers/
│   └── klaar-leveranciers.html         ← Module 07 🔧 In ontwikkeling
└── 10-catering-events/
    └── klaar-catering.html             ← Module 10 🔧 In ontwikkeling
```

---

## Modules & Status

| # | Module | Prijs | Status | Bestand |
|---|--------|-------|--------|---------|
| 01+02 | Recepten & Allergenen (volledig samengevoegd) | €22/m | ✅ LIVE | `01-recept-studio/klaar-recept-studio.html` |
| 03 | HACCP & Voedselveiligheid | €22/m | ✅ LIVE | `03-haccp/klaar-haccp.html` |
| 04 | Kostprijs Calculator | €22/m | 🔧 v2.1 | `04-kostprijs/klaar-kostprijs.html` |
| 07 | Leveranciersprijzen (Hanos) | €22/m | 🔧 Beta | `07-leveranciers/klaar-leveranciers.html` |
| 10 | Catering & Events | €22/m | 🔧 Beta | `10-catering-events/klaar-catering.html` |

**Full suite:** €89/m (losse modules €110/m)

> Module 01 en 02 zijn volledig samengevoegd in `klaar-recept-studio.html`. De M02-file bestaat nog als backup maar wordt niet meer gelinkt. `klaar_recipes` structuur ongewijzigd — alle andere modules lezen hier nog gewoon uit.

---

## Gedeelde localStorage keys (tussen modules)

| Key | Eigenaar | Inhoud |
|-----|----------|--------|
| `klaar_recipes` | Module 01 | Array van recepten `{id, title, recipe: {ingredients, steps}}` |
| `klaar_ingredienten` | Module 04 | Array van ingrediënt-objecten (zie hieronder) |
| `klaar_kostprijs_settings` | Module 04 | `{defaultFoodcost, btwPercentage, factor, typeZaak}` |
| `klaar_recept_links` | Module 04 | `{receptId: [{_origIdx, ingId, hoeveelheid, eenheid}]}` |
| `klaar_populariteit` | Module 04 | `{receptId: 'hoog' \| 'laag'}` |
| `klaar_producten` | Module 07 | Array van Hanos-producten `{id, naam, prijs, eenheid, categorie}` |
| `klaar_haccp_log` | Module 03 | HACCP logboekentries |

### Ingrediënt object structuur (Module 04 v2.1)
```json
{
  "id": "ing_abc123",
  "naam": "Kipfilet",
  "eenheid": "kg",
  "inkoopprijs": 8.50,
  "leverancier": "Hanos",
  "categorie": "vlees",
  "lastUpdated": "2026-06-11",
  "source": "manual",
  "gramPerStuk": 70,
  "gramPerEl": null,
  "m07_product_id": null
}
```

---

## Module 04 — Kostprijs Calculator — volledig overzicht

**Versie 2.1.0** — het meest recente werk van de vorige chats.

### Tabs
1. **🧮 Bereken** (primaire tab) — recept-picker grid → klik gerecht → direct kostprijsberekening
2. **Overzicht** — dashboard met KPI's en Menu Engineering Matrix
3. **Ingrediënten** — bibliotheek met CRUD, prijswijziging-detectie, M07-koppeling
4. **Losse Berekening** — zonder recept (modus A + B)
5. **Instellingen** — foodcost%, BTW, factor, type zaak

### Slimme Eenheidsvertaler (v2.1)

Het kernprobleem in Module 04 is de brug tussen recepteenheden en inkoopprijzen:

**Functies:**
- `unitToGrams(amt, unit)` — converteert recepteenheid naar grammen
- `calcIngCost(ingAmount, ingUnit, prijs, libEenheid, libIng)` — berekent kosten per ingrediënt
- `lookupGramPerStuk(naam)` — auto gramgewicht per naam (ui=70g, knoflook=5g, ei=60g, etc.)
- `lookupGramPerEl(naam)` — gram per eetlepel voor dichte producten (tomatenpuree=20g, olie=10g)
- `getBerekenPriceConfig(recIng)` — bepaalt juiste prijsinvoer (€/blik, €/kg, €/stuk)

**Bereken tab prijsinvoer per eenheidstype:**
- **Stuks** (ui, ei, etc.): toont `€/kg` + `gram per stuk [70]g` — auto ingevuld, aanpasbaar
- **El/tl**: toont `€/kg` + toggle "per tube/pak?" → `€[prijs] voor [gram]g`
- **Blik/pot/pak/etc.**: toont `€/blik` etc., converteert intern naar €/kg

**Openstaande issues (voor de nieuwe chat):**
1. Eenheidsberekening werkt nog niet perfect voor alle ingrediënten/scenario's
2. Bestaande localStorage-data heeft geen `gramPerStuk` → lookup werkt wel op naam
3. `eenheid` in modal dropdown is beperkt (geen tube, blik 400g etc.)
4. Sommige ingrediënten in database hebben eenheid='stuk' (per-stuk-prijs) maar zouden 'kg' moeten zijn

---

## Module 07 — Leveranciersprijzen

- Foto-import van facturen (anomalie-detectie)
- Handmatig invoeren producten
- Bewaartype-classificatie (HACCP-koppeling)
- Voorraadbeheer
- Dashboard met KPI's
- Slimme bewaartype-classificatie op basis van productnaam
- Koppelt via `klaar_producten` aan Module 04

---

## Module 03 — HACCP

- CCP-analyse met AI
- Logboek bijhouden
- FIFO-controles
- Koppeling temperatuurregistratie
- Bewerkt: delete-knop toegevoegd, UX ontvangst-controles verbeterd (2026-06-10)

---

## Werkwijze (vaste regels voor alle modules)

1. **Single-file HTML** — alles inline (CSS, JS, HTML), geen externe scripts behalve Google Fonts
2. **localStorage** — geen backend, data wordt lokaal opgeslagen in de browser
3. **Altijd backup** maken voor grote wijzigingen: `backups/[naam]_backup_YYYYMMDD_HHMMSS.html`
4. **MODULE.md bijwerken** na elke sessie
5. **Geen frameworks** — vanilla JS, geen React/Vue/etc.
6. **Design**: `--black: #0a0a0a`, `--lime: #e8ff47`, `--bg: #f5f5f3`, Bebas Neue + DM Sans + DM Mono

---

## Supabase Roadmap (toekomstige backend)

> **Bouw nu altijd met Supabase in het achterhoofd.** Elke architectuurkeuze moet straks migreerbaar zijn.

### Fase 1 (nu — pre-Supabase)
- localStorage voor alle data
- Anthropic API key direct in browser (via `klaar_api_key` in localStorage)
- Statische HTML-bestanden, geen accounts

### Fase 2 (bij eerste betalende klanten — Supabase Lite)
- **Supabase Auth** — email/wachtwoord login, magic link
- **Supabase Edge Functions** als AI-proxy:
  - Eén Anthropic API key (van Klaar), niet zichtbaar in de browser
  - `POST /ai/chat` → Edge Function → Anthropic API → SSE terug
  - Kosten per klant bijhouden via metadata
- **localStorage blijft** voor module-data (per device, snel)
- Data-migratie optioneel: export/import JSON per klant

### Fase 3 (schaalbaar platform)
- **Supabase Database (Postgres)** — recepten, ingrediënten, HACCP-logs per account
- **Row Level Security (RLS)** — elke klant ziet alleen zijn eigen data
- **Realtime** — meerdere apparaten gesynchroniseerd
- **Admin dashboard** — klantoverzicht, API-kosten, modulestatus
- **Supabase Storage** — foto's van facturen, productfoto's

### Regels voor huidige ontwikkeling (hou dit in gedachten)
1. **localStorage keys nooit hardcoded in logica** — gebruik altijd constanten/variabelen
2. **Data-structuren JSON-serialiseerbaar houden** — makkelijk naar Supabase te migreren
3. **API calls altijd via een functie** — later vervangen door Edge Function proxy
4. **Geen server-side logica in HTML** — scheiding aanhouden
5. **Chat AI-acties loggen** — later trackbaar per klant voor kosten/analytics

---

## Hoe een nieuwe sessie te starten

**Voor Module 04 (Kostprijs):**
```
Lees /Users/cloudchief/Desktop/Klaar/START-HIER.md
Lees /Users/cloudchief/Desktop/Klaar/04-kostprijs/MODULE.md
Dan aan de slag met: [jouw vraag]
```

**Voor het Dashboard:**
```
Lees /Users/cloudchief/Desktop/Klaar/START-HIER.md
Lees /Users/cloudchief/Desktop/Klaar/DASHBOARD-PROMPT.md
Dan aan de slag met: [jouw vraag]
```

**Voor een andere module:**
```
Lees /Users/cloudchief/Desktop/Klaar/START-HIER.md
Lees /Users/cloudchief/Desktop/Klaar/[module-map]/MODULE.md
Dan aan de slag met: [jouw vraag]
```

---

## Context vorige chats (wat is er al gedaan)

### Chat 1-3 (Modules 01, 02, 03, 07)
- Module 01: Recept Studio — spraak→recept, CRUD, ingredient-export naar M04
- Module 02: Allergenenkaart — EU-14 auto-matrix vanuit Module 01
- Module 03: HACCP — delete-knop, ontvangst-controles verbeterd, bewaartype-classificatie
- Module 07: Leveranciersprijzen — foto-import, anomalie-detectie, voorraad, dashboard

### Chat (Chat Assistent rollout + kwaliteitsfix — 2026-06-12)
- **Chat widget** uitgerold naar alle 6 actieve modules (01, 02, 03, 04, 07, 10) + dashboard
- **POS-context** ingebouwd in alle assistenten: unTill, Lightspeed, Hanos, Bidfood etc.
- **Commerciële intelligentie**: subtiele upsell max 1x per gesprek, organisch, nooit pusherig
- **Foto-upload + CSV-import**: Module 04 (Kostprijs) en Module 07 (Leveranciers)
- **Chat-acties**: `[KLAAR:SET_SETTING]` en `[KLAAR:ADD_INGREDIENT]` in M04, `[KLAAR:ADD_PRODUCT]` in M07
- **RESPONSLENGTE fix**: alle 7 bestanden — max 3-4 zinnen, geen headers/bold, max 1 emoji, max 1 vraag
- **Recept-uit-bibliotheek fix** (M01): klaar_ingredienten doorgegeven aan context, onderscheid recepten vs losse ingrediënten duidelijk gemaakt
- **KASSASYSTEMEN.md** aangemaakt: complete kennisbank POS/concurrenten/groothandels
- **Cross-module data audit**: alle assistenten geaudit op data-toegang, ontbrekende data en acties gefixed
  - M02: klaar_ingredienten + allergeendetail per recept toegevoegd
  - M03: klaar_producten + ADD_HACCP_LOG actie (direct loggen via chat)
  - M07: klaar_ingredienten + klaar_recipes + SYNC_TO_INGREDIENT (cross-module schrijven naar M04)
  - M10: klaar_ingredienten + klaar_kostprijs_settings + klaar_populariteit + ADD_EVENT actie

### Deze chat (Module 04 focus — 2026-06-11)
- **v2.0 redesign**: nieuwe Bereken tab als primaire tab (recept-picker grid)
- **Unit-conversie fix**: `calcIngCost` gebruikt nu originele recepteenheden (niet link.hoeveelheid)
- **Slimme Eenheidsvertaler**: lookup tabellen, gramPerStuk, tube/pak helper
- **Modal uitbreiding**: gramPerStuk veld, auto-ingevuld, gps-row visibility logic
- **✎ bewerk-knop**: prijs aanpassen direct vanuit Bereken tab
- **calcReceptKostprijs** fix: laadt nu ook recept-data voor correcte berekening

---

## Snelle referentie — Module 04 sleutelfuncties

```javascript
// Eenheidsconversie
unitToGrams(amt, unit)                          // "blik (400 g)" → 400g
calcIngCost(ingAmount, ingUnit, prijs, libEenheid, libIng) // kernberekening
lookupGramPerStuk(naam)                         // "uien" → 70
lookupGramPerEl(naam)                           // "tomatenpuree" → 20

// Bereken tab
renderReceptPicker()                            // toont recept-kaarten grid
selectRecept(id)                                // laad recept in bereken-view
updateBerekenResult()                           // herbereken KPIs + breakdown
saveBerekenPrice(ingId, rowIdx)                 // sla prijs op vanuit Bereken tab
saveBerekenPricePkg(ingId, rowIdx)              // sla tube/pak-prijs op
togglePkgHelper(rowIdx)                         // toon/verberg package helper

// Bibliotheek
autoImportFromRecipes()                         // importeer ingrediënten uit M01
autoMatchLinks(r)                               // koppel ingrediënten aan bibliotheek
calcReceptKostprijs(receptId)                   // bereken totale receptkostprijs

// Modal
openIngModal(id)                                // open ingrediënt bewerken modal
saveIngredient()                                // sla ingrediënt op (incl. gramPerStuk)
updateGpsRowVisibility()                        // toon/verberg gramPerStuk veld
```
