# Supabase Pro — Klaar Referentiegids

> Plan: **Pro** ($25/maand) — actief sinds juni 2026  
> Project: `imiqoxsjdynliydsuihc` (Klaar.app)  
> Org billing: https://supabase.com/dashboard/org/[org-id]/billing

---

## Wat zit er in het Pro plan

### Database
| Wat | Free | **Pro** |
|-----|------|---------|
| Disk per project | 500 MB | **8 GB** (daarna $0.125/GB) |
| Max disk | — | 16 TB (General Purpose) |
| Auto-scaling disk | ✗ | ✓ (groeit bij 90% vol) |
| Backups | ✗ | **7 dagen** dagelijks |
| Point-in-Time Recovery | ✗ | $100/mnd per 7 dagen extra |
| Project pauzering | Na 1 week inactief | **Nooit** |
| Egress | 5 GB | **250 GB** |

### Auth
| Wat | Free | **Pro** |
|-----|------|---------|
| MAU | 50.000 | **100.000** (daarna $0.00325/MAU) |
| Supabase branding in emails | Verplicht | **Verwijderbaar** ✓ |
| Auth audit logs | 1 uur | **7 dagen** |
| Leaked password protection | ✗ | **✓ (aanzetten!)** |
| Single session per user | ✗ | **✓** |
| Session timeouts | ✗ | **✓** |
| Email template editing | ✗ | **✓** |
| SAML/SSO | ✗ | 50 gratis, dan $0.015/MAU |
| Advanced MFA (telefoon/SMS) | ✗ | $75/mnd eerste project |
| Custom SMTP | ✓ | ✓ |

### Storage
| Wat | Free | **Pro** |
|-----|------|---------|
| Opslag | 1 GB | **100 GB** (daarna $0.0213/GB) |
| Max bestand upload | 50 MB | **500 GB** |
| CDN | Basic | **Smart CDN** |
| Cached egress | 5 GB | **250 GB** |
| Image Transformations | ✗ | 100 gratis, dan $5/1000 |

### Edge Functions
| Wat | Free | **Pro** |
|-----|------|---------|
| Invocations/mnd | 500.000 | **2 miljoen** (dan $2/mln) |

### Realtime
| Wat | Free | **Pro** |
|-----|------|---------|
| Concurrent connections | 200 | **500** (dan $10/1000) |
| Messages/mnd | 2 miljoen | **5 miljoen** |
| Max berichtgrootte | 256 KB | **3 MB** |

### Platform
| Wat | Free | **Pro** |
|-----|------|---------|
| Log retention | 1 dag | **7 dagen** |
| Metrics endpoint | ✗ | **✓** |
| Vanity URLs | ✗ | **✓** |
| Custom domains | ✗ | $10/domein/mnd |
| Email support | ✗ | **✓** |

---

## Direct aanzetten na Pro upgrade

### 1. Supabase branding verwijderen uit emails
**Locatie:** Dashboard → Auth → Emails → scroll naar "Supabase Branding"  
Schakel uit zodat emails puur van Klaar lijken te komen.

### 2. Leaked password protection
**Locatie:** Dashboard → Auth → Sign In / Providers → "Password Security"  
Schakelt verificatie in via HaveIBeenPwned. Als een gebruiker een wachtwoord invult dat in een datalek zit, wordt die geblokkeerd. **Gratis ingebouwd, geen extra kosten.**

### 3. Session timeout (optioneel)
**Locatie:** Dashboard → Auth → Sessions  
Stel in hoe lang een sessie actief blijft zonder activiteit. Handig voor horeca-tablets die gedeeld worden.

### 4. Single session per user (optioneel)
**Locatie:** Dashboard → Auth → Sessions → "Single session per user"  
Als iemand op een nieuw apparaat inlogt, wordt de oude sessie automatisch beëindigd. Overweeg dit voor accounts die maar op één apparaat actief mogen zijn.

### 5. Auth audit logs
Nu 7 dagen beschikbaar (was 1 uur op Free). Handig bij verdachte inlogpogingen.  
**Locatie:** Dashboard → Auth → Audit Logs

---

## Wat je NIET meer zelf hoeft te bouwen

| Feature | Was nodig? | Nu ingebouwd |
|---------|-----------|--------------|
| Rate limiting voor auth | Zelf bouwen | ✓ Supabase throttled automatisch |
| Leaked password check | Eigen API-call | ✓ Ingebouwd in Pro |
| Session management | Eigen logica | ✓ Via session timeout + single session |
| Email branding | Custom SMTP nodig | ✓ Template editor + branding removal |
| File CDN caching | Eigen CDN | ✓ Smart CDN ingebouwd |
| DB backups | Zelf exporteren | ✓ 7-daagse automatische backups |
| Disk uitbreiden | Handmatig | ✓ Auto-scaling |

---

## Kosten bewaken

Pro heeft standaard een **spend cap** aan. Dat betekent dat je bij overschrijding van limieten geblokkeerd wordt (ipv onbeperkte rekening).

**Aanbevolen instelling voor Klaar nu:**  
- Spend cap: **AAN** laten (beschermt tegen onverwachte kosten)
- Pas uitschakelen als Klaar actief gebruikers heeft en je de groei wilt accommoderen

**Locatie spend cap:** Dashboard → Organization → Billing → "Spend Cap"

---

## Upgrade drempels — wanneer naar Team ($599/mnd)?

| Wanneer upgraden | Team biedt |
|-----------------|-----------|
| Je hebt een audit nodig (SOC2/ISO27001) | ✓ Inbegrepen |
| Klanten eisen HIPAA-compliance | Beschikbaar als add-on |
| Je hebt SLA-garanties nodig | Priority support + SLA |
| 14 dagen backups nodig | Inbegrepen (vs 7 bij Pro) |
| Read-only toegang voor externe partijen | Project-scoped roles |

**Voor Klaar nu: Pro is ruimschoots voldoende.** Team pas overwegen bij enterprise horeca-klanten met compliancevereisten.

---

## Add-ons die relevant kunnen worden

| Add-on | Prijs | Wanneer nodig |
|--------|-------|--------------|
| Custom Domain | $10/domein/mnd | Als `getklaar.app` als Supabase URL moet werken |
| Point-in-Time Recovery | $100/mnd / 7 dgn | Bij kritieke productiedata die minutenprecies hersteld moet worden |
| Database Branching | $0.01344/branch/uur | Bij actieve feature-development met eigen DB per branch |
| Advanced MFA (SMS) | $75/mnd | Als je SMS-verificatie wilt naast email OTP |
| Image Transformations | $5/1000 origins | Als je foto's van gerechten on-the-fly wilt resizen |

---

## Huidige project limieten checken

Bekijk real-time gebruik:  
`https://supabase.com/dashboard/project/imiqoxsjdynliydsuihc/reports`

Of via Metrics endpoint (nieuw in Pro):  
`https://imiqoxsjdynliydsuihc.supabase.co/customer/v1/privileged/metrics`  
(Vereist service role key)

---

## Auth template status (juni 2026)

- ✅ **Email template bijgewerkt** — "Jouw inlogcode voor Klaar"
- ✅ **`{{ .Token }}`** zichtbaar in template (6-cijferige code)
- ✅ **`{{ .ConfirmationURL }}`** als fallback magic link
- ✅ **Site URL** gecorrigeerd naar `https://getklaar.vercel.app`
- ⬜ Supabase branding uitzetten in emails (nog te doen)
- ⬜ Leaked password protection aanzetten (nog te doen)

---

*Bijgewerkt: juni 2026 | Bron: https://supabase.com/pricing*
