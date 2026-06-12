# Klaar Design System v1

> Elke nieuwe module of feature volgt dit document. Module 01 (Recept Studio) is de referentie.

---

## Typografie

| Rol | Lettertype | Gebruik |
|---|---|---|
| Koppen / logo | **Bebas Neue** | Grote titels, stat-getallen, chat-kop, module-naam in header |
| Labels / mono | **DM Mono** | Knoppen, badges, tabs, form-labels, nav-tekst |
| Body | **DM Sans** | Lopende tekst, kaartinhoud, dropdown-items |

Google Fonts import (verplicht in elke module):

```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
```

---

## Kleurpalet

```css
:root {
  /* Dark zone (header, sidebar, chat) */
  --black:   #0a0a0a;
  --surface: #111111;
  --surface2:#161616;
  --border:  #222222;
  --border2: #333333;
  --lime:    #e8ff47;   /* enige accent */
  --white:   #eeeeee;
  --gray:    #666666;
  --muted:   #3a3a3a;

  /* Light zone (hoofd-content) */
  --lbg:     #f6f4f0;
  --lsurface:#ffffff;
  --lborder: #e2ddd6;
  --lborder2:#ccc8c0;
  --ltext:   #1a1a1a;
  --lmuted:  #999591;

  /* Status */
  --danger:  #c0392b;
  --complete:#27ae60;

  /* Layout */
  --hdr: 54px;
}
```

**Regels:**
- Accent = alleen `--lime` (#e8ff47) — geen andere kleuren voor interactieve nadruk
- Donkere zone: header, sidebar, chat panel, overlays
- Lichte zone: hoofd-contentgebied (`.hoofd`)
- Geen border-radius (of maximaal 2–4px voor kleine chips/tags)
- Geen drop shadows

---

## HTML-structuur van een module

```html
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Klaar — [Module naam]</title>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
  <script src="../klaar-client.js"></script>
  <style>/* module CSS hier */</style>
</head>
<body>

<header>
  <a class="back-link" href="../index.html">← Klaar</a>
  <span class="h-div"></span>
  <span class="logo">KLAAR</span>
  <span class="mod-badge">MODULE XX — NAAM</span>
  <div class="h-tabs">
    <button class="h-tab active" onclick="...">Tab A</button>
    <button class="h-tab"        onclick="...">Tab B</button>
  </div>
  <div class="h-actions">
    <!-- klaar-client.js injecteert hier automatisch de ⊞ Modules knop -->
    <button class="btn-hdr" onclick="...">Actie</button>
    <button class="btn-hdr primary" onclick="...">Primaire actie</button>
    <span id="gebruikerLabel"></span>
    <button class="btn-hdr" onclick="klaarSignOut()">Uitloggen</button>
  </div>
</header>

<div class="app">
  <div class="hoofd">
    <!-- Light zone: module-content -->
  </div>
  <!-- Optioneel: -->
  <div class="chat-panel">...</div>
  <aside class="sidebar">...</aside>
</div>

<script>
  (async () => {
    const session = await klaarRequireAuth()
    if (!session) return
    // module init
  })()
</script>
</body>
</html>
```

---

## CSS-componenten

### Header

```css
header {
  height: var(--hdr); flex-shrink: 0;
  background: var(--surface); border-bottom: 1px solid var(--border);
  display: flex; align-items: center; padding: 0 16px; gap: 10px; z-index: 100;
  position: sticky; top: 0;
}
.back-link {
  font-size: 11px; font-family: 'DM Mono', monospace; color: var(--white);
  padding: 4px 10px; border: 1px solid var(--border); transition: all .15s;
}
.back-link:hover { border-color: var(--lime); color: var(--lime); }
.h-div  { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
.logo   { font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: var(--lime); letter-spacing: .04em; }
.mod-badge { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--gray); letter-spacing: .12em; text-transform: uppercase; }
```

### Tabs (in header)

```css
.h-tabs {
  display: flex; gap: 2px; flex: 1;
  background: var(--surface2); padding: 3px; max-width: 400px; margin-left: 6px;
}
.h-tab {
  flex: 1; padding: 5px 14px; font-size: 10px; font-family: 'DM Mono', monospace;
  color: var(--gray); background: none; border: none; cursor: pointer;
  letter-spacing: .08em; text-transform: uppercase; transition: all .2s;
}
.h-tab:hover  { color: var(--white); background: rgba(255,255,255,.05); }
.h-tab.active { background: var(--lime); color: #000; font-weight: 600; }
```

### Header-knoppen

```css
.btn-hdr {
  padding: 0 12px; height: 28px;
  background: none; border: 1px solid var(--border); color: var(--gray);
  cursor: pointer; font-family: 'DM Mono', monospace; font-size: 10px;
  letter-spacing: .06em; text-transform: uppercase; transition: all .15s;
}
.btn-hdr:hover         { border-color: var(--white); color: var(--white); }
.btn-hdr.primary       { background: var(--lime); color: #000; border-color: var(--lime); font-weight: 700; }
.btn-hdr.primary:hover { background: #d4e83d; }
```

### Knoppen (in content)

```css
.btn {
  padding: 6px 14px; border: 1px solid var(--lborder2); font-size: 11px;
  font-family: 'DM Mono', monospace; letter-spacing: .05em;
  cursor: pointer; transition: all .15s; background: none; color: var(--ltext);
  text-transform: uppercase;
}
.btn-primair  { background: var(--lime); color: #000; border-color: var(--lime); font-weight: 700; }
.btn-secundair{ background: rgba(232,255,71,.1); color: #555; border-color: rgba(232,255,71,.3); }
.btn-ghost    { background: none; border-color: transparent; color: var(--lmuted); }
.btn-gevaar   { border-color: rgba(192,57,43,.4); color: var(--danger); }
```

### Cards (light zone)

```css
.card { background: var(--lsurface); border: 1px solid var(--lborder); padding: 18px; margin-bottom: 14px; }
.card-titel {
  font-size: 11px; font-family: 'DM Mono', monospace;
  letter-spacing: .09em; text-transform: uppercase; color: var(--lmuted); margin-bottom: 14px;
}
```

### Chat panel

```css
.chat-panel { width: 0; overflow: hidden; transition: width .28s ease; border-left: 1px solid var(--border); background: var(--surface); }
.chat-panel.open { width: 340px; }
/* Berichten */
.bericht-ai   { background: var(--surface2); color: var(--white); border: 1px solid var(--border); }
.bericht-user { background: var(--lime); color: #000; font-weight: 500; }
```

### Forms (in light zone)

```css
input, select, textarea {
  border: 1px solid var(--lborder); padding: 7px 10px; font-size: 12px;
  background: var(--lsurface); color: var(--ltext); border-radius: 0; outline: none;
}
input:focus, select:focus, textarea:focus { border-color: var(--lborder2); }
label { font-size: 10px; font-family: 'DM Mono', monospace; letter-spacing: .09em; text-transform: uppercase; color: var(--lmuted); }
```

---

## Module navigatie (auto-inject via klaar-client.js)

`klaar-client.js` injecteert automatisch een **⊞ Modules** knop in `.h-actions` of `.nav-acties`.

- Activeren: geen actie nodig — werkt zodra de pagina laadt
- Gedrag: klikken opent dropdown met alle 7 modules + Dashboard link
- Huidige module wordt gemarkeerd in `--lime`
- Modules toevoegen: update de `KLAAR_MODS` array in `klaar-client.js`

---

## Dev modus

Activeren: open `index.html?dev=klaar2026`  
Uitschakelen: klik banner, of open `index.html?cleardev=1`

Dev modus slaat auth over. AI proxy werkt pas na echte login.

---

## Modules

| Nr | Naam | Bestand |
|---|---|---|
| 01 | Recept Studio | `01-recept-studio/klaar-recept-studio.html` |
| 02 | Allergenenkaart | `02-allergenenkaart/klaar-allergenenkaart.html` |
| 03 | HACCP | `03-haccp/klaar-haccp.html` |
| 04 | Kostprijs | `04-kostprijs/klaar-kostprijs.html` |
| 05 | Menubuilder | `05-menubuilder/klaar-menubuilder.html` |
| 07 | Leveranciers | `07-leveranciers/klaar-leveranciers.html` |
| 10 | Catering & Events | `10-catering-events/klaar-catering.html` |

---

## Wat NIET te doen

- Geen border-radius > 4px (behalve kleine chips: max 4px)
- Geen box-shadows
- Geen paarse, rode, groene of blauwe accenten voor UI-interactie (alleen voor semantische status/badges)
- Geen systeem-fonts (`-apple-system`, `BlinkMacSystemFont`) — altijd DM Sans
- Geen inline `style=""` voor kleuren of layout — altijd CSS-klassen of CSS-variabelen
- Geen extra accent-kleuren introduceren zonder overleg
