# Klaar — Module 02: Allergenenkaart

## Wat doet dit?
Auto-gegenereerde allergenenmatrix voor de horecasector. Leest recepten rechtstreeks uit Module 01 (localStorage `klaar_recipes`) en toont per gerecht welke van de 14 EU-allergenen aanwezig zijn. Klaar voor NVWA-inspectie.

## Bestanden
- `klaar-allergenenkaart.html` — werkende module (open in Chrome of Edge)
- `backups/` — datumgestempelde backups

## Techniek
- **Databron:** localStorage key `klaar_recipes` (geschreven door Module 01)
- **Geen backend, geen API** — alles client-side
- **Live sync:** luistert naar `storage` events → matrix update automatisch als Module 01 open is in een ander tabblad
- **Fonts:** Bebas Neue + DM Sans + DM Mono via Google Fonts

## Features (volledig werkend)
- 📊 Matrix: alle gerechten als rijen, 14 EU-allergenen als kolommen
- 🎨 Kleurgecodeerde indicators per allergeen (unieke kleur per allergeen)
- 📂 Gesorteerd per categorie (Keuken / Bar / Koffie / Archief)
- 🔘 Filter tabs per categorie — automatisch gegenereerd op basis van aanwezige data
- 🖱️ Klikbare rijen → slide-in detail panel met volledige allergeenlijst
- 🖨️ Print A4 (landscape) — NVWA-proof, inclusief datum + EU-verordening watermark
- ⚠️ Lege state met link naar Module 01 als er nog geen recepten zijn
- ⚠️ `geen data` badge op recepten zonder allergeendata (oud recept — hergeneer in Module 01)
- 🌰 NM (Nootmuskaat) als aparte 15e kolom — duidelijk gemarkeerd als niet-officieel EU-14

## Allergenen — EU-14 (Verordening EU 1169/2011)
| Code | Naam         |
|------|--------------|
| G    | Gluten       |
| S    | Schaaldieren |
| E    | Eieren       |
| Vi   | Vis          |
| P    | Pinda        |
| So   | Soja         |
| M    | Melk         |
| N    | Noten        |
| Se   | Selderij     |
| Mo   | Mosterd      |
| Sa   | Sesam        |
| Su   | Sulfieten    |
| L    | Lupine       |
| W    | Weekdieren   |

**Extra (niet EU-14):**
- `NM` — Nootmuskaat: geen officieel EU-14 allergeen (zaad/specerij, geen noot), maar Module 01 vlagt het als veiligheidsmarge voor notenallergici.

## Data-koppeling met Module 01
Module 01 slaat recepten op in localStorage onder `klaar_recipes`. Structuur per recept:
```json
{
  "id": "...",
  "title": "Klassieke Bolognese Saus",
  "type": "kitchen",
  "folder": "keuken",
  "language": "nl",
  "updatedAt": "2026-...",
  "recipe": {
    "title": "...",
    "servings": "4 personen",
    "allergens": [
      {"code": "G", "name": "Gluten"},
      {"code": "M", "name": "Melk"}
    ]
  }
}
```
Module 02 leest: `r.folder` (categorie), `r.recipe.allergens` (allergenen), `r.recipe.servings` (porties).

## Bekende bugs (opgelost)
- Allergenen niet zichtbaar → `r.allergens` (top-level) bestaat niet, data zit in `r.recipe.allergens`
- Categorie niet herkend → Module 01 gebruikt `folder`, niet `category`
- Bovenste rij verborgen / niet scrollbaar → `overflow: hidden` op wrapper brak sticky thead; opgelost met eigen scroll-container op `.matrix-scroll` (`overflow-y: auto; max-height: calc(100vh - 240px)`) en `top: 0` sticky thead

## Data-kwaliteit
Als een recept `⚠ geen data` toont, is het gegenereerd vóór de allergeenanalyse werd verbeterd. Oplossing: open het recept in Module 01 en klik opnieuw op "Maak recept".

## Deployment
- Zelfde stack als Module 01: statische HTML → GitHub (getklaar/getklaar) → Vercel (getklaar.vercel.app)
- Lokaal testen: open `index.html` vanuit `/Users/cloudchief/Desktop/Klaar/`
- Geen aparte setup nodig — werkt zodra Module 01 recepten heeft opgeslagen

## Toekomstige architectuur (online)
- localStorage → Supabase (Postgres) wanneer multi-user of cross-device sync nodig is
- De data-accessors (`getAllergens`, `getFolder`, `getServings`) zijn bewust losgekoppeld zodat de overstap een dagje werk is, niet een herbouw
- Realtime sync via Supabase subscriptions vervangt dan de huidige `storage` event listener

## In een nieuwe chat gebruiken
Zeg tegen Claude:
"Lees /Users/cloudchief/Desktop/Klaar/02-allergenenkaart/klaar-allergenenkaart.html en MODULE.md — dit is module 02 van het Klaar project. [jouw vraag]"
