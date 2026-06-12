# Module 03 — HACCP & Voedselveiligheid

**Bestand:** `klaar-haccp.html`  
**Status:** Live  
**Versie:** 1.0.0  
**Datum:** 2026-06-07

---

## Features

### Dashboard
- Overzicht van vandaag: temperatuurmetingen, leveringen, schoonmaak
- Open afwijkingen prominent zichtbaar
- Snelnavigatie naar alle registraties

### Temperatuurregistratie (Tab 2)
- Koeleenheden beheren (naam, type, normtemperatuur)
- Normen: koelkast max 7°C, vlees/vis max 4°C, vriezer max -18°C
- Meting invoeren met grote tablet-vriendelijke nummerinput
- Automatische check vs. norm → kleurcodering (groen/rood)
- Bij afwijking: corrigerende maatregel verplicht
- Automatisch afwijking aanmaken in Afwijkingenlog
- Historisch overzicht per dag

### Ingangscontrole Leveranciers (Tab 3)
- Leverancierslijst beheren
- Levering registreren: leverancier, product, temperatuur, medewerker
- Goedkeuren/Afkeuren toggle — bij afkeuren reden verplicht
- Automatisch afwijking aanmaken bij afkeuring
- Statistieken per leverancier (totaal, afgekeurd)

### Schoonmaakrooster (Tab 4)
- Taken aanmaken per frequentie: dagelijks / wekelijks / maandelijks
- Afvinken per dag met naam medewerker + tijdstip
- Visuele voortgangsscores per categorie
- Verwijdertaak-functie

### Afwijkingenlog (Tab 5)
- Automatisch gevuld vanuit temperatuur- en leveranciersafwijkingen
- Handmatig afwijkingen toevoegen
- Filter op open/alle afwijkingen
- Afwijking sluiten/verwijderen

### CCP Analyse via Claude AI (Tab 6)
- Leest recepten uit `klaar_recipes` (Module 01)
- Claude Haiku API-call met HACCP-expertprompt
- Per recept: CCP-kaartjes met grenswaarden, wat te meten, risico's
- Resultaat gecached in `klaar_haccp_ccp_analyse`
- Zelfde API-key als Module 01 (`klaar_api_key`)

### Green Key Checklist (Tab 7)
- 12 thema's: Energie, Water, Afval, Chemicaliën, Milieu, Maatschappij, Communicatie, Medewerkers, Lokale inkoop, Fauna & Flora, Activiteiten, Maatregelen
- Per norm: Ja / Deels / Nee toggle
- Voortgangsscores per thema + totaalscore
- Niveaus: <50% Niet klaar, 50–75% Brons, 75–90% Zilver, >90% Goud (indicatief)
- Notitievelid per thema

---

## Datamodel (localStorage)

| Key | Type | Beschrijving |
|-----|------|-------------|
| `klaar_haccp_koeling` | array | Dagelijkse temperatuurmetingen |
| `klaar_haccp_koeleenheden` | array | Geconfigureerde koeleenheden |
| `klaar_haccp_leveranciers` | array | Geregistreerde leveringen |
| `klaar_haccp_leverancierslijst` | array | Bekende leveranciers |
| `klaar_haccp_schoonmaak_taken` | array | Schoonmaaktaakdefinities |
| `klaar_haccp_schoonmaak_log` | array | Afgevinkte taken per dag |
| `klaar_haccp_afwijkingen` | array | Afwijkingen + corrigerende maatregelen |
| `klaar_haccp_ccp_analyse` | array | Claude CCP-analyseresultaten (gecached) |
| `klaar_haccp_greenkey` | object | Green Key checklistresultaten |
| `klaar_api_key` | string | Claude API-sleutel (gedeeld met Module 01) |
| `klaar_recipes` | array | Recepten van Module 01 (read-only) |

### Meting object
```json
{
  "id": "abc123",
  "datum": "2026-06-07",
  "tijd": "08:30",
  "eenheidId": "xyz",
  "eenheidNaam": "Koelkast 1",
  "temperatuur": 5.2,
  "norm": 7,
  "afwijking": false,
  "maatregel": "",
  "medewerker": "Jan"
}
```

### Afwijking object
```json
{
  "id": "abc123",
  "datum": "2026-06-07",
  "type": "Temperatuurafwijking: Koelkast 1",
  "waarde": "9°C (norm: max 7°C)",
  "maatregel": "Producten verplaatst, technicus gebeld",
  "medewerker": "Maria",
  "status": "open",
  "bron": "temperatuur"
}
```

---

## Wettelijk kader

- EU Verordening 852/2004 (Hygiëne levensmiddelen)
- Hygiënecode KHN (sectorspecifieke invulling)
- NVWA-inspecties openbaar gepubliceerd (v.a. juli 2025)
- Bewaarplicht registraties: minimaal 1–2 jaar

## CCP Grenswaarden (default)

| CCP | Grenswaarde |
|-----|------------|
| Koude opslag | max 7°C (bederfelijk) |
| Koude opslag vlees/vis | max 4°C |
| Bereiding kerntemperatuur | min 75°C |
| Gevogelte kerntemperatuur | min 80°C |
| Warme opslag / au bain marie | min 60°C |
| Koelen na bereiding | binnen 2 uur naar <7°C |
| Ingangscontrole diepvries | max -18°C |
| Ongekoeld presenteren | max 4 uur |

---

## Buglog

| Datum | Versie | Omschrijving |
|-------|--------|-------------|
| 2026-06-07 | 1.0.0 | Initiële release |

---

## Roadmap

- [ ] Export registraties naar PDF/CSV
- [ ] Herinneringen via browser notifications
- [ ] Meerdere vestigingen ondersteunen
- [ ] Supabase sync (multi-device)
- [ ] NVWA-format export
