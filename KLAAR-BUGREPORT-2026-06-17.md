# KLAAR — Bug Report & Feature Gaps
**Datum:** 17 juni 2026  
**Bron:** Simulatie-sessie klaar-signalen-2026-06-17.txt (persona: Yildiz Demir, NVWA-inspectie scenario)  
**Status:** 3 issues — 1 HIGH, 2 MEDIUM + 1 AI-gedrag probleem

---

## BUG-05 — Module 03: Geen NVWA-rapport export (PDF/Print)
**Ernst:** 🔴 HOOG  
**Module:** 03-haccp  
**Gesignaleerd door:** AI-assistent LOG_ISSUE [HOOG] + klant-signalen #6, #7, #8

### Probleem
NVWA verwacht bij inspectie alle afwijkingen, metingen en maatregelen van de afgelopen 3 maanden. Klaar heeft geen export — de gebruiker moet screenshots maken en in Word plakken. Dit is:
- Meer werk dan het papieren systeem dat ze al hadden
- Juridisch kwetsbaar (screenshots hebben geen timestamp-lock)
- Reden om de module te verlaten

**AI-gedragseffect:** De AI adviseerde actief om de HACCP Logger te stoppen en terug te gaan naar papier ("Klaar weglaten voor HACCP"). Dit beschadigt product-vertrouwen.

### Fix
`printHACCPRapport()` functie: genereert een print-klare HTML-pagina met:
- Alle temperatuurmetingen in datumrange (standaard: afgelopen 30 dagen)
- Alle afwijkingen + maatregelen
- Naam koeleenheid, norm, gemeten waarde, gemeten door, tijdstip
- NVWA-formaat header (bedrijfsnaam, datum rapport, EU-verordening referentie)
- Print via `window.print()` → browser slaat op als PDF

**Gefixt in:** v0.9.2

---

## BUG-06 — Module 03: Geen quick-maatregel templates
**Ernst:** 🟡 MEDIUM  
**Module:** 03-haccp → Temperatuur invoerscherm  
**Gesignaleerd door:** AI-assistent turn 01 ("quick maatregel-template")

### Probleem
Bij elke temperatuurafwijking moet de gebruiker de corrigerende maatregel uittypen. Dit kost tijd (Omar staat voor de koelcel met een thermometer) en leidt tot vage, inconsistente teksten in het logboek.

### Fix
Knoppenrij "Snelle maatregel" in het modal-meting scherm, verschijnt als `afwijking = true`:
- "🌡️ Thermostaat nagesteld"
- "🚪 Deur was niet goed dicht"
- "📦 Product verwijderd / vernietigd"
- "🔧 Technicus gebeld"
- "📋 Extra meting gepland"

Klikken vult het maatregel-tekstveld in (aanpasbaar).

**Gefixt in:** v0.9.2

---

## AI-GEDRAG — KLAAR_PROMPT: HACCP module verkeerd gepositioneerd
**Ernst:** 🔴 HOOG (reputatieschade product)  
**Module:** tests/klaar-ai-test.html → KLAAR_PROMPT  

### Probleem
De AI vertelde de gebruiker expliciet: *"Papier + foto is sterker. Klaar weglaten voor HACCP."* Dit is het tegenovergestelde van wat de AI zou moeten zeggen. HACCP Logger is een betaalde module (€29/m) en de AI gaf het advies om hem te verlaten.

**Correcte positionering:**
HACCP Logger is een AANVULLING op het papieren logboek, geen vervanging:
- Papier naast de koelcel = primair bewijs bij directe inspectie (handtekening, thermometerfoto)
- HACCP Logger = digitale laag voor trend-analyse, gemiste meting detectie, en centraal overzicht
- PDF-export = officieel supplementair overzicht naast het schrift

### Fix
KLAAR_PROMPT HACCP-sectie uitbreiden met positioneringsrichtlijn: "Zeg NOOIT dat de gebruiker de HACCP Logger moet stoppen of papier moet prefereren. Leg uit dat Klaar een digitale aanvulling is. PDF-export is beschikbaar via het 🖨 Rapport knop."

**Gefixt in:** v0.9.2

---

## BEKENDE BEPERKING (niet gefixt — architectuurbeslissing)

### Geen foto-upload bij meting
NVWA-inspecteurs prefereren een foto van de thermometer als primair bewijs. localStorage heeft een 5-10MB limiet per domein — foto's als base64 zijn te groot voor meerdere weken HACCP-data. Oplossing vereist cloud storage. Workaround: foto's in apart mapje op telefoon met datum in bestandsnaam, schrift naast koelcel voor handtekening.

### Geen team-sync / real-time zichtbaarheid
HACCP Logger is browser-only. Omar en Fatima kunnen afwijkingen niet live zien zonder cloud-backend. Workaround: WhatsApp-groep voor urgente meldingen + fysiek whiteboard in keuken.

### Geen automatische HACCP→Menu koppeling
Afwijking in logboek blokkeert geen gerechten in menubuilder. Handmatige communicatie blijft nodig.

---

*Rapport gegenereerd op basis van AI-simulatie signalen. Fixes geïmplementeerd in deploy v0.9.2.*
