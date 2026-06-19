# KLAAR — Bug Report & Feature Gaps
**Datum:** 16 juni 2026  
**Bron:** Simulatie-sessie klaar-signalen-2026-06-16.txt (persona: Yildiz Demir, Zest by Yildiz)  
**Status:** 4 issues geïdentificeerd — 3 bugs, 1 ontbrekende feature

---

## BUG-01 — Module 02: Bediening-filter werkt maar met 1 allergen tegelijk
**Ernst:** 🔴 MIDDEN  
**Module:** 02-allergenenkaart → Bediening tab  
**Gesignaleerd door:** AI-assistent (LOG_ISSUE × 2)

### Probleem
Lotte (bediening) staat met 40 gasten en een gast zegt: "ik eet geen gluten, geen sesam en geen noten". Module 02 Bediening heeft een live filter, maar die filtert slechts op **1 allergen** tegelijk (`_bedAllergenFilter` = single string). Een tweede allergen was via `_bedExtraFilter` gehackt maar is verborgen voor de gebruiker.

Resultaat: bediening kan *niet* zeggen "toon me alles zonder gluten EN sesam EN noten" — ze moeten handmatig checken.

### Fix
`_bedAllergenFilter` + `_bedExtraFilter` vervangen door `_bedActiveFilters` (Set). Quick-filter buttons worden togglebaar multi-select. Filter-logica past results aan op alle actieve allergens.

**Gefixt in:** v0.9.1

---

## BUG-02 — Module 02: Allergenenmatrix heeft geen CSV-export
**Ernst:** 🟡 LAAG  
**Module:** 02-allergenenkaart → Exporteren tab  
**Gesignaleerd door:** Yildiz (klant-signaal #9)

### Probleem
Module 02 exporteert alleen naar PDF (gastenkaart, keukensheet, allergeenmatrix). Gebruikers die hun eigen Excel-filtermatrix willen bouwen (Yildiz wil thuis filteren op combinaties) moeten alles handmatig overtypen.

### Fix
Knop "📥 Download CSV" toevoegen in Exporteren tab. CSV-inhoud: gerecht + 14 allergenkolommen (✓ / ~ / —). Direkt downloadbaar.

**Gefixt in:** v0.9.1

---

## BUG-03 — Module 04: Adviesverkoopprijs is hardcoded op 30% foodcost
**Ernst:** 🟡 LAAG-MIDDEN  
**Module:** 04-kostprijs → Scenario-planner  
**Gesignaleerd door:** Yildiz (klant-signaal #6) — "reverse-calculator ontbreekt"

### Probleem
In de scenario-planner staat een "advies verkoopprijs" berekening:
```javascript
const advVp = newKp > 0 ? newKp / 0.30 : null;
```
Dit berekent altijd op basis van 30% foodcost-target, ongeacht wat de gebruiker wil. Yildiz wil 35% foodcost houden — de adviesprijs klopt dan niet.

De gebruiker moet zelf `kostprijs ÷ gewenste_foodcost%` uitrekenen, wat onnodig handwerk is.

### Fix
Invoerveld "Doelfoodcost %" toevoegen in scenario-planner (default 30%). `advVp` gebruikt dat veld: `newKp / (doelFc / 100)`.

**Gefixt in:** v0.9.1

---

## BUG-04 — Module 03: Geen productkwaliteitsincident type
**Ernst:** 🟡 LAAG-MIDDEN  
**Module:** 03-haccp → Afwijkingen  
**Gesignaleerd door:** Simulatie turn 10 — Omar meldt lamrack -12°C (deels ontdooid)

### Probleem
HACCP Logger logt temperatuurafwijkingen van koelcellen. Maar er is geen manier om een **productkwaliteitsincident** te registreren — zoals "lamrack gedeeltelijk ontdooid, vernietigd". Het `afw-type` veld is een vrij tekstveld zonder structuur.

NVWA verwacht dat dit soort incidenten gedocumenteerd zijn. Momenteel past het product niet in het bestaande registratieformulier.

### Fix
`afw-type` vrij tekstveld → dropdown met gestructureerde types:
- Temperatuurafwijking (default)
- Productkwaliteit
- THT overschreden
- Besmettingsrisico
- Ontvangstcontrole afwijking
- Anders

Veld "Waarde" conditioneel: bij Temperatuurafwijking toont het "°C", bij andere types "Omschrijving".

**Gefixt in:** v0.9.1

---

## BEKENDE BEPERKINGEN (niet gefixt — architectuurbeslissing)

### Geen multi-device sync
Klaar slaat data op in localStorage — enkel op het apparaat + browser waar je werkt. Bediening op eigen telefoon ziet lege data. Oplossing vereist cloud-backend/account-systeem — buiten scope van v1.

### Geen recept-in-recept (sub-recipe)
Ingrediëntenbibliotheek bevat alleen losse producten. Een batchrecept (bijv. pulled pork voor 30 porties) kan niet als ingrediënt van een ander recept worden gebruikt. Workaround: kostprijs per portie handmatig berekenen en als losse ingredient opslaan.

### Allergeenfilter niet per event/menu
Module 02 exporteert altijd de volledige receptenbibliotheek. Per-event of per-menukaart filteren is niet mogelijk. Workaround: maak aparte receptensets per event.

---

*Rapport gegenereerd op basis van AI-simulatie signalen. Fixes geïmplementeerd in deploy v0.9.1.*
