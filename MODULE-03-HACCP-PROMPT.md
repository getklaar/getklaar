# Klaar — Module 03 HACCP: Bouw-prompt voor nieuwe chat

Kopieer alles hieronder en plak het in een nieuwe Cowork chat om Module 03 te bouwen.

---

## PROMPT — BEGIN HIER MET KOPIËREN

Lees eerst deze context goed door voordat je iets bouwt.

---

### Wat is Klaar?

Klaar is een modulaire SaaS voor de Nederlandse horecasector. "The Operating System for the Serving Industry." Statische HTML-modules die lokaal werken via localStorage, later online via Supabase. Stack: HTML + CSS + vanilla JS → GitHub (getklaar/getklaar) → Vercel (getklaar.vercel.app).

**Bestaande modules:**
- Module 01 — Recept Studio: `/Users/cloudchief/Desktop/Klaar/01-recept-studio/klaar-recept-studio.html`
- Module 02 — Allergenenkaart: `/Users/cloudchief/Desktop/Klaar/02-allergenenkaart/klaar-allergenenkaart.html`
- Dashboard: `/Users/cloudchief/Desktop/Klaar/index.html`

**Lees voor context ook:**
- `/Users/cloudchief/Desktop/Klaar/01-recept-studio/MODULE.md`
- `/Users/cloudchief/Desktop/Klaar/02-allergenenkaart/MODULE.md`

---

### Design systeem (verplicht exact overnemen)

**Kleuren:**
- `--black: #0a0a0a` (achtergrond header)
- `--border: #222222` (header borders)
- `--lime: #e8ff47` (logo, accenten)
- `--bg: #f5f5f3` (pagina achtergrond)
- `--surface: #ffffff` (kaarten/panelen)
- `--text: #111111`
- `--muted: #888888`

**Fonts (Google Fonts laden):** Bebas Neue (logo/titels) + DM Sans (body) + DM Mono (labels/codes/mono)

**Header (identiek aan Module 01 en 02):**
- Hoogte: 60px
- Achtergrond: `#0a0a0a`
- Border-bottom: `1px solid #222222`
- Logo links: "KLAAR" in Bebas Neue, kleur `#e8ff47`
- Terugknop naar `../index.html` links (DM Mono, grijs)
- `position: sticky; top: 0; z-index: 100`

**Scroll-fix (verplicht — zelfde als Module 02):**
Geef de hoofdinhoud een eigen scroll-container:
```css
.content-scroll {
  overflow-y: auto;
  max-height: calc(100vh - 60px); /* 60px = header */
}
```
Sticky theads: `position: sticky; top: 0` (relatief aan scroll-container, NIET viewport).
Gebruik NOOIT `overflow: hidden` op een wrapper die sticky children heeft — gebruik `overflow: clip` of herstructureer.

---

### Wat te bouwen: Module 03 — HACCP & Voedselveiligheid

**Bestandslocatie:** `/Users/cloudchief/Desktop/Klaar/03-haccp/klaar-haccp.html`
**Eén enkel HTML-bestand** — alles embedded (CSS + JS inline).

---

### Achtergrond & context (wettelijk kader)

HACCP is wettelijk verplicht voor alle Nederlandse horecaondernemers (EU Verordening 852/2004, ingevuld via Hygiënecode KHN of eigen plan). De NVWA inspecteert en publiceert resultaten openbaar (sinds juli 2025). Registraties moeten minimaal 1-2 jaar bewaard worden.

**Kritische Controlepunten (CCP's)** zijn punten in het bereidingsproces met vaste grenswaarden:
- Koude opslag: max 7°C (bederfelijk), max 4°C (vlees/vis)
- Bereiding kerntemperatuur: min 75°C (gevogelte min 80°C)
- Warme opslag / au bain marie: min 60°C
- Koelen na bereiding: binnen 2 uur naar <7°C
- Ingangscontrole diepvries: max -18°C
- Ongekoeld presenteren: max 4 uur (na 4 uur weggooien)

---

### Data-koppeling met bestaande modules

**localStorage key `klaar_recipes`** (geschreven door Module 01). Structuur per recept:
```json
{
  "id": "...",
  "title": "Naam recept",
  "folder": "keuken",
  "type": "kitchen",
  "recipe": {
    "title": "...",
    "servings": "4 personen",
    "allergens": [{"code": "G", "name": "Gluten"}]
  }
}
```

**Automatische CCP-detectie uit Module 01-recepten:**
- Recept met type `kitchen` + titel/stappen bevatten "sous-vide" → automatisch CCP sous-vide bereiding flaggen
- Recept met type `kitchen` + "roken" in titel/stappen → CCP roken
- Recepten met `allergens.length > 0` → allergeenbeheersing als aandachtspunt
- Alle keukenrecepten → standaard CCP kerntemperatuur van toepassing

---

### Functies die gebouwd moeten worden

#### 1. Dashboard / Startscherm
- Overzicht van vandaag: welke registraties zijn al gedaan, welke nog open
- Status per categorie: ✓ Gedaan / ⚠ Open / — Niet van toepassing vandaag
- Datum bovenaan (automatisch huidige datum)
- Snelknoppen naar elke registratielijst

#### 2. Temperatuurregistratie Koeling
- Dagelijkse registratie per koeleenheid (koelkast 1, koelkast 2, vriezer, etc.)
- Gebruiker kan koeleenheden zelf beheren (naam + type + normwaarde)
- Temperatuur invoeren + automatische controle vs. norm
- Bij afwijking: verplicht veld "corrigerende maatregel"
- Geschiedenis: tabel per week/maand
- Normen: koelkast max 7°C, vriezer max -18°C (instelbaar per eenheid)

#### 3. Ingangscontrole Leverancier
- Per levering: leverancier, product/categorie, temperatuur bij ontvangst, datum, tijd, naam medewerker
- Goedkeuren / Afkeuren toggle — bij afkeuren: reden verplicht
- Leverancierslijst beheren (naam, type producten)
- Overzicht per leverancier (hoeveel leveringen, hoeveel afgekeurd)

#### 4. Schoonmaakrooster
- Taken per frequentie: dagelijks / wekelijks / maandelijks
- Gebruiker kan taken zelf aanmaken (wat schoonmaken, frequentie, verantwoordelijke)
- Afvinken per dag met naam + tijdstip
- Kleurcode: groen = gedaan, oranje = te laat, rood = overgeslagen
- Maandoverzicht als kalender of grid

#### 5. Afwijkingenlog
- Automatisch aangemaakt bij elke temperatuurafwijking (uit registratie 2 en 3)
- Handmatig toevoegen mogelijk (vrij tekstveld)
- Velden: datum, type afwijking, gemeten waarde, corrigerende maatregel, naam medewerker, status (open/gesloten)
- Filter op open afwijkingen — deze moeten zichtbaar zijn op het dashboard

#### 6. CCP-analyse via Claude AI *(onderscheidende feature)*
- Knop "Analyseer mijn recepten op CCP's"
- Leest alle recepten uit localStorage (`klaar_recipes`)
- Stuurt naar Claude API met prompt: analyseer elk recept, benoem de CCP's, geef per CCP de kritische grenswaarde en wat te meten
- Resultaat: per recept een CCP-kaart met actiepunten
- API-key: zelfde key als Module 01 (localStorage `klaar_api_key`)
- Resultaat opslaan in localStorage (`klaar_haccp_ccp_analyse`) zodat het niet steeds opnieuw hoeft

#### 7. Green Key Checklist *(tab, niet hoofdfunctie)*
- Aparte tab "Green Key"
- Simpele checklist met de verplichte normen voor restaurants (module I + A basis)
- 12 thema's: Energie, Water, Afval, Chemicaliën, Milieu, Maatschappij, Communicatie, Medewerkers, Lokale inkoop, Fauna & Flora, Activiteiten, Maatregelen
- Per norm: ✓ / ✗ / Deels toggle + optioneel notitieveld
- Voortgangsbalk per thema + totaalscore
- Score vertaling naar niveau: < 50% = niet klaar, 50-75% = Brons, 75-90% = Zilver, >90% = Goud (indicatief)
- Opmerking dat officiële beoordeling via greenkey.nl loopt (geen vervanging)

---

### Dataopslag (localStorage keys)

```
klaar_haccp_koeling          → array van dagelijkse metingen per koeleenheid
klaar_haccp_koeleenheden     → array van geconfigureerde koeleenheden
klaar_haccp_leveranciers     → array van leveranciersinspecties
klaar_haccp_leverancierslijst → array van bekende leveranciers
klaar_haccp_schoonmaak_taken  → array van schoonmaaktaken (definitie)
klaar_haccp_schoonmaak_log    → array van afgevinkte schoonmaaktaken
klaar_haccp_afwijkingen       → array van afwijkingen + corrigerende maatregelen
klaar_haccp_ccp_analyse       → resultaat Claude CCP-analyse
klaar_haccp_greenkey          → Green Key checklistresultaten
```

---

### UI/UX principes

- **Tab-navigatie bovenaan** (na header): Dashboard | Temperatuur | Leveranciers | Schoonmaak | Afwijkingen | CCP Analyse | Green Key
- Actieve tab duidelijk gemarkeerd (lime kleur of witte indicator)
- **Formulieren**: wit op witte achtergrond, subtiele borders, DM Sans input fields
- **Status-indicators**: groen (#22c55e) = OK, oranje (#f97316) = aandacht, rood (#ef4444) = afwijking/kritiek
- **Lege states**: nette melding + instructie wat te doen (zelfde stijl als Module 02)
- **Print**: bij elk registratieformulier een printknop → A4 formaat, NVWA-proof, datum + bedrijfsnaam bovenaan
- **Mobiel-vriendelijk**: grote knoppen voor temperatuurinvoer (keukenpersoneel tikt op tablet/telefoon)

---

### Navigatiestructuur (tab-layout)

```
[KLAAR header — 60px]
[Tab bar: Dashboard | Temperatuur | Leveranciers | Schoonmaak | Afwijkingen | CCP | Green Key]
[Content scroll area — max-height: calc(100vh - 60px - 48px)]
```

---

### Dashboard-koppeling

Na afronding: in `/Users/cloudchief/Desktop/Klaar/index.html` de Module 03 kaart activeren:
- Huidige staat: `coming-soon` div zonder href
- Wijzigen naar: `<a class="module-card active" href="./03-haccp/klaar-haccp.html">`
- Status badge: `status-live` met "● Live"

---

### Wat concurrenten doen (bouw het beter)

- **appHoreca**: Werkt, maar kost €20-50/m, generiek, niks weet van jouw recepten. Alles handmatig.
- **Hygiënecode Online**: Papieren formulieren digitaal. Jaren oud qua design.
- **KitchenNmbrs**: Professioneel maar duur (€1000+), gericht op grote keukens.

**Klaar's voordeel:** CCP-analyse koppelt aan je eigen recepten. Geen dubbele invoer. Moderne UI. En Claude legt uit wat je moet meten bij elk gerecht — dat kan niemand anders.

---

### Backups en documentatie

Na afronding:
1. `mkdir /Users/cloudchief/Desktop/Klaar/03-haccp/backups/`
2. Maak een backup van de werkende versie
3. Schrijf `/Users/cloudchief/Desktop/Klaar/03-haccp/MODULE.md` met features, buglog, datamodel
4. Update `/Users/cloudchief/Desktop/Klaar/README.md` — voeg Module 03 toe aan de tabel
5. Update `/Users/cloudchief/Desktop/Klaar/DASHBOARD-PROMPT.md` — Module 03 op LIVE

---

## PROMPT — EINDE KOPIËREN
