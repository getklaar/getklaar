# MODULE 04 — Kostprijs Calculator

**Status:** In ontwikkeling (unit-conversie bugs gedeeltelijk opgelost)  
**Versie:** 2.1.0  
**Datum:** 2026-06-11  
**Bestand:** `klaar-kostprijs.html`

---

## Wat doet deze module

De financiële spil van Klaar. Berekent de kostprijs per gerecht op basis van inkoopprijzen uit de ingrediëntenbibliotheek, gekoppeld aan recepten uit Module 01.

---

## Tabs

### 0. 🧮 Bereken (primaire tab — v2.0)
- Receptenkaarten grid — klik = direct berekening
- Zoekbalk om snel een gerecht te vinden
- Resultaten: Kostprijs/portie · Verkoopprijs excl/incl BTW · Foodcost%
- Sliders: Foodcost% (15–50%) en Porties (1–20) — live bijwerkend
- **Slimme prijsinvoer per eenheidstype:**
  - Stuks (ui, ei, etc.): toont `€/kg` + `gram per stuk` veld (auto-ingevuld uit lookup tabel)
  - El/tl (tomatenpuree, olie, etc.): toont `€/kg` + optionele "per tube/pak" helper
  - Verpakkingen (blik, pot, pak, zak, etc.): toont `€/blik` etc. en converteert naar €/kg
- ✎ knop per ingredient om prijs te bewerken via modal
- Berekeningshint voor stuk-eenheden: "2 stuks × 70g = 140g"
- Psychologische prijspunten (bijv. €12,95 i.p.v. €13,20)
- Printknop: kostprijskaart A4

### 1. Overzicht (Dashboard)
- KPI-kaarten: gemiddelde foodcost%, gerechten doorgerekend, duurste gerecht, bibliotheekgrootte
- Gerechten tabel met kleurcodering (groen/oranje/rood op foodcost%)
- Menu Engineering Matrix (Stars / Plowhorses / Puzzles / Dogs) — populariteit handmatig instelbaar per gerecht

### 2. Ingrediëntenbibliotheek
- CRUD: toevoegen, bewerken, verwijderen
- **Nieuw: `gramPerStuk` veld** — verschijnt automatisch voor stuk-ingrediënten, auto-ingevuld uit lookup
- Automatische suggesties vanuit `klaar_recipes` (Module 01)
- Eenheidsconversie: prijs per kg → per gram (ook liter, stuk, fles, 100g)
- Categorieën: vlees, vis, groente, zuivel, dranken, droog, overig
- Zoekfunctie + categoriefilter
- Prijswijziging-detectie: toont welke gerechten worden geraakt bij bewerken

### 3. Recepten doorrekenen (legacy tab)
- Laadt recepten uit `klaar_recipes` (Module 01)
- Koppel elk ingrediënt aan bibliotheek via dropdown
- Live kostprijsberekening per portie

### 4. Losse Berekening
- **Modus A — Kostprijs → Verkoopprijs**
- **Modus B — Vraaggestuurd**
- Opslaan als "concept"

### 5. Instellingen
- Standaard foodcost% (default 28%)
- BTW percentage (9% of 21%)
- Vermenigvuldigingsfactor (default 3.5)
- Type zaak (fine dining / brasserie / café / fastfood)

---

## localStorage keys

| Key | Inhoud |
|-----|--------|
| `klaar_ingredienten` | Array van ingrediëntobjecten (zie structuur hieronder) |
| `klaar_kostprijs_settings` | `{ defaultFoodcost, btwPercentage, factor, typeZaak, drinksSplit }` |
| `klaar_losse_berekeningen` | Array van opgeslagen losse berekeningen |
| `klaar_recept_links` | `{ receptId: [{_origIdx, ingId, hoeveelheid, eenheid}] }` |
| `klaar_populariteit` | `{ receptId: 'hoog' \| 'laag' }` |
| `klaar_recipes` | Gelezen uit Module 01 (read-only) |

---

## Ingrediënt object structuur (v2.1)

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
  "gramPerEl": null
}
```

- `gramPerStuk`: optioneel — gram per stuk (bijv. ui=70, ei=60, knoflookteen=5). Wordt auto-gevuld uit `GRAM_PER_STUK` lookup tabel op naam.
- `gramPerEl`: optioneel — override gram per eetlepel voor dichte producten. Normaal auto uit `GRAM_PER_EL_DENSE` lookup tabel.
- `source`: `"manual"` of `"module_07"` (bij Hanos-koppeling)

---

## Eenheidsconversie systeem (v2.1 — Slimme Eenheidsvertaler)

### Functies
- `unitToGrams(amt, unit)` — zet recept-eenheid om naar grammen (blik(400g) → 400, el → 15, kg → 1000, etc.)
- `calcIngCost(ingAmount, ingUnit, prijs, libEenheid, libIng)` — berekent kosten van 1 ingrediënt
- `lookupGramPerStuk(naam)` — zoekt gramgewicht per stuk op naam (30+ ingrediënten)
- `lookupGramPerEl(naam)` — zoekt gramgewicht per el voor dichte producten (tomatenpuree=20g, olie=10g, etc.)
- `getBerekenPriceConfig(recIng)` — geeft de juiste prijs-invoer configuratie (€/blik, €/kg, €/stuk)

### Lookup tabellen (ingebakken)
**GRAM_PER_STUK**: ui=70g, knoflookteen=5g, ei=60g, aardappel=150g, tomaat=100g, champignon=15g, paprika=150g, wortel=100g, etc.

**GRAM_PER_EL_DENSE**: tomatenpuree=20g, olie=10g, boter=12g, bloem=10g, suiker=10g, honing=20g, zout=11g, etc.

### Verpakkings-to-kg conversie
Blik (400g standaard of uit haakjes) → €/blik omrekenen naar €/kg  
Pot (300g), Pak/Zak (500g), Fles (750g), Brik (1000g)

---

## Bekende openstaande issues (2026-06-11)

1. **Stuks-eenheden**: Berekening met gramPerStuk werkt, maar sommige ingrediënten in de database hebben nog eenheid='stuk' (per-stuk-prijs) ipv 'kg' (per-kg-prijs met gramPerStuk bridge). Kan inconsistentie geven bij bestaande data.

2. **El/tl voor vloeistoffen vs. pasta**: El-berekening gebruikt 15g/el standaard of dense-lookup. Voor sommige producten klopt dit nog niet precies.

3. **Per-eenheid dropdown modal**: Beperkte opties (kg, liter, stuk, 100g, fles). Geen "tube", "blik 400g" etc. als modal-optie. Workaround: gebruik de Bereken tab tube/pak-helper.

4. **Bestaande ingrediënten**: Eerder ingevoerde ingrediënten in localStorage hebben geen `gramPerStuk`. Auto-lookup via naam werkt wel, maar handmatig bijwerken via modal is netter.

---

## Versiegeschiedenis

| Versie | Datum | Wijzigingen |
|--------|-------|-------------|
| 1.0.0 | 2026-06-07 | Initiële versie — basis kostprijsberekening |
| 1.1.0 | 2026-06-10 | M07-koppeling (live Hanos-prijzen fallback) |
| 2.0.0 | 2026-06-11 | UX redesign: Bereken tab als primaire tab, recept-picker grid |
| 2.1.0 | 2026-06-11 | Slimme Eenheidsvertaler: unit-conversie fix, gramPerStuk, tube/pak helper |

---

## Koppeling andere modules

- **Module 01 (Recept Studio):** leest `klaar_recipes` — recepten + ingrediënten auto geladen
- **Module 07 (Leveranciersprijzen):** `source: "module_07"` veld klaar voor live Hanos-prijzen
- **Module 08 (Menu Builder):** zal kostprijsdata en verkoopprijzen ophalen

---

## Benchmarks (ingebakken)

| Type zaak | Gezonde foodcost | Factor |
|-----------|-----------------|--------|
| Fine dining | 30–35% | ×2.9–3.3 |
| Brasserie/bistro | 25–30% | ×3.3–4.0 |
| Café/lunchroom | 25–30% | ×3.3–4.0 |
| Fastfood/take-away | 20–25% | ×4.0–5.0 |
| Dranken | 10–20% | ×5.0–10× |
