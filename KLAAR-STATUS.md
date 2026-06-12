# KLAAR — Project Status

**Bijgewerkt:** 2026-06-12  
**Scan door:** sessie health check  
**Doel van dit document:** centrale referentie voor elke nieuwe sessie — lees dit altijd eerst, update het altijd als laatste.

---

## Werkregels (LEES DIT EERST)

**Kritische modus is de standaard.** Geen aanpassingen om de gebruiker te pleasen. Als een wijziging risico meebrengt → benoem het. Als iets niet werkt → zeg het. Het doel is een verkoopbaar product, geen vriendelijke code-oefening.

**Volgorde per sessie:**
1. Lees KLAAR-STATUS.md (dit bestand)
2. Lees MODULE.md van de te wijzigen module
3. Backup maken vóór elke wijziging (`backups/naam_YYYYMMDD_HHMMSS.html`)
4. Na elke wijziging: script tag balance checken (zie Health Check sectie)
5. Sessie afsluiten: dit bestand bijwerken + README.md + MODULE.md

**Grootste structurele risico:** template literals voor print-windows (`w.document.write(\`...\`)`). Een `</script>` tag erin knipt de huidige script tag door. Elke keer dat er HTML in een print-functie wordt geplakt: **verifieer script tag balance**.

**Tweede risico (nieuw):** modules hebben meerdere `</head>` tags omdat print-window templates ook `</head><body>` bevatten. Gebruik bij CDN-injectie altijd een `replace` op de EERSTE `</head>`, niet op alle.

---

## Module Status

| # | Module | Bestand | Status | Script tags | Auth | klaarAI calls |
|---|--------|---------|--------|-------------|------|---------------|
| 01 | Recept Studio | `01-recept-studio/klaar-recept-studio.html` | ✅ Werkt | 3/3 ✓ | ✅ klaarRequireAuth | 3 (2×AI, 1×stream) |
| 02 | Allergenenkaart | `02-allergenenkaart/klaar-allergenenkaart.html` | ✅ Werkt | 4/4 ✓ | ✅ klaarRequireAuth | 2 (1×AI, 1×stream) |
| 03 | HACCP | `03-haccp/klaar-haccp.html` | ✅ Werkt | 4/4 ✓ | ✅ klaarRequireAuth | 2 (1×AI, 1×stream) |
| 04 | Kostprijs Calculator | `04-kostprijs/klaar-kostprijs.html` | ⚠️ Niet getest na fix | 5/5 ✓ | ✅ klaarRequireAuth | 1 (stream) |
| 07 | Leveranciers | `07-leveranciers/klaar-leveranciers.html` | ✅ Werkt | 4/4 ✓ | ✅ klaarRequireAuth | 3 (2×AI, 1×stream) |
| 10 | Catering & Events | `10-catering-events/klaar-catering.html` | ✅ Werkt | 4/4 ✓ | ✅ klaarRequireAuth | 1 (stream) |
| — | Dashboard | `index.html` | ✅ Supabase OTP | 3/3 ✓ | ✅ showAuthGate | — |

**Ontbrekende modules (nummergaten):** 05, 06, 08, 09 — niet gebouwd, niet gepland.  
**Module 07:** geen MODULE.md aanwezig.  
**Module 04:** script tag fix van 2026-06-12 niet visueel getest in browser.

---

## Supabase Integratie (LIVE)

**Project:** `imiqoxsjdynliydsuihc` — Klaar.app  
**URL:** `https://imiqoxsjdynliydsuihc.supabase.co`  
**Anon key:** in `klaar-client.js` (publiek, veilig)  
**API keys:** zie `KLAAR-API-KEYS.md` (NIET in git!)

### Edge Function: `ai-proxy`
- URL: `https://imiqoxsjdynliydsuihc.supabase.co/functions/v1/ai-proxy`
- Bestand: `supabase/functions/ai-proxy/index.ts`
- Status: **LIVE** (laatste deploy 2026-06-12)
- Features: JWT auth verificatie, streaming passthrough, usage logging (non-streaming)
- Secret: `ANTHROPIC_API_KEY` ingesteld in Supabase dashboard

### Auth flow
- Email OTP (geen wachtwoord) — werkt ook via `file://`
- index.html: 2-stap gate (email → 6-cijferige code → redirect naar M01)
- Alle modules: `klaarRequireAuth()` on init → redirect naar index.html als niet ingelogd

### Database tabellen (alle met RLS)
- `public.profiles` — gebruikersprofiel (auto-aangemaakt bij registratie)
- `public.recipes` — recepten (was localStorage `klaar_recipes`)
- `public.ingredients` — ingrediënten (was localStorage `klaar_ingredienten`)
- `public.haccp_logs` — HACCP registraties
- `public.api_usage` — token-verbruik per gebruiker (voor billing)

### Gedeelde client: `klaar-client.js`
Elke module laadt dit bestand. Exporteert:
- `klaarGetSession()` — sessie ophalen
- `klaarSignInWithOTP(email)` — login stap 1
- `klaarVerifyOTP(email, code)` — login stap 2
- `klaarSignOut()` — uitloggen + redirect
- `klaarRequireAuth()` — auth guard
- `klaarAI(body, module)` — non-streaming AI proxy call
- `klaarAIStream(body, module)` — streaming AI proxy call (retourneert raw Response)

---

## Kritieke datastromen (localStorage — nog actief)

Data-sync naar Supabase is nog NIET gebouwd. Alle modules lezen/schrijven nog steeds localStorage voor recepten en ingrediënten. Supabase wordt nu alleen gebruikt voor auth en AI proxy.

```
klaar_recipes        WRITE: 01    READ: 02, 04, 10
klaar_ingredienten   WRITE: 01    READ: 04, 07
klaar_producten      WRITE: 07    READ: 04
klaar_haccp_log      WRITE: 03    READ: 03
klaar_events         WRITE: 10    READ: 10
klaar_kostprijs_settings  WRITE: 04   READ: 04
klaar_voorraad       WRITE: ?     READ: 04       ← NIEMAND SCHRIJFT DIT (gap)
klaar_pakketten      WRITE: ?     READ: 02       ← NIEMAND SCHRIJFT DIT (gap)
klaar_haccp_ontvangst_taken  WRITE: 07  READ: 07
```

---

## Bekende bugs en openstaande issues

### Kritiek (blokkeert werking)
- *(geen)*

### Hoog (vermindert kwaliteit)
- **Module 04 niet getest in browser** na de script tag fix van 2026-06-12. Kostprijs berekeningen, Overzicht tab en chat widget moeten handmatig gecontroleerd worden.
- **Data sync naar Supabase ontbreekt** — recepten en ingrediënten leven nog in localStorage. Als gebruiker andere browser opent of cache wist: data weg. Dit is de volgende grote bouwfase.

### Gemiddeld
- **Module 07 mist MODULE.md** — geen documentatie van features of datamodel.
- **README.md inconsistent** — vermeldt "3 modules live" en "5 modules live" op verschillende plekken. Klopt niet (6 actief).
- **`klaar_voorraad` gap** — Module 04 leest dit maar geen module schrijft het. Voorraad-tab is functioneel leeg.

### Laag (tech debt)
- `KLAAR-API-KEYS.md` bevat echte API keys — nooit in git zetten.
- `debug.html` en `test-prijstrend.html` in rootmap — opruimen of documenteren.
- Backup-mappen groeien. Module 04 heeft veel backups. Na elke maand: keep last 5, rest weg.
- Module 07 settings modal heeft nog een lege API-key input die nergens naartoe leidt — HTML cleanup.
- Module 03 HACCP: de `ccp-api-warn` div bestaat nog in de HTML maar is verborgen via JS. HTML cleanup.

---

## Health Check Protocol

```bash
# Script tag balance
for f in $(find /path/to/Klaar -name "*.html" -not -path "*/backups/*"); do
  opens=$(grep -c '<script' "$f")
  closes=$(grep -c '</script>' "$f")
  [ "$opens" != "$closes" ] && echo "⚠ MISMATCH: $f ($opens/$closes)"
done

# Directe Anthropic calls (moet 0 zijn na proxy migratie)
grep -rn "fetch.*anthropic.com" /path/to/Klaar --include="*.html" --exclude-dir=backups
```

---

## Product Roadmap

### Wat het product nu IS (2026-06-12)
- 6 werkende modules met AI via server-side Supabase proxy (geen API key nodig voor gebruiker)
- Supabase Auth: email OTP login op alle modules
- Data: nog steeds localStorage (geen cloud sync)
- Pricing: €22–€29/m per module, nog niet gefactureerd

### Fase 2: Data naar Supabase (VOLGENDE BOUWFASE)
De auth infrastructuur is klaar. Nu de data verplaatsen:
1. **Sync recepten** (klaar_recipes → `public.recipes`) — Module 01 schrijft, 02/04/10 lezen
2. **Sync ingrediënten** (klaar_ingredienten → `public.ingredients`) — Module 01 schrijft, 04/07 lezen
3. **Sync HACCP logs** (klaar_haccp_log → `public.haccp_logs`) — Module 03
4. **Migratie tool** — bestaande localStorage data importeren naar Supabase bij eerste login

Aanpak: voeg sync-functies toe aan `klaar-client.js` (`klaarSave`, `klaarLoad`), vervang localStorage calls per module.

### Fase 3: Billing + Subscription
- Stripe integratie voor betaling
- Supabase `profiles.subscription_tier` aansturen
- Edge Function: check tier voor AI quota
- Trial enforcement (nu nog niet actief)

### Fase 4: Onboarding
- Lege state per module uitleggen
- Demo data auto-laden bij eerste login
- Korte guided tour (max 3 stappen)

### Andere openstaande items
- Module 04 Voorraad tab: data komt nergens vandaan → bouw Voorraad module of haal tab weg
- Responsive/tablet check: werkt het op iPad in de keuken?
- Module 07 MODULE.md schrijven

---

## Sessie Log

| Datum | Wat gedaan | Resultaat |
|-------|------------|-----------|
| 2026-06-12 | Module 01: AI prompt rewrite, food cost bar, demo data | ✅ |
| 2026-06-12 | Module 04: kritieke script tag fix (chat widget in print template) | ✅ Script tags OK, browsertest uitstaand |
| 2026-06-12 | KLAAR-STATUS.md aangemaakt, weekly health check scheduled | ✅ |
| 2026-06-12 | Supabase project aangemaakt: schema + RLS + triggers deployed | ✅ 5 tabellen live |
| 2026-06-12 | Edge Function `ai-proxy` geschreven en deployed | ✅ Live op Supabase |
| 2026-06-12 | `klaar-client.js` aangemaakt met Supabase client + klaarAI + klaarAIStream | ✅ |
| 2026-06-12 | `index.html`: emailGate → Supabase OTP 2-stap auth | ✅ |
| 2026-06-12 | Alle 6 modules: klaarRequireAuth + klaarAI/klaarAIStream + CDN | ✅ 0 directe Anthropic calls |
| 2026-06-12 | Edge Function update: streaming passthrough toegevoegd | ✅ Deployed |
| 2026-06-12 | Health check: alle script tags balanced, 0 directe Anthropic calls | ✅ |

---

## Volgende concrete stap

**Prioriteit 1 (deze week):** Test de auth flow end-to-end in de browser:
1. Open `index.html` → klik "Gratis starten"
2. Voer email in → ontvang OTP code → voer code in → check redirect naar Module 01
3. Controleer of AI werkt in Module 01 (recept genereren, allergeendetectie, chat)
4. Test Module 04 handmatig: BEREKEN tab, kostprijsoverzicht, chat widget

**Prioriteit 2 (volgende sessie):** Fase 2 starten — data sync recepten naar Supabase.

*Bijwerken na elke sessie die code aanpast.*
