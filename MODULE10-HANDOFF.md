# Module 10 — Catering & Events · Handoff document
**Datum:** 2026-06-10 · **Versie:** 1.2.0 · **Status:** Functioneel compleet

Plak dit document als context in een nieuwe Cowork chat voor Module 10.

> **Belangrijk:** Koppel eerst je map via het mapje-icoontje in Cowork → selecteer `/Users/cloudchief/Desktop/Klaar`. Zonder gekoppelde map kan de AI de bestanden niet lezen.

---

## Context voor de AI

Je werkt aan **Klaar**, een suite van single-file HTML-modules voor horeca. Module 10 is de Catering & Events module. Je rol: debuggen, uitbreiden en verbeteren van `klaar-catering.html`.

**Projectstructuur:**
- Werkbestand: `/Users/cloudchief/Desktop/Klaar/10-catering-events/klaar-catering.html` (~2000 regels)
- Backups: `/Users/cloudchief/Desktop/Klaar/10-catering-events/backups/`
- Git repo (Vercel deploy): `/Users/cloudchief/Documents/GitHub/getklaar/10-catering-events/klaar-catering.html`
- MODULE.md (volledige docs): `/Users/cloudchief/Desktop/Klaar/10-catering-events/MODULE.md`

**Workflow:**
1. Wijzigingen altijd eerst in het werkbestand op Desktop
2. Daarna kopiëren naar getklaar repo: `cp "/Users/cloudchief/Desktop/Klaar/10-catering-events/klaar-catering.html" "/Users/cloudchief/Documents/GitHub/getklaar/10-catering-events/klaar-catering.html"`
3. Commit & push via GitHub Desktop → Vercel deployt automatisch

---

## Technische regels (KRITIEK — niet vergeten)

### 1. CSS scope
Alle schermstijlen moeten BUITEN de `@media print {}` block. Die block begint vroeg in het CSS (~regel 242). Stijlen die per ongeluk inside de print query terechtkomen zijn op het scherm onzichtbaar maar geven geen foutmelding — moeilijk te debuggen.

### 2. Tab panels — NOOIT inline style
```css
/* Goed — alleen CSS: */
#tab-intake.active { display: flex; flex-direction: column; overflow: hidden; }

/* FOUT — inline style overschrijft display:none voor inactieve tabs: */
<div id="tab-intake" style="display:flex">  ← breekt alle andere tabs
```

### 3. Save bar layout
De save bar is een `flex-shrink: 0` child van `#tab-intake`. Werkt alleen correct als `#tab-intake.active` een flex-column is. De `.panel-inner` heeft `flex: 1; overflow-y: auto` zodat de content scrollt maar de bar niet.

### 4. Allergen normalisatie
Recipe Studio slaat allergenen op als `r.recipe.allergens` (genest, huidig formaat) of `r.allergens` (top-level, oud). Codes zijn anders dan EU14 — gebruik altijd `normalizeAllergen()` + `CODE_ALIASES` map die al in het bestand zit.

---

## Wat er al in zit (v1.2.0)

- **Agenda tab**: eventoverzicht, dag-afkorting (MA/DI/WO), stats, filters, 🎭 Demo laden knop
- **Intake tab**: volledig formulier, collapsibele secties, recept picker (Module 01 integratie), arrangement bibliotheek, save bar fixed onderaan
- **Sheets tab**: keukensheet + bedieningssheet met EU14 allergeenicoontjes per gang, dieetwensen geel gemarkeerd, print layout
- **Offerte tab**: professionele offerte, auto-offerte-nummer, BTW-berekening
- **Instellingen tab**: bedrijfsgegevens, betalingsvoorwaarden, arrangement bibliotheek beheer
- **Demo event**: Familie Vermeer-De Jong, 68 gasten, 5-gangen bruiloftsmenu, 14 tijdlijn items, 4 dieetwensen — laadbaar via 🎭 knop

---

## localStorage

| Key | Inhoud |
|-----|--------|
| `klaar_events` | Array van event-objecten |
| `klaar_catering_settings` | Bedrijfsgegevens + betalingsvoorwaarden |
| `klaar_menu_templates` | Arrangement-templates |

---

## Bekende bugs / beperkingen

- Geen: module is functioneel compleet voor v1.0 scope

---

## Mogelijke volgende stappen

- **Kostprijsberekening**: bij selectie recept vanuit Module 04, automatisch prijs per persoon berekenen
- **Personeelskoppeling**: event-datum blokkeren in Module 06 personeelsplanning
- **Herinnerings-email**: geautomatiseerde betalingsherinnering (aanbetaling)
- **Meerdaagse events**: ondersteuning voor events die meerdere dagen duren
- **Event dupliceren**: snel een bestaand event kopiëren als template voor vergelijkbaar event
- **Exporteren naar PDF**: offerte direct als PDF opslaan (via browser print-naar-PDF)
- **Zoeken/filteren in agenda**: zoekbalk voor eventnaam of klant

---

## Andere Klaar modules (context)

De suite bestaat uit losse single-file HTML modules die via localStorage data delen:

| Module | Bestand | localStorage key |
|--------|---------|-----------------|
| 01 — Recept Studio | klaar-recepten.html | `klaar_recipes` |
| 02 — Allergenenkaart | klaar-allergenen.html | (leest van Module 01) |
| 04 — Kostprijs | klaar-kostprijs.html | `klaar_kostprijs_*` |
| 06 — Personeelsplanning | klaar-personeel.html | `klaar_personeel_*` |
| 10 — Catering & Events | klaar-catering.html | `klaar_events`, `klaar_catering_settings`, `klaar_menu_templates` |

Alle modules staan in: `/Users/cloudchief/Desktop/Klaar/`  
Git repo: `/Users/cloudchief/Documents/GitHub/getklaar/`  
Live op: Vercel (auto-deploy via GitHub Desktop)
