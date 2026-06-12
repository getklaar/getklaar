# Klaar — Project Hub

Dashboard met standalone modules voor de horecasector (Limburg, NL).
Visueel, gebruiksvriendelijk, alles direct toegankelijk.

## Modules

| Map | Module | Prijs | Status |
|-----|--------|-------|--------|
| `01-recept-studio/` | Spraak → Recept (keuken, cocktails, koffie) | €29/m | ✅ Live |
| `02-allergenenkaart/` | EU-14 allergenenmatrix — auto uit Module 01 | €19/m | ✅ Live |
| `03-haccp/` | HACCP & Voedselveiligheid — AI CCP-analyse | €29/m | ✅ Live |
| `04-kostprijs/` | Kostprijs Calculator — live inkoopprijzen | €39/m | 🔧 In ontwikkeling (v2.1) |
| `05-heatmap/` | Drukte Heatmap — bezetting voorspellen | €49/m | 🔜 Binnenkort |
| `06-personeelsplanning/` | Personeelsplanning | €49/m | 🔜 Binnenkort |
| `07-leveranciersprijzen/` | Live Hanos-prijzen + margeberekening | €29/m | 🔜 Binnenkort |
| `08-menubuilder/` | Menu Builder — kostprijs + allergenen | €29/m | 🔜 Binnenkort |
| `09-reserveringen/` | Reserveringen — koppeling met heatmap | €29/m | 🔜 Binnenkort |

**Full suite:** €179/m (los samen €301/m — besparing €122/m = €1.464/jaar)

## Dashboard

- Bestand: `index.html`
- Backup: `index_backup_YYYYMMDD_HHMMSS.html`
- Vergelijkingstabel bijgewerkt: Klaar vs appHoreca vs Horeko (Exact)
- Stat: 3 modules live, Module 04 in ontwikkeling (v2.1 — unit-conversie systeem)

## Nieuwe chat starten voor een module

Zeg tegen Claude:
"Lees /Users/cloudchief/Desktop/Klaar/[module-map]/MODULE.md en het HTML-bestand — [jouw vraag of taak]"

## Supabase Roadmap

| Fase | Trigger | Wat |
|------|---------|-----|
| **Nu** | — | localStorage + directe Anthropic API key in browser |
| **Fase 2** | Eerste betalende klanten | Supabase Auth + Edge Function als AI-proxy (één API key) |
| **Fase 3** | Schalen | Postgres per klant, RLS, Realtime sync, Admin dashboard |

> Bouw nu altijd met Supabase in gedachte: JSON-data, functies voor API-calls, localStorage keys via variabelen.

---

## Nieuwe module aanmaken

Maak een map aan: `0X-[naam]/` met daarin:
- `MODULE.md` — beschrijving, techniek, features, buglog, bouw-prompt
- `[naam].html` — de werkende module
- `backups/` — datumgestempelde backups

## Eikpunten (vaste afsluiting na elke sessie)

1. Backup HTML-bestand met timestamp
2. README.md bijwerken (module status, prijzen)
3. DASHBOARD-PROMPT.md bijwerken (module status)
4. MODULE.md van gewijzigde module bijwerken
5. Nieuwe backup aanmaken in `backups/` map
