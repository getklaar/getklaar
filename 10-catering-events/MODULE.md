# MODULE 10 — Catering & Events

**Status:** Live  
**Versie:** 1.2.0  
**Datum:** 2026-06-10  
**Bestand:** `klaar-catering.html`  
**Prijs:** €29,50/m (inbegrepen in full suite)

---

## Wat doet deze module

Alles voor cateraars, feestzalen, foodtrucks en restaurants die feesten en partijen organiseren. Van intake-gesprek met de klant tot professionele keuken- en bedieningssheet — in één tool.

Directe concurrentie met CaterMonkey (€120/m) en Constell/Magic (€150+/m), maar dieper geïntegreerd met de andere Klaar-modules.

---

## Tabs

### 1. Agenda
- Overzicht van alle events gesorteerd op datum
- Kleurcodering: bevestigd (groen), concept (grijs), voorbij (gedimd)
- Stats: events deze maand, aankomende events, gasten totaal, verwachte omzet
- Filter: alle / concept / bevestigd / voorbij
- Datum-blokken tonen dag-afkorting (MA/DI/WO/DO/VR/ZA/ZO) boven dag-nummer
- Klik op event → opent in Intake
- **🎭 Demo laden** knop: laadt een volledige demo-bruiloft voor testen van sheets/offerte

### 2. Intake
Volledig intake-formulier met collapsibele secties:
- **Klantgegevens**: naam, bedrijf, telefoon, e-mail, aanspreekpunt op de dag, factuuradres
- **Event details**: type, datum, aanvang/einde, locatie, aantal personen/kinderen, status
- **Menu**: dynamische rijen met gang (amuse t/m walking dinner), omschrijving, tijdstip uitserveren
  - Per rij: **🔍 Recept** knop opent recepten-picker (naam + type + aantalPersonen — geen allergeenchips)
  - Allergenen worden onzichtbaar opgeslagen in `menu[].allergenen` voor gebruik op sheets
- **Tijdlijn**: per moment → tijd, actie, voor wie (bediening/keuken/beiden) — gesorteerd op tijd
- **Dieetwensen**: per gast naam + wens + allergie
- **Financieel**: prijs per persoon, BTW, aanbetaling, auto-berekend totaal
- **Bijzonderheden**: extern (op sheet) + interne notities
- **Save bar** vast onderaan (flexbox layout), niet scrollerend

### 3. Sheets
- Selecteer event → keuken- en bedieningssheet direct gegenereerd
- **Keukensheet**: menu met tijden + allergeenicoontjes per gang, dieetwensen (geel gemarkeerd), dranken, bijzonderheden
- **Bedieningssheet**: klantcontact, tijdlijn, menu, dranken, bijzonderheden/verrassingen, financieel
- Print-knop: professionele A4 layout met bedrijfsnaam, datum, meta-balk
- Dieetwensen op keukensheet hebben gele achtergrond voor aandacht
- Datumweergave: "WO 15-07-2026" formaat (dag-afkorting + datum)

### 4. Offerte
- Professionele offerte voor de klant
- Header met bedrijfsnaam + contactgegevens (uit Instellingen)
- Offerte-nummer automatisch gegenereerd
- Menu per gang, dranken, totaalberekening incl. BTW, aanbetaling, restant
- Betalingsvoorwaarden uit instellingen
- Print/PDF knop

### 5. Instellingen
- Bedrijfsnaam, telefoon, e-mail, website, adres
- BTW-nummer (voor offerte)
- Betalingsvoorwaarden (op offerte)

---

## Arrangement Bibliotheek (v1.1)

Een database van herbruikbare menu- en drankenarrangementen. Gebruikers bouwen zo een eigen bibliotheek van vaste menu's die ze bij elk nieuw event opnieuw kunnen laden.

**Hoe het werkt:**
- In Intake → Menu sectie: knop "📂 Laad arrangement" (picker modal) + "💾 Bewaar als arrangement" (save modal)
- In Instellingen → sectie "Arrangementen Bibliotheek": overzicht + verwijder-optie
- Template types: `compleet` (menu + dranken), `menu` (alleen menu), `dranken` (alleen dranken)

**Template object:**
```json
{
  "id": "tmpl_abc123",
  "naam": "Bruiloft 3-gangen diner",
  "type": "compleet",
  "menu": [{"gang": "voorgerecht", "omschrijving": "...", "tijdstip": ""}],
  "dranken": "Huiswijn rood/wit onbeperkt",
  "notitie": "20–60 personen",
  "aangemaakt": "2026-06-10T..."
}
```

---

## Allergen Integratie (v1.2)

Allergenen worden automatisch ingeladen vanuit de Recept Studio (Module 01/02) wanneer een recept geselecteerd wordt.

**Hoe het werkt:**
- Recept picker toont: naam + type + aantal personen (géén allergeenchips)
- Bij selectie: `r.recipe?.allergens || r.allergens || []` ingeladen + genormaliseerd
- Genormaliseerde allergeenobjecten opgeslagen in `menu[].allergenen`
- Allergeenicoontjes verschijnen **alleen** op keukensheet en bedieningssheet
- Code-aliassen overbruggen verschil tussen Recipe Studio codes en EU14:
  - `Vi/Fi → V`, `So/Soja → SO`, `Se/Selderij → SE`, `Mo/Mu → MO`, `Sa/Ses → SES`, `Su → SU`

**EU14 Allergeencodes (gebruikt in module):**
`G, S, ME, E, V, C, SO, PE, SE, MO, SES, SU, WE, L`

---

## localStorage keys

| Key | Inhoud |
|-----|--------|
| `klaar_events` | Array van event-objecten |
| `klaar_catering_settings` | Bedrijfsgegevens + betalingsvoorwaarden |
| `klaar_menu_templates` | Array van arrangement-templates |

---

## Event object structuur

```json
{
  "id": "evt_abc123",
  "type": "bruiloft",
  "status": "bevestigd",
  "datum": "2026-07-15",
  "aanvang": "18:00",
  "einde": "23:30",
  "locatie": "Zaal 1",
  "aantalPersonen": 80,
  "aantalKinderen": 5,
  "klant": {
    "naam": "Jan de Vries",
    "bedrijf": "",
    "telefoon": "06 12345678",
    "email": "jan@example.com",
    "aanspreekpunt": "Marie de Vries · 06 87654321",
    "factuurNaam": ""
  },
  "menu": [
    {
      "gang": "amuse",
      "omschrijving": "Garnaalcocktail",
      "tijdstip": "19:00",
      "receptId": "rec_xyz",
      "allergenen": [
        { "code": "S", "name": "Schaaldieren", "icon": "🦐" }
      ]
    }
  ],
  "dranken": "Huiswijn rood/wit onbeperkt, bier en fris",
  "tijdlijn": [
    { "tijd": "18:00", "actie": "Ontvangst gasten", "voor": "bediening" }
  ],
  "dieetwensen": [
    { "naam": "Petra Jansen", "wens": "Vegetarisch", "allergie": "Noten" }
  ],
  "bijzonderheden": "Verrassingstaart om 21:00 — niet eerder noemen!",
  "notities": "Klant betaalt contant",
  "prijsPerPersoon": 65.00,
  "btw": 9,
  "aanbetaling": 1000,
  "aanbetalingBetaald": true,
  "aangemaakt": "2026-06-10T...",
  "bijgewerkt": "2026-06-10T..."
}
```

---

## Event types

| Value | Label | Icon |
|-------|-------|------|
| bruiloft | Bruiloft | 💒 |
| koffietafel | Koffietafel | ☕ |
| verjaardag | Verjaardag/Jubileum | 🎂 |
| bedrijfsfeest | Bedrijfsfeest | 🏢 |
| borrel | Borrel/Receptie | 🍾 |
| diner | Privédiner | 🍽️ |
| catering | Catering extern | 🚚 |
| kerstdiner | Kerstdiner | 🎄 |
| anders | Anders | 📌 |

---

## Technische details

### CSS scope — kritieke valkuil
- Alle schermstijlen moeten BUITEN `@media print {}` staan
- `.recept-item` CSS staat BUITEN de print media query (was eerder foutief erin — oorzaak van I-beam cursor bug)
- `#tab-intake.active { display: flex; flex-direction: column; overflow: hidden; }` voor save bar fix
- `.save-bar { flex-shrink: 0; }` zodat hij altijd onderaan staat

### Tab switching — kritieke valkuil
- Tab panels staan standaard op `display: none` (CSS)
- Actieve tab krijgt class `active` — CSS regelt de weergave
- **NOOIT** inline `style="display:flex"` op tab panels — dat overschrijft de `display:none` voor inactieve tabs

### Bestandslocaties
- Werkbestand: `/Users/cloudchief/Desktop/Klaar/10-catering-events/klaar-catering.html`
- Backups: `/Users/cloudchief/Desktop/Klaar/10-catering-events/backups/`
- Git repo: `/Users/cloudchief/Documents/GitHub/getklaar/10-catering-events/klaar-catering.html`
- Deploy: Vercel via GitHub Desktop (auto-deploy bij push naar main)

---

## Changelog

### v1.2.0 — 2026-06-10
- Allergen integratie: recepten uit Recipe Studio laden nu automatisch allergenen
- `normalizeAllergen()` + `CODE_ALIASES` voor compatibiliteit Recipe Studio ↔ EU14
- Recepten-picker vereenvoudigd: alleen naam + type + aantal (geen allergeenchips)
- Allergeenicoontjes alleen op keukensheet/bedieningssheet, niet in intake
- Save bar fix: flexbox layout pinned onderaan intake tab
- Cursor fix: `.recept-item` CSS buiten @media print gezet (was de oorzaak van I-beam cursor bug)
- Dag-afkorting (MA/DI/WO etc.) toegevoegd aan agenda datumblokken en sheet headers
- Demo event: 🎭 Demo laden knop voor testdata (Familie Vermeer-De Jong, 68 gasten, 5 gangen)

### v1.1.0 — 2026-06-10
- Arrangement bibliotheek: bewaar en laad herbruikbare menu-templates
- Instellingen tab met bedrijfsgegevens en betalingsvoorwaarden

### v1.0.0 — 2026-06-10
- Initiële release: Agenda, Intake, Sheets, Offerte

---

## Positionering vs. concurrentie

| | CaterMonkey | Constell/Magic | Klaar Module 10 |
|--|-------------|----------------|-----------------|
| Prijs | €120/m | €150+/m | **€29,50/m** |
| Keukensheet | ✅ | ✅ | ✅ |
| Bedieningssheet | ✅ | ✅ | ✅ |
| Offerte | ✅ | ✅ | ✅ |
| AI recepten | ❌ | ❌ | **✅ via Module 01** |
| Live kostprijzen | ✅ | ❌ | **✅ via Module 04** |
| Allergenen auto | ❌ | ❌ | **✅ via Module 02** |
| Inbegrepen in suite | n.v.t. | n.v.t. | **✅ geen meerprijs** |

---

## Koppeling andere modules

- **Module 01** (Recept Studio): ✅ recepten selecteerbaar in menu, allergenen auto-ingeladen
- **Module 02** (Allergenenkaart): ✅ EU14 allergenen tonen op keuken- en bedieningssheet
- **Module 04** (Kostprijs): toekomstig — kostprijs per persoon auto-berekenen vanuit recepten
- **Module 06** (Personeelsplanning): toekomstig — event-datum blokkeert personeel automatisch
