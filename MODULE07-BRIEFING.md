# Module 07 — Leveranciers & Voorraad: Briefing voor nieuwe Cowork chat

Plak dit document aan het begin van een nieuwe Cowork chat om direct op te starten.

---

## Context: het Klaar-project

Klaar is een lokaal draaiend horeca-beheersysteem, opgebouwd uit losse HTML-modules. Alles draait via bestanden in `/Users/cloudchief/Desktop/Klaar/`. Er is geen backend, geen database — alles via localStorage. De modules praten met elkaar via gedeelde localStorage-keys.

Bestaande modules relevant voor Module 07:
- **Module 01** (`01-recept-studio/klaar-recept-studio.html`) — recepten + ingrediënten + allergenen, key: `klaar_recipes`
- **Module 03** (`03-haccp/klaar-haccp.html`) — HACCP registraties + temperatuurcontroles, key: `klaar_haccp`
- **Module 04** (`04-kostprijs/klaar-kostprijs.html`) — kostprijsberekeningen, key: `klaar_kostprijs`
- **Module 10** (`10-catering-events/klaar-catering.html`) — catering & events, key: `klaar_events`

Lees voor de start ook `/Users/cloudchief/Desktop/Klaar/MODULE10-HANDOFF.md` voor de technische werkwijze en kritieke regels die voor alle modules gelden (local-first, backup voor elke wijziging, nooit direct pushen).

---

## Wat is "stokken" in de horeca?

**Stokken** (ook: stockeren, stock opname) = het periodiek tellen van de fysieke voorraad en dit vergelijken met wat er theoretisch zou moeten liggen op basis van inkoop minus verkoop.

De vier verliescategorieën:
- **Spillage** — onbedoeld morsen of verlies tijdens bereiding
- **Waste** — bederf, producten die over datum gaan
- **Eigen gebruik** — personeel dat zelf eet/drinkt
- **Breuk** — kapotte flessen, beschadigd materiaal

Het verschil tussen theoretische en werkelijke voorraad = de **variance**. Een grote variance kan wijzen op diefstal, slechte portionering of waste. Restaurants verliezen gemiddeld €5.000–12.000 per jaar door slecht voorraadbeheer.

---

## Volledige functielijst Module 07

### 1. Drie invoerroutes voor inkoopdata

**Route A — Foto van pakbon (primair)**
Gebruiker klikt "📷 Scan pakbon" → browser opent camera (mobiel) of bestandskiezer. Afbeelding gaat als base64 naar Claude Vision API (zelfde key als Module 01). Claude extraheert automatisch: productnaam, hoeveelheid, eenheid, prijs per eenheid, totaalprijs, leverancier, datum. Geen extra handeling nodig — alles vooraf ingesteld.

Claude prompt vraagt altijd strict JSON terug:
```json
{
  "leverancier": "...",
  "datum": "...",
  "regels": [
    { "product": "...", "hoeveelheid": 6, "eenheid": "fles", "prijs_per_eenheid": 18.50, "totaal": 111.00 }
  ]
}
```

**Route B — Bestand droppen (PDF / Excel / CSV)**
Drag & drop zone. PDF → Claude leest tekst uit. Excel/CSV → direct parsen. Zelfde JSON-output als Route A.

**Route C — Handmatig invoeren**
Fallback en voor correcties. Formulier: leverancier, product, hoeveelheid, eenheid, prijs.

---

### 2. Anomalie-detectie bij elke import

Na elke import vergelijkt het systeem nieuwe prijzen met vorige bekende prijs:
- Afwijking > 15% → ⚠️ geel + "controleer of dit klopt"
- Afwijking > 40% → 🔴 rood + blokkeer, vereis bevestiging
- Eenheid veranderd (kg → stuk) → altijd flaggen
- Product niet herkend → fuzzy match suggestie op bestaande namen
- Totaalregel klopt niet met som van regels → flaggen als OCR-fout

Review scherm vóór opslaan: alle regels zichtbaar, afwijkingen gemarkeerd, per regel bevestigen of corrigeren.

---

### 3. Tabblad 1 — Producten & Prijzen

- Naam, categorie, leverancier, eenheid
- Huidige prijs + vorige prijs + % verandering
- Prijshistorie per product (grafiek of tijdlijn)
- Koppeling naar Module 01 ingrediënt en Module 04 kostprijs
- **Leveranciersvergelijking**: zelfde product bij meerdere leveranciers → toon goedkoopste + verschil in €/maand op basis van verbruik

---

### 4. Tabblad 2 — Voorraad (Stock / Stokken)

**Theoretische voorraad** = openingsstock + inkoop − theoretisch verbruik
**Werkelijke voorraad** = handmatig tellen of barcode scannen
**Variance** = theoretisch − werkelijk

Instelling per product:
- Spillage % (standaard 3%)
- Waste % (standaard 2%)
- Eigen gebruik (vast getal per week)
- Minimum voorraad niveau (onder dit niveau = waarschuwing)

Groot onverklaard verschil = 🔴 verdacht (diefstal of grote fout).

**Verkoop invoeren:**
Kassarapport/dagsluiting droppen (PDF/CSV/foto) → Claude leest verkochte producten uit → koppelt aan recepten Module 01 → berekent theoretisch verbruik automatisch. Alternatief: handmatig invoeren.

**Barcode scannen bij stockopname:**
Camera openen op mobiel, product inscannen, hoeveelheid invoeren. Geen typen. Maakt stokken van 60 minuten naar 10 minuten.

---

### 5. Tabblad 3 — Dashboard

- Totale voorraadwaarde (inkoopprijs × hoeveelheid in stock)
- Top 5 producten met grootste variance
- Geschatte maandelijkse waste-kosten in €
- Prijsstijgingen deze maand per leverancier
- Lage voorraad waarschuwingen
- **Waste benchmark**: jouw waste % per categorie vs. horeca-gemiddelde (vlees ~8%, vis ~12%, groente ~15%) — groot verschil = actie
- **Maandelijkse COGS-rapportage**: inkoopwaarde van verkochte producten, brutomarges per categorie

---

### 6. Automatische inkooporder genereren

Op basis van: huidige stock + minimum niveau + geplande events (Module 10) + gemiddeld dagverbruik berekent het systeem wat er besteld moet worden. Output: een nette PDF-inkooporder per leverancier, klaar om te printen of mailen. Dit vervangt het handmatig bijhouden van bestellijsten.

---

### 7. Seizoenspatronen & voorspellingen

Na 2-3 maanden data ziet het systeem patronen: "december: 3× meer biefstuk", "zomer: 40% meer rosé". Proactieve melding: "volgende maand piekperiode voor [product] — overweeg vroeger te bestellen." Simpel algoritme op basis van historische inkoopdata, geen ML nodig.

---

### 8. Live food cost koppeling (→ Module 04)

Elke keer dat een inkoopprijs wijzigt, herberekent de module automatisch de kostprijs van alle recepten in Module 01 die dat ingrediënt bevatten. Module 04 leest dit direct uit. De gebruiker ziet een melding: "Zalm filet +18% → recepten Gravad Lax en Zalm teriyaki zijn duurder geworden. Nieuwe marge: 61% (was 67%)."

---

### 9. Module 03 HACCP-koppeling — START HIER

**Dit is de eerste koppeling die gebouwd wordt**, omdat het de meeste directe veiligheidswaarde heeft en relatief eenvoudig te implementeren is.

**Wat het doet:**
Elke keer dat een product wordt ingeboekt via een pakbon of handmatige invoer, genereert Module 07 automatisch relevante HACCP-checkpunten die terugkomen in Module 03.

**Voorbeelden van slimme waarschuwingen:**
- Koelproduct (vlees, vis, zuivel) ingeboekt → Module 03 krijgt automatisch een taak: "controleer temperatuur ontvangst [product] — eis: max 7°C (vlees/gevogelte max 4°C)"
- Diepvriesproduct → "controleer of product bevroren was bij ontvangst, geen dooi-sporen"
- Houdbaarheidsdata ingeboekt → herinnering X dagen voor verloopdatum: "let op: [product] verloopt over 3 dagen"
- Product met allergeen (via koppeling Module 01) ingeboekt → "bewaar gescheiden van [allergeen-vrije producten]"

**⚠️ Nuances — verplicht in de implementatie:**

1. **Geen valse veiligheid creëren.** De module toont altijd de disclaimer: "Dit systeem ondersteunt je HACCP-registratie maar vervangt geen gecertificeerd HACCP-plan of inspectie door de NVWA." Dit moet zichtbaar zijn bij elke HACCP-melding, niet verstopt.

2. **Temperatuurdrempels zijn richtlijnen, geen garanties.** De wettelijke eisen in Nederland zijn: gekoeld bewaren ≤7°C (bereide producten ≤4°C), diepvries ≤-18°C. Maar de module weet niet of de keten daadwerkelijk gebroken is — hij weet alleen dat een product is ingeboekt. De melding is een herinnering om te controleren, geen bevestiging.

3. **Houdbaarheidsdatums: verschil tussen TGT en THT.** TGT (Te Gebruiken Tot) = harde grens, daarna niet meer verkopen. THT (Ten Minste Houdbaar Tot) = kwaliteitsindicatie, kan soms nog gebruikt worden. De module moet dit onderscheid kennen en anders communiceren: TGT-producten krijgen een harde blokkering, THT-producten een zachte waarschuwing.

4. **Geen automatische HACCP-registratie zonder bevestiging.** Module 03 mag nooit automatisch een "goedgekeurd" registratie krijgen. De melding gaat naar Module 03 als een open taak die een medewerker handmatig moet bevestigen en aanvullen (incl. gemeten temperatuur, naam medewerker).

5. **Allergenen-koppeling is informatief, niet volledig.** Als een product een allergeen bevat via Module 01, toon je een bewaaradvies. Maar kruisbesmetting hangt af van de fysieke keukenindeling — dat weet de module niet. Formuleer als suggestie, niet als garantie.

**Dataflow HACCP-koppeling:**
```
Module 07 boekt product in
       ↓
Systeem checkt: is het koelvers? diepvries? heeft allergeen?
       ↓
Schrijft open taak naar klaar_haccp localStorage:
{
  "type": "ontvangst_controle",
  "product": "Zalm filet",
  "datum": "2026-06-10",
  "checks": ["temperatuur_ontvangst", "verpakking_intact", "houdbaarheidsdatum"],
  "status": "open",
  "bron": "module_07"
}
       ↓
Module 03 toont de open taak in het dashboard
```

---

## Datamodel (localStorage key: `klaar_voorraad`)

```json
{
  "leveranciers": [
    { "id": "...", "naam": "...", "contact": "...", "email": "..." }
  ],
  "producten": [
    {
      "id": "...",
      "naam": "Jack Daniels 70cl",
      "categorie": "dranken",
      "leverancier_ids": ["lev-1", "lev-2"],
      "eenheid": "fles",
      "ingredient_match": "recept-ingrediënt-id",
      "bewaartype": "kamertemperatuur",
      "tgt_of_tht": "tht",
      "allergenen": [],
      "spillage_pct": 3,
      "waste_pct": 2,
      "eigen_gebruik_per_week": 0,
      "min_voorraad": 6
    }
  ],
  "prijzen": [
    { "product_id": "...", "leverancier_id": "...", "prijs": 18.50, "datum": "2026-06-10", "bron": "foto" }
  ],
  "stockopnames": [
    {
      "datum": "2026-06-10",
      "regels": [
        { "product_id": "...", "werkelijk": 8, "theoretisch": 10, "variance": -2, "houdbaarheid": "2026-06-20" }
      ]
    }
  ],
  "inkopen": [
    {
      "id": "...",
      "datum": "2026-06-10",
      "leverancier_id": "...",
      "bron": "foto",
      "regels": [
        { "product_id": "...", "hoeveelheid": 6, "prijs_per_eenheid": 18.50, "houdbaarheid": "2026-12-01" }
      ]
    }
  ],
  "verkopen": [
    { "datum": "2026-06-10", "bron": "kasrapport", "regels": [...] }
  ]
}
```

---

## Kritieke technische regels (gelden voor alle modules)

1. **Altijd backup maken** voor je begint: kopieer naar `backups/` met timestamp
2. **Screen-stijlen BUITEN @media print** — stijlen binnen print zijn onzichtbaar op scherm, geen foutmelding
3. **Local-first workflow** — test lokaal in Chrome, push naar GitHub/Vercel alleen na goedkeuring gebruiker
4. **Single-file** — alles (HTML, CSS, JS) in één bestand
5. **API calls** via fetch in browser, header `anthropic-dangerous-direct-browser-access: true`

---

## Visuele stijl (consistent met andere modules)

Header volgt Module 02-stijl:
- Achtergrond: `#0a0a0a`
- Logo "KLAAR": Bebas Neue, kleur `#e8ff47`
- Terugknop: `← TERUG` in DM Mono grijs
- Knoppen: dunne border, hover = geel oplichten

```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
```

Lichte achtergrond: `#f5f5f3`, cards: `#ffffff`.

---

## Aanbevolen bouwvolgorde

1. **Fase 1** — Bestandsstructuur + header + tabbladen (lege shells)
2. **Fase 2** — Producten tabblad: handmatig invoeren + opslaan
3. **Fase 3** — Foto-import: camera/upload → Claude Vision → review scherm → opslaan
4. **Fase 4** — Anomalie-detectie bij import
5. **Fase 5** — **Module 03 HACCP-koppeling**: ontvangst-taken automatisch aanmaken bij inboeken, met alle nuances uit sectie 9
6. **Fase 6** — Voorraad tabblad: stockopname, variance berekening, barcode scan
7. **Fase 7** — Dashboard: waarde, variance top 5, waste benchmark, COGS
8. **Fase 8** — Inkooporder PDF genereren
9. **Fase 9** — Live food cost koppeling met Module 04
10. **Fase 10** — Leveranciersvergelijking + seizoenspatronen
11. **Fase 11** — Module 10 events koppeling voor automatische inkoopberekening

Bouw per fase af, laat de gebruiker lokaal testen en goedkeuren vóór je verder gaat.

---

## Eerste opdracht voor de nieuwe chat

"Lees dit briefing-document volledig door. Lees daarna ook `/Users/cloudchief/Desktop/Klaar/MODULE10-HANDOFF.md` en `/Users/cloudchief/Desktop/Klaar/03-haccp/klaar-haccp.html` (voor begrip van de HACCP localStorage-structuur). Bouw dan Fase 1 + 2: maak de map `07-leveranciers/` aan met een `backups/` submap, en bouw `klaar-leveranciers.html` met de correcte header-stijl, drie tabbladen (Producten & Prijzen / Voorraad / Dashboard), en een werkend formulier om producten handmatig toe te voegen en op te slaan in localStorage key `klaar_voorraad`."
