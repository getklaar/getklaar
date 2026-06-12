# Klaar — Kassasystemen & Horeca-software Kennisbank

> Dit document is de complete referentie voor de Klaar Assistent. Het bevat alle informatie over kassasystemen, concurrenten, groothandels en export-instructies. Lees dit als context bij elke chat die gaat over integraties, data-import of vergelijking met andere software.

---

## 1. De Nederlandse horeca-softwaremarkt

De gemiddelde horecaondernemer in Nederland gebruikt 3–5 digitale systemen tegelijkertijd:
- 1 kassasysteem (POS)
- 1 boekhoudpakket (Exact, Snelstart, Twinfield)
- 1–2 groothandel-platformen (Hanos, Bidfood, Sligro)
- Eventueel: personeelsplanning, reserveringen, bezorgplatform

**Klaar positionering:** Klaar is geen kassasysteem. Klaar is de operationele laag die de kassa aanvult — receptbeheer, kostprijs, allergenen, HACCP en leveranciers — dingen die de kassa niet of slecht doet.

---

## 2. Kassasystemen (POS) — Overzicht

### 🥇 unTill (Marktleider Nederland)
**Website:** untill.nl  
**Marktaandeel:** ~3.500+ klanten in NL, grootste Nederlandse speler  
**Type:** On-premise + cloud backoffice (Webmanagement)  
**Doelgroep:** Restaurant, café/bar, hotel, cafetaria, catering, recreatie  
**Prijs:** Op aanvraag, dealer-model  
**Hardware:** Eigen kassaterminals, handhelds, keuken- en barschermen

**Wat unTill heeft dat Klaar nodig kan hebben:**
- Artikelenlijst: naam, verkoopprijs, btw-klasse, artikelgroep, omzetgroep
- Omzetrapportages per artikel (populariteit, verkoopaantallen)
- Z-rapport (dagsluiting) — totaalverkoop per dag/week

**Export uit unTill:**
1. Log in op **unTill Webmanagement** (webmanagement.untill.com)
2. Ga naar **Rapporten → Artikel-omzet** of **Artikelen → Overzicht**
3. Klik op **Exporteren → CSV of Excel**
4. Upload dit bestand naar de Klaar Assistent

**Wat Klaar hiermee kan:**
- Verkoopprijzen invullen per gerecht → menu engineering (Module 04)
- Populariteit per gerecht bijwerken (klant heeft hoge/lage omzet per artikel)
- Artikelgroepen als categorieën gebruiken

---

### 🌐 Lightspeed Restaurant (K-Series)
**Website:** lightspeedhq.nl  
**Type:** Cloud-based, iPad POS  
**Doelgroep:** Restaurant, bar, café, hotel — mid tot groot  
**Prijs:** Vanaf ca. €69/maand (Starter)  
**Bijzonder:** Sterke rapportage en inventory management ingebouwd

**Export uit Lightspeed:**
1. Log in op **Lightspeed Manager** (manager.lightspeedhq.com)
2. Ga naar **Menu → Items → Exporteer** (CSV)
3. Of: **Rapporten → Verkoop → Per artikel** → Download CSV
4. Of: **Inventaris → Ingrediënten** → Export

**Kolommen in CSV:** naam, categorie, verkoopprijs, btw, inkoopprijs (als inventory module actief is)

**Wat Klaar hiermee kan:**
- Gerechten van Lightspeed-menu importeren als receptenstructuur (Module 01)
- Verkoopprijzen invullen voor kostprijsberekening (Module 04)
- Voorraadniveaus vergelijken (Module 07)

---

### 🏨 Oracle MICROS / Simphony
**Website:** oracle.com/food-beverage/micros  
**Type:** Enterprise cloud + on-premise  
**Doelgroep:** Hotels, ketens, grote restaurants, stadions, luchthavens  
**Aanwezig in NL bij:** Van der Valk, Marriott, Hilton, NH Hotel Group  
**Prijs:** Enterprise, op aanvraag

**Export uit MICROS/Simphony:**
- Via **Reports & Analytics** module (Excel/PDF)
- Menuconfiguratie te exporteren als XML/CSV
- Veelgebruikt: omzetrapport per menugroep

---

### 📱 Square for Restaurants
**Website:** squareup.com/nl  
**Type:** Cloud, iPad/mobiel  
**Doelgroep:** Klein tot middel, startende horeca  
**Prijs:** Gratis basisplan, betaald vanaf €60/maand  

**Export uit Square:**
1. **Square Dashboard** (squareup.com/dashboard)
2. **Items → Bibliotheek → Exporteren** (CSV)
3. **Rapporten → Verkopen → Exporteren**

---

### 🍽️ Reeleezee
**Website:** reeleezee.nl  
**Type:** Cloud POS + boekhoudkoppeling  
**Doelgroep:** Restaurant, café, klein/mid NL  
**Bijzonder:** Koppelt direct met Nederlandse boekhoudpakketten

---

### 📋 Orderbird
**Website:** orderbird.com/nl  
**Type:** iPad POS, cloud  
**Doelgroep:** Restaurant, café, bistro  
**Aanwezig in:** Duitsland, Oostenrijk, Zwitserland, NL  

---

### 💻 CCV Shop / CCV Pay
**Website:** ccvshop.nl, ccvpay.nl  
**Type:** Retailgericht maar ook horeca  
**Bijzonder:** Veel geïntegreerd met betaalterminals

---

### 🧾 Kassatools / lokale dealers
Veel Nederlandse horecazaken gebruiken oplossingen via lokale kassadealers die werken met:
- **Casio POS-systemen** (basis)
- **Sam4s** (mid-range)
- **Epson** kassasoftware
- Custom Windows-software van lokale IT-bedrijven

Deze systemen exporteren vaak via USB-stick of e-mail een **Z-rapport** (dagsluiting) als tekstbestand of printout.

---

## 3. Horeca Beheer Software — Concurrenten van Klaar

### ⚠️ appHoreca (Directe concurrent #1)
**Website:** apphoreca.nl  
**Prijs:** €69/maand (jaar) of €75/maand (maand) — ALLES inbegrepen  
**Eigenaar:** dotsofdata, Zierikzee  
**Functies:**
- Recepturenbeheer ✅
- Kostprijscalculatie ✅
- HACCP-registratie ✅
- Allergenen-declaratie ✅
- Labels printen (Zebra ZD220D) ✅
- Koppelingen: Hanos, Bidfood, World of Drinks ✅
- Meertalig (NL/EN) ✅

**Hoe Klaar beter is dan appHoreca:**
- Klaar is modulair: je betaalt alleen wat je gebruikt (vanaf €14/m vs €69/m all-in)
- Klaar heeft AI (spraak→recept, AI HACCP CCP-analyse, foto-scan facturen)
- Klaar is geen desktop-app maar een modern, snel webapp
- Klaar heeft geen startkosten, geen hardware vereist
- appHoreca vereist hardware (labelprinters etc.) voor volledige werking
- Klaar groeit naar kassaless integraties; appHoreca is statisch

**Zwaktes appHoreca:**
- Geen AI-functies
- Geen spraak-input
- Duurder als je niet alles nodig hebt
- Verouderde UX

---

### ⚠️ Horeko — Kitchen Manager (Concurrent #2)
**Website:** horeko.com  
**Moederbedrijf:** Exact (groot Nederlands softwarebedrijf)  
**Prijs:** Enterprise, maatwerk — aanzienlijk duurder  
**Functies:**
- Receptbeheer & kostprijs
- HACCP
- Personeelsbeheer (via Horeko Employee Manager)
- Koppeling met Exact boekhouding

**Hoe Klaar beter is:**
- Significant goedkoper
- Geen Exact-afhankelijkheid
- AI-functies
- Eenvoudiger te implementeren (geen IT-project)
- Voor MKB-horeca, niet voor enterprise

---

### ℹ️ Overige management software
| Software | Focus | Prijs | Vs Klaar |
|----------|-------|-------|----------|
| **FoodNotify** | Inkoop, recepten (AT/DE) | €99+/m | Duurder, geen AI |
| **Apicbase** | Enterprise receptbeheer | Op aanvraag | Enterprise, te groot |
| **MarketMan** | Inventory, inkoop | €250+/m | Veel duurder |
| **Meez** | Recepten (VS) | $25+/m | Engels, geen NL |
| **Winnow** | Voedselverspilling AI | Op aanvraag | Ander segment |

---

## 4. Groothandels — Export-instructies

### 🏪 Hanos (Metro/Makro)
**Website:** hanos.nl, mijnhanos.nl  
**Beschrijving:** Grootste horecagroothandel NL, ook eigen merk  
**Doelgroep:** Restaurant, café, hotel, catering  

**Export van productlijst/bestelhistorie:**
1. Log in op **Mijn Hanos** (mijnhanos.nl)
2. Ga naar **Mijn account → Bestelhistorie**
3. Kies tijdperiode en klik **Exporteer naar Excel**
4. Of ga naar **Assortiment → Favorieten** en exporteer jouw vaste producten

**Kolommen:** productnaam, EAN-code, prijs/eenheid, eenheid (kg/stuk/krat), btw-klasse, categorie

**Wat Klaar hiermee kan:**
- Productlijst invullen in Module 07 (Leveranciers)
- Inkoopprijzen koppelen aan ingrediënten in Module 04

---

### 🛒 Bidfood
**Website:** bidfood.nl  
**Beschrijving:** Tweede grootste horecagroothandel NL  
**Export:**
1. Log in op **Bidfood online bestelportal**
2. Ga naar **Mijn bestelbonnen → Exporteer**
3. Of: **Favorieten → Exporteer lijst** (CSV/Excel)

---

### 🏬 Sligro
**Website:** sligro.nl  
**Beschrijving:** Cash & carry + bezorging  
**Export:**
1. Log in op **sligro.nl**
2. **Mijn account → Bestellingen → Exporteer**
3. Beschikbaar als CSV met productnaam, prijs, gewicht

---

### 📦 Makro
**Website:** makro.nl  
**Export:** Via **Mijn account → Aankoophistorie → Exporteer Excel**

---

## 5. Export-to-Klaar: Welke data gaat naar welke module?

| Data bron | Export formaat | Klaar module | Wat wordt gevuld |
|-----------|---------------|--------------|------------------|
| unTill Webmanagement → Artikelen | CSV | M04 Kostprijs | Verkoopprijzen, artikelgroepen |
| unTill → Omzetrapport | CSV | M04 Populariteit | Hoog/laag populariteit per gerecht |
| Lightspeed → Menu Items | CSV | M01 + M04 | Receptennamen, verkoopprijzen |
| Hanos Bestelhistorie | Excel | M07 Leveranciers | Productlijst met inkoopprijzen |
| Bidfood Favorieten | CSV | M07 Leveranciers | Productlijst met inkoopprijzen |
| Sligro Bestellingen | CSV/Excel | M07 Leveranciers | Producten + prijzen |
| Foto Z-rapport | Foto (vision) | M04 Populariteit | Omzet per artikel |
| Foto Pakbon/Factuur | Foto (vision) | M07 Leveranciers | Nieuwe producten + prijzen |
| Foto Productspecificatieblad | Foto (vision) | M02 Allergenen | Allergeeninfo per ingredient |
| Foto Receptkaart/spreadsheet | Foto (vision) | M04 Kostprijs | Ingrediënten + hoeveelheden |

---

## 6. Hoe de Assistent data vraagt en verwerkt

**Wanneer data nuttig zou zijn, vraagt de assistent altijd eerst:**
1. "Welk kassasysteem gebruik jij?" → geeft dan exacte export-stappen
2. "Bij welke groothandel bestel jij?" → geeft dan exacte export-stappen
3. "Upload de CSV/Excel of maak een foto van het rapport"
4. Verwerkt de data en schrijft naar de juiste localStorage keys

**Gouden regel:** Klaar vraagt nooit om data die het niet kan gebruiken. Als de assistent om een export vraagt, is er altijd een duidelijke meerwaarde voor de gebruiker.

---

## 7. Positionering & Salesargumenten

### Waarom Klaar vs appHoreca
| Punt | Klaar | appHoreca |
|------|-------|-----------|
| Prijs | Vanaf €14/m (modulair) | €69-75/m (alles of niets) |
| AI | ✅ Spraak, foto, chat | ❌ Geen |
| Hardware nodig | ❌ Nee | ✅ Printer vereist voor labels |
| Startkosten | €0 | €449-999 (startpakketten) |
| Setup tijd | Direct live | 1-5 werkdagen + training |
| Modern design | ✅ | Verouderd |

### Waarom Klaar vs Horeko
- Horeko (Exact) is een enterprise-product voor ketens met IT-afdelingen
- Klaar is voor de zelfstandige horecaondernemer die geen IT-bedrijf wil inhuren
- Prijs: Horeko kost 5-10x meer dan Klaar

### Waarom Klaar naast jouw kassasysteem
- Klaar vult het kassasysteem aan — het vervangt het niet
- De kassa registreert verkopen; Klaar helpt met de voorbereiding en operatie
- Samen zijn ze een compleet systeem: kassa + Klaar = volledige horecaoperatie

---

## 8. Toekomstige Integraties (roadmap)

Na Supabase-koppeling:
- **unTill API** — directe artikelsync, geen export nodig
- **Lightspeed API** — menu en inventory sync
- **Hanos Punchout** — live inkoopprijzen via XML/EDI
- **Bidfood API** — live productprijzen

Deze zijn gepland maar nog niet beschikbaar. Tot die tijd: handmatige CSV-import en foto-scan via de Klaar Assistent.
