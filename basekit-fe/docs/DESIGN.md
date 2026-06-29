---
version: alpha
name: Apple
description: A photography-first interface that turns marketing into a museum gallery. Edge-to-edge product tiles alternate light and dark canvases, framed by DM Sans headlines with negative letter-spacing and a single Action Blue (var(--primary)) interactive color. UI chrome recedes so the product can speak — no decorative gradients, no shadows on chrome, only the one signature drop-shadow under product imagery resting on a surface.

colors:
  # Brand & interactive
  --primary: "oklch(0.5828 0.2188 258.8797)"                 # ≈ #1a6ef4 — Action Blue (light)
  --primary-foreground: "oklch(0.9670 0.0029 264.5419)"       # ≈ #f4f4fd — On-primary text
  --ring: "oklch(0.5565 0.2430 261.9529)"                     # ≈ #1564f8 — Focus Blue (light)
  --sidebar-primary: "oklch(0.6610 0.1822 256.5730)"          # ≈ #5580f4 — Action Blue on dark (dark only)
  --sidebar-ring: "oklch(0.7429 0.1344 255.6155)"             # ≈ #8099f0 — Focus ring on dark (dark only)
  --accent: "oklch(0.9712 0.0136 258.3446)"                   # ≈ #f0f0fe — Accent surface (light)
  --accent-foreground: "oklch(0.6081 0.2114 266.2130)"        # ≈ #4a6ef5 — Accent text (light)

  # Surfaces — light mode
  --card: "oklch(1.0000 0 0)"                                 # #ffffff — White canvas
  --background: "oklch(0.9946 0.0026 286.3519)"               # ≈ #f9f9ff — Parchment canvas
  --muted: "oklch(0.9601 0.0093 286.2229)"                    # ≈ #f2f2f8 — Pearl surface
  --secondary: "oklch(0.9518 0.0231 277.9569)"                # ≈ #eef0fb — Chip / translucent surface
  --popover: "oklch(1.0000 0 0)"                              # #ffffff — Popover surface

  # Surfaces — dark mode
  --background-dark: "oklch(0.1440 0.0028 247.0906)"          # ≈ #141419 — Dark tile 1
  --card-dark: "oklch(0.1809 0.0052 248.1162)"                # ≈ #191920 — Dark tile 2
  --popover-dark: "oklch(0.1899 0.0051 248.0992)"             # ≈ #1a1a21 — Dark tile 3
  --sidebar-dark: "oklch(0.1809 0.0052 248.1162)"             # ≈ #191920 — Sidebar (dark)
  --secondary-dark: "oklch(0.2673 0.0433 266.5444)"           # ≈ #252840 — Chip / translucent (dark)

  # Text
  --foreground: "oklch(0.1615 0.0105 285.1663)"               # ≈ #1a1a2e — Ink / body (light)
  --card-foreground-dark: "oklch(0.9643 0.0083 271.3283)"     # ≈ #f4f4fc — Body on dark
  --muted-foreground: "oklch(0.5052 0.0379 284.9640)"         # ≈ #76768a — Body muted
  --secondary-foreground: "oklch(0.4446 0.0983 268.5283)"     # ≈ #4a5282 — Ink muted 80
  --muted-foreground-dark: "oklch(0.7364 0.0183 248.0773)"    # ≈ #a8a8bc — Body muted (dark)

  # Borders & inputs
  --border: "oklch(0.9163 0.0162 286.0759)"                   # ≈ #e2e2ed — Divider / hairline (light)
  --input: "oklch(0.9163 0.0162 286.0759)"                    # ≈ #e2e2ed — Input border (light)
  --border-dark: "oklch(0.2258 0.0025 247.9355)"              # ≈ #202027 — Border (dark)

  # Status
  --destructive: "oklch(0.6368 0.2078 25.3313)"               # ≈ #e5534b — Destructive (light)
  --destructive-foreground: "oklch(0.9842 0.0034 247.8575)"   # ≈ #f8f8fe
  --destructive-dark: "oklch(0.5260 0.2086 27.2595)"          # ≈ #c93f37 — Destructive (dark)

  # Charts
  --chart-1: "oklch(0.5553 0.2554 283.4559)"                  # ≈ #3050f8 — Blue
  --chart-2: "oklch(0.6037 0.2141 267.5162)"                  # ≈ #5062f5 — Blue-indigo
  --chart-3: "oklch(0.7495 0.1297 210.9704)"                  # ≈ #4aacd8 — Teal
  --chart-4: "oklch(0.8023 0.1492 175.5763)"                  # ≈ #52d4b4 — Green-teal
  --chart-5: "oklch(0.6945 0.1422 167.0638)"                  # ≈ #38a878 — Green

typography:
  hero-display:
    fontFamily: "DM Sans, system-ui, -apple-system, sans-serif"
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.07
    letterSpacing: -0.28px
  display-lg:
    fontFamily: "DM Sans, system-ui, -apple-system, sans-serif"
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: 0
  display-md:
    fontFamily: "DM Sans, system-ui, -apple-system, sans-serif"
    fontSize: 34px
    fontWeight: 600
    lineHeight: 1.47
    letterSpacing: -0.374px
  lead:
    fontFamily: "DM Sans, system-ui, -apple-system, sans-serif"
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.14
    letterSpacing: 0.196px
  lead-airy:
    fontFamily: "DM Sans, system-ui, -apple-system, sans-serif"
    fontSize: 24px
    fontWeight: 300
    lineHeight: 1.5
    letterSpacing: 0
  tagline:
    fontFamily: "DM Sans, system-ui, -apple-system, sans-serif"
    fontSize: 21px
    fontWeight: 600
    lineHeight: 1.19
    letterSpacing: 0.231px
  body-strong:
    fontFamily: "DM Sans, system-ui, -apple-system, sans-serif"
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.24
    letterSpacing: -0.374px
  body:
    fontFamily: "DM Sans, system-ui, -apple-system, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.47
    letterSpacing: -0.374px
  dense-link:
    fontFamily: "DM Sans, system-ui, -apple-system, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 2.41
    letterSpacing: 0
  caption:
    fontFamily: "DM Sans, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: -0.224px
  caption-strong:
    fontFamily: "DM Sans, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.29
    letterSpacing: -0.224px
  button-large:
    fontFamily: "DM Sans, system-ui, -apple-system, sans-serif"
    fontSize: 18px
    fontWeight: 300
    lineHeight: 1.0
    letterSpacing: 0
  button-utility:
    fontFamily: "DM Sans, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.29
    letterSpacing: -0.224px
  fine-print:
    fontFamily: "DM Sans, system-ui, -apple-system, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: -0.12px
  micro-legal:
    fontFamily: "DM Sans, system-ui, -apple-system, sans-serif"
    fontSize: 10px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: -0.08px
  nav-link:
    fontFamily: "DM Sans, system-ui, -apple-system, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: -0.12px

rounded:
  none: 0px
  xs: 5px
  sm: 8px
  md: 11px
  lg: 18px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 17px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 80px

components:
  button-primary:
    backgroundColor: "{var(--primary)}"
    textColor: "{var(--primary-foreground)}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: 11px 22px
  button-primary-focus:
    backgroundColor: "{var(--primary)}"
    textColor: "{var(--primary-foreground)}"
    rounded: "{rounded.pill}"
  button-primary-active:
    backgroundColor: "{var(--primary)}"
    textColor: "{var(--primary-foreground)}"
    rounded: "{rounded.pill}"
  button-secondary-pill:
    backgroundColor: "{var(--card)}"
    textColor: "{var(--primary)}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: 11px 22px
  button-dark-utility:
    backgroundColor: "{var(--foreground)}"
    textColor: "{var(--card-foreground-dark)}"
    typography: "{typography.button-utility}"
    rounded: "{rounded.sm}"
    padding: 8px 15px
  button-pearl-capsule:
    backgroundColor: "{var(--muted)}"
    textColor: "{var(--secondary-foreground)}"
    typography: "{typography.caption}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  button-store-hero:
    backgroundColor: "{var(--primary)}"
    textColor: "{var(--primary-foreground)}"
    typography: "{typography.button-large}"
    rounded: "{rounded.pill}"
    padding: 14px 28px
  button-icon-circular:
    backgroundColor: "{var(--secondary)}"
    textColor: "{var(--foreground)}"
    rounded: "{rounded.full}"
    size: 44px
  text-link:
    backgroundColor: transparent
    textColor: "{var(--primary)}"
    typography: "{typography.body}"
  text-link-on-dark:
    backgroundColor: transparent
    textColor: "{var(--sidebar-primary)}"
    typography: "{typography.body}"
  global-nav:
    backgroundColor: "oklch(0 0 0)"
    textColor: "{var(--card-foreground-dark)}"
    typography: "{typography.nav-link}"
    height: 44px
  sub-nav-frosted:
    backgroundColor: "{var(--background)}"
    textColor: "{var(--foreground)}"
    typography: "{typography.tagline}"
    height: 52px
  product-tile-light:
    backgroundColor: "{var(--card)}"
    textColor: "{var(--foreground)}"
    typography: "{typography.display-lg}"
    rounded: "{rounded.none}"
    padding: 80px
  product-tile-parchment:
    backgroundColor: "{var(--background)}"
    textColor: "{var(--foreground)}"
    typography: "{typography.display-lg}"
    rounded: "{rounded.none}"
    padding: 80px
  product-tile-dark:
    backgroundColor: "{var(--background-dark)}"
    textColor: "{var(--card-foreground-dark)}"
    typography: "{typography.display-lg}"
    rounded: "{rounded.none}"
    padding: 80px
  product-tile-dark-2:
    backgroundColor: "{var(--card-dark)}"
    textColor: "{var(--card-foreground-dark)}"
    rounded: "{rounded.none}"
  product-tile-dark-3:
    backgroundColor: "{var(--popover-dark)}"
    textColor: "{var(--card-foreground-dark)}"
    rounded: "{rounded.none}"
  store-utility-card:
    backgroundColor: "{var(--card)}"
    textColor: "{var(--foreground)}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.lg}"
    padding: 24px
  configurator-option-chip:
    backgroundColor: "{var(--card)}"
    textColor: "{var(--foreground)}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 12px 16px
  configurator-option-chip-selected:
    backgroundColor: "{var(--card)}"
    textColor: "{var(--foreground)}"
    rounded: "{rounded.pill}"
  search-input:
    backgroundColor: "{var(--card)}"
    textColor: "{var(--foreground)}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: 12px 20px
    height: 44px
  floating-sticky-bar:
    backgroundColor: "{var(--background)}"
    textColor: "{var(--foreground)}"
    typography: "{typography.body}"
    height: 64px
    padding: 12px 32px
  environment-quote-card:
    backgroundColor: "{var(--background-dark)}"
    textColor: "{var(--card-foreground-dark)}"
    typography: "{typography.display-lg}"
    rounded: "{rounded.none}"
    padding: 80px
  footer:
    backgroundColor: "{var(--background)}"
    textColor: "{var(--secondary-foreground)}"
    typography: "{typography.fine-print}"
    padding: 64px
---

## Overview

Apple's web presence is a masterclass in **reverent product photography framed by near-invisible UI**. Every page is a stack of edge-to-edge product "tiles" — alternating light and dark canvases, each centered on a hero headline, a one-line tagline, two tiny blue pill CTAs, and an impossibly crisp product render. Nothing competes with the product. Typography is confident but quiet; color is either `{var(--card)}` (pure white), `{var(--background)}` (off-white parchment), or a near-black tile (`{var(--background-dark)}`); interactive elements are a single, quiet blue.

Density is unusually low even by contemporary SaaS standards. Each tile occupies roughly one viewport, and there is no decorative chrome — no borders, no gradients, no decorative frames, no shadows on headlines. Elevation appears only when a product image rests on a surface (a single soft `rgba(0, 0, 0, 0.22) 3px 5px 30px` drop for visual weight). The result is a catalog that feels more like a museum gallery: the wall disappears and the artifact takes over.

Store and shop surfaces retain the same chassis but switch modes. The product configurator (iPhone 17 Pro, accessories grid) introduces a tight grid of white utility cards at `{rounded.lg}` (18px) radius with a thin border, paired with a persistent thin sub-nav strip. The environment page leans darker and more editorial. Across all five surfaces the typographic system, spacing rhythm, and the single blue accent are consistent — this is one design language expressed at different volumes.

**Key Characteristics:**

- Photography-first presentation; UI recedes so the product can speak.
- Alternating full-bleed tile sections: white/parchment ↔ near-black, with the color change itself acting as the section divider.
- Single blue accent (`{var(--primary)}` — oklch(0.5828 0.2188 258.8797)) carries every interactive element. No second brand color exists.
- Two button grammars: tiny blue pill CTAs (`{rounded.pill}`) and compact utility rects (`{rounded.sm}`).
- DM Sans — negative letter-spacing at display sizes for a signature tight headline feel.
- Whisper-soft elevation used only when a product image needs to breathe — exactly one drop-shadow in the entire system.
- Tight two-row nav: slim `{component.global-nav}` + product-specific `{component.sub-nav-frosted}` with persistent right-aligned primary CTA.
- Section rhythm across multiple pages: light hero → dark product tile → light utility tile → dark tile → parchment footer — a predictable pulse.

## Colors

> **Source pages analyzed:** homepage, environment, store, iPhone 17 Pro buy page, accessories index. The color system is identical across all five surfaces; only the surface-mode mix differs.

### Brand & Accent

- **Action Blue** (`{var(--primary)}` — oklch(0.5828 0.2188 258.8797) ≈ #1a6ef4): The single brand-level interactive color. All text links, all blue pill CTAs ("Learn more", "Buy"), and the focus ring root. This is the quiet but universal "click me" signal. Press state shifts via the active scale transform rather than a color change.
- **Focus Blue** (`{var(--ring)}` — oklch(0.5565 0.2430 261.9529) ≈ #1564f8): A marginally more vivid sibling of Action Blue, reserved for the keyboard focus ring on buttons (`outline: 2px solid`).
- **Sky Link Blue** (`{var(--sidebar-primary)}` dark — oklch(0.6610 0.1822 256.5730) ≈ #5580f4): A brighter blue used on dark surfaces for in-copy links and inline callouts, where Action Blue would disappear against the dark tile background.

### Surface

- **Pure White** (`{var(--card)}` — oklch(1.0000 0 0) / #ffffff): The dominant canvas. Content, utility cards, store tiles, configurator grids.
- **Parchment** (`{var(--background)}` — oklch(0.9946 0.0026 286.3519) ≈ #f9f9ff): The signature off-white. Used for alternating light tiles, footer region, and the default page canvas in store utility sections. Just different enough from pure white to create rhythm.
- **Pearl Button** (`{var(--muted)}` — oklch(0.9601 0.0093 286.2229) ≈ #f2f2f8): A near-white used as the fill for secondary "ghost" buttons — lighter than the parchment canvas so the button still reads as a button against `{var(--background)}`.
- **Near-Black Tile 1** (`{var(--background-dark)}` — oklch(0.1440 0.0028 247.0906) ≈ #141419): The primary dark-tile surface on the homepage product grid.
- **Near-Black Tile 2** (`{var(--card-dark)}` — oklch(0.1809 0.0052 248.1162) ≈ #191920): A micro-step lighter — used where a dark tile sits directly above or below Tile 1 to create the faintest separation.
- **Near-Black Tile 3** (`{var(--popover-dark)}` — oklch(0.1899 0.0051 248.0992) ≈ #1a1a21): A micro-step lighter still — used at the bottom of the stack and in embedded video/player frames.
- **Pure Black** (`oklch(0 0 0)` / #000000): Reserved for true void — video player backgrounds, edge-to-edge photographic overlays, the global nav bar background.
- **Translucent Chip** (`{var(--secondary)}` — oklch(0.9518 0.0231 277.9569) ≈ #eef0fb): The base of the translucent chip used over photography for circular control buttons. In production, applied at ~64% alpha.

### Text

- **Near-Black Ink** (`{var(--foreground)}` — oklch(0.1615 0.0105 285.1663) ≈ #1a1a2e): The voice of every headline, every body paragraph, and the dark utility button's fill.
- **Body On Dark** (`{var(--card-foreground-dark)}` dark — oklch(0.9643 0.0083 271.3283) ≈ #f4f4fc): All text on dark tiles and on the global nav bar.
- **Body Muted** (`{var(--muted-foreground)}` — oklch(0.5052 0.0379 284.9640) ≈ #76768a): Secondary copy on dark tiles where full-white would be too loud; also used for muted foreground in light mode.
- **Ink Muted 80** (`{var(--secondary-foreground)}` — oklch(0.4446 0.0983 268.5283) ≈ #4a5282): Body text on the Pearl Button surface — slightly softer than full ink.
- **Ink Muted 48** (`{var(--muted-foreground)}` — same token): Disabled button text and legal fine-print.

### Hairlines & Borders

- **Divider Soft / Hairline** (`{var(--border)}` — oklch(0.9163 0.0162 286.0759) ≈ #e2e2ed): The 1px hairline border on store utility cards and configurator chips; also functions as a ring shadow on secondary buttons when applied as `rgba(0, 0, 0, 0.04)`.

### Charts

| Token | OKLCH | Approx Hex | Use |
|---|---|---|---|
| `{var(--chart-1)}` | oklch(0.5553 0.2554 283.4559) | ≈ #3050f8 | Primary data series — blue |
| `{var(--chart-2)}` | oklch(0.6037 0.2141 267.5162) | ≈ #5062f5 | Secondary — blue-indigo |
| `{var(--chart-3)}` | oklch(0.7495 0.1297 210.9704) | ≈ #4aacd8 | Tertiary — teal |
| `{var(--chart-4)}` | oklch(0.8023 0.1492 175.5763) | ≈ #52d4b4 | Quaternary — green-teal |
| `{var(--chart-5)}` | oklch(0.6945 0.1422 167.0638) | ≈ #38a878 | Quinary — green |

### Brand Gradient

**No decorative gradients.** Atmospheric depth on product photography is inherent to the imagery, not a CSS gradient overlay. Zero gradient-based design tokens are defined.

## Typography

### Font Family

- **Display & Body**: `DM Sans, system-ui, -apple-system, sans-serif` (`var(--font-sans)`) — the primary typeface for all sizes. Optimized for clean, modern legibility across all display and body sizes.
- **Mono**: `Geist Mono, ui-monospace, monospace` (`var(--font-mono)`) — used for code and technical content.
- **OpenType features**: `font-variant-numeric: numerator` is enabled on numeric links (pricing tables, spec sheets). Display sizes rely on tight tracking rather than contextual ligatures.

### Hierarchy

| Token                         | Size | Weight | Line Height | Letter Spacing | Use                                                    |
| ----------------------------- | ---- | ------ | ----------- | -------------- | ------------------------------------------------------ |
| `{typography.hero-display}`   | 56px | 600    | 1.07        | -0.28px        | Hero headline; the signature tight tracking            |
| `{typography.display-lg}`     | 40px | 600    | 1.10        | 0              | Tile headlines atop every product tile                 |
| `{typography.display-md}`     | 34px | 600    | 1.47        | -0.374px       | Section heads                                          |
| `{typography.lead}`           | 28px | 400    | 1.14        | 0.196px        | Product tile subcopy                                   |
| `{typography.lead-airy}`      | 24px | 300    | 1.5         | 0              | Environment-page lead paragraphs (the rare weight 300) |
| `{typography.tagline}`        | 21px | 600    | 1.19        | 0.231px        | Sub-tile tagline; sub-nav category name                |
| `{typography.body-strong}`    | 17px | 600    | 1.24        | -0.374px       | Inline strong emphasis                                 |
| `{typography.body}`           | 17px | 400    | 1.47        | -0.374px       | Default paragraph                                      |
| `{typography.dense-link}`     | 17px | 400    | 2.41        | 0              | Footer / store utility link lists (relaxed leading)    |
| `{typography.caption}`        | 14px | 400    | 1.43        | -0.224px       | Secondary captions, button text                        |
| `{typography.caption-strong}` | 14px | 600    | 1.29        | -0.224px       | Emphasized captions                                    |
| `{typography.button-large}`   | 18px | 300    | 1.0         | 0              | Store hero CTAs (the rare weight 300)                  |
| `{typography.button-utility}` | 14px | 400    | 1.29        | -0.224px       | Utility/nav button labels                              |
| `{typography.fine-print}`     | 12px | 400    | 1.0         | -0.12px        | Fine-print, footer body                                |
| `{typography.micro-legal}`    | 10px | 400    | 1.3         | -0.08px        | Micro legal disclaimers                                |
| `{typography.nav-link}`       | 12px | 400    | 1.0         | -0.12px        | Global nav menu items                                  |

### Principles

- **Negative letter-spacing at display sizes.** Every headline at 17px and up carries a slight tracking tighten (`-0.12 → -0.374px`). This produces the iconic tight headline cadence. Never used at 12px or below.
- **Body copy at 17px, not 16px.** The extra pixel gives the page an unmistakable "reading, not scanning" pace.
- **Weight 300 is real and rare.** Used deliberately on a handful of large-size reads (`{typography.button-large}` at 18px/300 and `{typography.lead-airy}` at 24px/300). It's a light-atmosphere cue reserved for moments where the content should feel airy.
- **Weight 600, not 700, for headlines.** Headlines sit at weight 600. Weight 700 is used sparingly for `{typography.tagline}` (21px) when a touch more assertion is needed.
- **Line-height is context-specific.** Display sizes use 1.07–1.19 (tight). Body uses 1.47. Utility link stacks in the footer/store use an unusually relaxed 2.41 (`{typography.dense-link}`).
- **Weight 500 is deliberately absent.** The ladder is 300 / 400 / 600 / 700. Mid-weight readings always use 600.

### Note on Font Substitutes

DM Sans is a clean, geometric sans-serif that provides an Apple-adjacent feel on non-Apple platforms. When the system resolves `system-ui, -apple-system` on macOS/iOS/Safari, it falls back to the real SF Pro for native fidelity. On other platforms DM Sans carries the design intent faithfully. Nudge `letter-spacing` down by `-0.01em` on display sizes if deploying on platforms where DM Sans runs slightly wide.

## Layout

### Spacing System

- **Base unit:** 8px. Sub-base values (2, 4, 5, 6, 7) are used for tight typographic adjustments; structural layout snaps to 8/12/16/20/24.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 17px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 80px.
- **Section vertical padding:** `{spacing.section}` (80px) inside a product tile; tiles stack edge-to-edge with 0 gap (the color change provides the break).
- **Card padding:** `{spacing.lg}` (24px) inside utility grid cards.
- **Button padding:** 8–11px vertical, 15–22px horizontal.
- **Universal rhythm constants:** the 17px body line-height multiplier (~25px line) and 21px tagline size show up on every analyzed page.

### Grid & Container

- **Max content width:** ~980px on text-heavy sections (environment), ~1440px on product grids (store, accessories), full-bleed for product tiles (homepage).
- **Column patterns:** 3 to 5 column utility card grid on store/accessories; 2-column side-by-side tiles on homepage occasional sections; single-column centered stack on product tile heroes.
- **Gutters:** 20–24px between cards in a utility grid.

### Whitespace Philosophy

Whitespace is the product's pedestal. Every tile begins with at least 64px of air above its headline and 48–64px below. Product renders are never crowded; the nearest content to a product image is at least 40px away. The footer is the only area that breaks this — there, the design goes deliberately dense to make the full information architecture visible at a glance.

## Elevation & Depth

| Level          | Treatment                                   | Use                                                                         |
| -------------- | ------------------------------------------- | --------------------------------------------------------------------------- |
| Flat           | No shadow, no border                        | Full-bleed tiles, global nav, footer, body sections                         |
| Soft hairline  | 1px `rgba(0, 0, 0, 0.08)` border            | Utility cards (`{var(--border)}`), sub-nav frosted-glass separator          |
| Backdrop blur  | `backdrop-filter: blur(N)` on `{var(--background)}` 80% | Sub-nav and the floating sticky bar                        |
| Product shadow | `rgba(0, 0, 0, 0.22) 3px 5px 30px 0`        | Product renders resting on a surface (the only true "shadow" in the system) |

**Shadow philosophy.** Exactly **one** drop-shadow exists in the system, and it is applied to photographic product imagery — never to cards, never to buttons, never to text. Elevation in the UI comes from (a) surface-color change (`{var(--card)}` ↔ `{var(--background-dark)}`) and (b) backdrop-blur on sticky bars.

### Decorative Depth

- **Atmospheric imagery** on the environment page supplies mood; no CSS gradient involved.
- **Edge-to-edge tile alternation** creates rhythm without borders or shadows — the color change itself is the divider.
- **Backdrop-filter blur** on `{component.sub-nav-frosted}` and `{component.floating-sticky-bar}` creates a "floating over content" effect that's functional, not decorative.

## Shapes

### Border Radius Scale

| Token            | Value        | Use                                                                                                            |
| ---------------- | ------------ | -------------------------------------------------------------------------------------------------------------- |
| `{rounded.none}` | 0px          | Full-bleed product tiles (no corner rounding)                                                                  |
| `{rounded.xs}`   | 5px          | Inline links when styled as subtle chips (rare)                                                                |
| `{rounded.sm}`   | 8px          | Dark utility buttons (Sign In, Bag), inline card imagery                                                       |
| `{rounded.md}`   | 11px         | Pearl Button capsules                                                                                          |
| `{rounded.lg}`   | 18px         | Store utility cards, accessories grid cards                                                                    |
| `{rounded.pill}` | 9999px       | Primary blue pill CTAs, sub-nav buy button, configurator option chips, search input — the signature pill       |
| `{rounded.full}` | 9999px / 50% | Circular control chips floating over photography                                                               |

### Photography Geometry

- **Hero imagery**: full-bleed, 21:9 or taller on the homepage; 16:9 on environment and shop pages.
- **Product renders**: PNG/WebP with transparency; rest on a surface tile and pick up the system shadow.
- **Accessory grid**: square 1:1 crops at `{rounded.lg}` (18px) radius, light neutral backgrounds, product centered with 20–40px internal padding.
- **No rounded imagery in hero tiles** — images are full-bleed rectangular. Rounding (`{rounded.sm}`, `{rounded.lg}`) appears only on inline card imagery.
- Lazy-loading via responsive `srcset` and `sizes` across all breakpoints; CDN-optimized WebP.

## Components

### Top Navigation

**`global-nav`** — Persistent, ultra-thin black nav bar pinned to the top of every page. Background `oklch(0 0 0)`, height 44px, text `{var(--card-foreground-dark)}` in `{typography.nav-link}` (12px / 400 / -0.12px tracking). Links are quiet, spaced ~20px apart, running edge-to-edge across the top. Right-aligned cluster: Search, Bag icons — always visible. On mobile, collapses to hamburger at ~834px and the logo centers.

**`sub-nav-frosted`** — Surface-specific nav that sticks below the global nav. Background `{var(--background)}` at 80% opacity with backdrop-filter blur, creating a frosted-glass effect. Height 52px. Content on left: product category name in `{typography.tagline}` (21px / 600). Content right: inline nav links in `{typography.button-utility}` (14px), ending in a persistent `{component.button-primary}` ("Buy") or a utility link.

### Buttons

**`button-primary`** — The signature action. Background `{var(--primary)}` (Action Blue oklch(0.5828 0.2188 258.8797)), text `{var(--primary-foreground)}` in `{typography.body}` (DM Sans 17px / 400), rounded `{rounded.pill}` (full capsule), padding 11px × 22px. The full-pill radius IS the brand action signal.

- Active state: `{component.button-primary-active}` — `transform: scale(0.95)` (the system-wide micro-interaction).
- Focus state: `{component.button-primary-focus}` — 2px solid `{var(--ring)}` outline.

**`button-secondary-pill`** — Used as the second CTA when two blue pills appear together. Background transparent, text `{var(--primary)}`, 1px solid `{var(--primary)}` border, rounded `{rounded.pill}`, padding 11px × 22px. Reads as a "ghost pill."

**`button-dark-utility`** — Global nav actions. Background `{var(--foreground)}`, text `{var(--card-foreground-dark)}` in `{typography.button-utility}` (14px / 400 / -0.224px tracking), rounded `{rounded.sm}` (8px), padding 8px × 15px. Active state shrinks via `transform: scale(0.95)`.

**`button-pearl-capsule`** — Product-card secondary button. Background `{var(--muted)}`, text `{var(--secondary-foreground)}` in `{typography.caption}` (14px), 3px solid `{var(--border)}` border (functions as a soft ring rather than a visible line), rounded `{rounded.md}` (11px), padding 8px × 14px.

**`button-store-hero`** — A larger primary CTA used on store hero surfaces. Same Action Blue + primary-foreground as `{component.button-primary}`, but with `{typography.button-large}` (18px / 300 — note the rare weight 300) and slightly more padding (14px × 28px). Used sparingly on the store landing.

**`button-icon-circular`** — Floats over photography. 44 × 44px, background `{var(--secondary)}` at ~64% alpha, icon in `{var(--foreground)}`, rounded `{rounded.full}`. Used for carousel controls, close buttons, and in-image controls.

**`text-link`** — Inline body links in `{var(--primary)}` (Action Blue). Underlined or non-underlined per context.

**`text-link-on-dark`** — Inline body links on dark tiles in `{var(--sidebar-primary)}` dark variant — Action Blue would disappear against `{var(--background-dark)}`.

### Cards & Containers

**`product-tile-light`** — Full-bleed light tile. Background `{var(--card)}` (white), text `{var(--foreground)}`, rounded `{rounded.none}` (tiles touch edges), vertical padding `{spacing.section}` (80px). Centered stack: product name in `{typography.display-lg}` (40px / 600) → one-line tagline in `{typography.lead}` (28px / 400) → two `{component.button-primary}` CTAs → product render with the system shadow.

**`product-tile-parchment`** — Same as `{component.product-tile-light}` but on `{var(--background)}`. Used to break two consecutive white tiles.

**`product-tile-dark`** — Full-bleed dark tile. Background `{var(--background-dark)}`, text `{var(--card-foreground-dark)}`, rounded `{rounded.none}`, vertical padding `{spacing.section}` (80px). Same content stack as the light tile but with `{component.text-link-on-dark}` for inline copy.

**`product-tile-dark-2`** — Variant on `{var(--card-dark)}`. Used where a dark tile sits directly above or below `{component.product-tile-dark}` to create the faintest separation through micro-step lightness change.

**`product-tile-dark-3`** — Variant on `{var(--popover-dark)}`. Used at the bottom of the stack and in embedded video/player frames.

**`store-utility-card`** — Used in store grid and accessories grid. Background `{var(--card)}` (white), 1px solid `{var(--border)}` border, rounded `{rounded.lg}` (18px), padding `{spacing.lg}` (24px). Top: product image. Below: product name in `{typography.body-strong}` (17px / 600), price in `{typography.body}` (17px / 400), and a `{component.text-link}` ("Buy" or "Learn more"). No shadow by default; product render itself carries the system product-shadow.

**`configurator-option-chip`** — Pill-shaped tappable cell. Background `{var(--card)}`, text `{var(--foreground)}` in `{typography.caption}`, rounded `{rounded.pill}`, padding 12px × 16px. Contains a small product thumbnail + label + price delta. Arranged in a grid of 4–5 options per row.

**`configurator-option-chip-selected`** — Selected state. Border upgrades to 2px solid `{var(--ring)}`. Same shape, same content.

**`environment-quote-card`** — A photographic-canvas hero specific to the environment page. Dark photographic backdrop with `{var(--background-dark)}` as the fallback color, centered white-text headline in `{typography.display-lg}` (40px), single `{component.button-primary}` below. Padding `{spacing.section}` (80px).

**`floating-sticky-bar`** — Floats at the bottom of the viewport during scroll. Background `{var(--background)}` at 80% opacity with `backdrop-filter: blur(N)`, height 64px, padding 12px × 32px. Left: running price total in `{typography.body}`. Right: `{component.button-primary}` ("Add to Bag").

### Inputs & Forms

**`search-input`** — Background `{var(--card)}`, text `{var(--foreground)}` in `{typography.body}` (17px), 1px solid `rgba(0, 0, 0, 0.08)` border, rounded `{rounded.pill}` (full pill), padding 12px × 20px, height 44px. Leading icon: search glyph at 14px, `{var(--muted-foreground)}` tint.

Error and validation states were not surfaced in the analyzed pages.

### Footer

**`footer`** — Background `{var(--background)}`, text `{var(--secondary-foreground)}`. Link columns in `{typography.dense-link}` (17px / 400 / 2.41 line-height — the relaxed leading is what makes the dense columns scannable). Column headings in `{typography.caption-strong}` (14px / 600). Legal row at the very bottom in `{typography.fine-print}` (12px / 400) with `{var(--muted-foreground)}` text. Vertical padding 64px.

## Do's and Don'ts

### Do

- Use `{var(--primary)}` (Action Blue oklch(0.5828 0.2188 258.8797)) for every interactive element — links, pill CTAs, focus signals — and nothing else. The single accent is non-negotiable.
- Set headlines in `{typography.hero-display}` or `{typography.display-lg}` with negative letter-spacing (`-0.28 → -0.374px`) to get the signature tight cadence.
- Run body copy at `{typography.body}` (17px / 400 / 1.47 / -0.374px) — not 16px. The extra pixel defines the brand's reading pace.
- Alternate `{component.product-tile-light}` (or parchment) and `{component.product-tile-dark}` for full-bleed section rhythm. The color change IS the divider.
- Reserve `{rounded.pill}` for the primary blue CTA and any other element that should read as an "action" (configurator chips, search input, sticky bar CTA).
- Apply the single product-shadow (`rgba(0, 0, 0, 0.22) 3px 5px 30px`) only to product renders resting on a surface — never on cards, buttons, or text.
- Use `transform: scale(0.95)` as the active/press state on every button — it's the system-wide micro-interaction.
- Keep the global nav `oklch(0 0 0)` (true black) — it's the only place pure black appears on most pages.

### Don't

- Don't introduce a second accent color; every "click me" signal is `{var(--primary)}` (Action Blue).
- Don't add shadows to cards, buttons, or text — shadow is reserved for product imagery.
- Don't use gradients as decorative backgrounds; atmosphere comes from photography.
- Don't set body copy at weight 500 — the ladder is 300 / 400 / 600 / 700, with 500 deliberately absent. Body is always 400; strong inline is 600; display is 600.
- Don't round full-bleed tiles — tiles are rectangular and edge-to-edge; the color change is the divider.
- Don't tighten line-height below 1.47 for body copy — the editorial leading is part of the brand.
- Don't mix radii grammars — use `{rounded.sm}` for compact utility, `{rounded.lg}` for utility cards, `{rounded.pill}` for pills, and nothing in between (except the rare `{rounded.md}` Pearl Button).
- Don't use `{var(--sidebar-primary)}` dark variant on light surfaces — it's the dark-tile-only variant. Action Blue (`{var(--primary)}`) is for light surfaces.

## Responsive Behavior

### Breakpoints

| Name             | Width       | Key Changes                                                                                               |
| ---------------- | ----------- | --------------------------------------------------------------------------------------------------------- |
| Small phone      | ≤ 419px     | Single-column tiles; sub-nav collapses to category name + primary CTA only; hero typography drops to 28px |
| Phone            | 420–640px   | Single-column stack; product renders scale to 80% of tile width; hero h1 drops to 34px                    |
| Large phone      | 641–735px   | Tiles transition to tighter padding (48px vertical vs 80px); fine-print wraps                             |
| Tablet portrait  | 736–833px   | Global nav collapses to hamburger; sub-nav hides category chips, keeps primary CTA                        |
| Tablet landscape | 834–1023px  | Global nav returns fully expanded; 3-column utility grids become 2-column                                 |
| Small desktop    | 1024–1068px | Product tiles use 2/3 width with margin gutters; hero h1 stays at 40px                                    |
| Desktop          | 1069–1440px | Full layout; 4–5 column store grids; 1440px content max                                                   |
| Wide desktop     | ≥ 1441px    | Content locks at 1440px, margins absorb extra width                                                       |

The structural breakpoints that matter for agents: 1440px (content lock), 1068px (small-desktop), 833px (tablet landscape switch), 734px (tablet portrait), 640px (phone), 480px (small phone).

### Touch Targets

- Minimum 44 × 44px. `{component.button-primary}` lands at ~44 × 100px (with the full-pill radius making the visible hit area more generous than the label suggests).
- `{component.button-icon-circular}` is exactly 44 × 44px.
- Global nav utility links are smaller (~32 × 80px) — they deliberately sit at a tighter target because they're precision desktop actions, and the mobile hamburger replaces them at ≤ 833px.

### Collapsing Strategy

- **Global nav**: full horizontal link row on desktop → collapses to logo + hamburger + bag icon at 834px and below.
- **Sub-nav**: category name + inline links + primary CTA → category name + primary CTA only at mobile; inline links move into a hamburger tray.
- **Product tiles**: stack from 2-column to 1-column at 834px; vertical padding tightens from 80px → 48px at small-phone.
- **Utility grids** (store, accessories): 5-col → 4-col (1440px) → 3-col (1068px) → 2-col (834px) → 1-col (640px).
- **Hero typography**: `{typography.hero-display}` (56px) → `{typography.display-lg}` (40px) at 1068px → 34px at 640px → 28px at 419px.

### Image Behavior

- All product imagery uses responsive `srcset` with breakpoint-matched crops.
- Hero photography may switch art direction at mobile.
- Product renders maintain their 1:1 or 4:3 aspect ratios across breakpoints; only scale changes.
- Lazy-loading is default; the above-fold hero loads eagerly.

## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key directly (`{component.product-tile-dark}`, `{component.search-input}`).
2. Variants of an existing component (`-active`, `-focus`, `-2`, `-3`) live as separate entries in `components:`.
3. Use `{var(--token)}` everywhere — never inline OKLCH or hex values.
4. Never document hover. Default and Active/Pressed states only.
5. Display headlines stay DM Sans 600 with negative letter-spacing. Body stays DM Sans 400 at 17px. The boundary is unbreakable.
6. The single drop-shadow (`rgba(0, 0, 0, 0.22) 3px 5px 30px`) is reserved for product photography only.
7. When in doubt about emphasis: alternate surface (`{var(--card)}` → `{var(--background-dark)}`) before adding chrome.

## Known Gaps

- Form validation and error states were not surfaced on the analyzed pages; only the neutral search input is documented.
- The homepage's embedded video/player frame uses `oklch(0 0 0)`; interior player controls are not documented (they're a platform widget, not a web-design token).
- Some component imagery is dynamic (rotating product hero) and its specific copy varies per surface — component specs name the structure, not the rotating content.
- Dark-mode counterparts for store and accessories utility cards were not surfaced on the analyzed pages; the system documented is the daytime/light-dominant variant.
- Atmospheric photography (environment page mountain vista) is a content asset, not a design token; the documented `{component.environment-quote-card}` describes the structural surface only.
- The exact backdrop-filter blur radius on `{component.sub-nav-frosted}` and `{component.floating-sticky-bar}` is platform-dependent; production CSS uses `saturate(180%) blur(20px)` as a typical baseline but the value isn't formalized as a token.
