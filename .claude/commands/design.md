You are acting as a design-system-aware implementer for this project. Your job is to build, review, or critique UI code so that it strictly follows the design specification in `basekit-fe/docs/DESIGN.md`.

Before writing any code, read `basekit-fe/docs/DESIGN.md` and `basekit-fe/src/styles.css` to load the current token values.

## Rules you must follow

### Colors — never use raw hex or oklch values in component code
All color must come from CSS variables. Reference the `colors:` block in DESIGN.md for the complete mapping:

| Concept | CSS variable |
|---|---|
| Primary / Action Blue | `var(--primary)` |
| On-primary text | `var(--primary-foreground)` |
| Focus ring | `var(--ring)` |
| Action Blue on dark surfaces | `var(--sidebar-primary)` |
| White canvas | `var(--card)` |
| Parchment canvas | `var(--background)` |
| Pearl / muted surface | `var(--muted)` |
| Chip / translucent | `var(--secondary)` |
| Dark tile 1 | CSS class `.dark` + `var(--background)` |
| Dark tile 2 | CSS class `.dark` + `var(--card)` |
| Dark tile 3 | CSS class `.dark` + `var(--popover)` |
| Ink / body text | `var(--foreground)` |
| Muted text | `var(--muted-foreground)` |
| Ink muted 80 | `var(--secondary-foreground)` |
| Border / hairline | `var(--border)` |
| Destructive | `var(--destructive)` |
| Chart series 1–5 | `var(--chart-1)` … `var(--chart-5)` |

### Typography — use the scale from DESIGN.md
- Font family: always `var(--font-sans)` (DM Sans). Never hardcode font-family strings.
- Body copy: 17px / weight 400 / line-height 1.47 / letter-spacing -0.374px
- Display headlines: weight 600 with negative letter-spacing (`-0.28px` at 56px, 0 at 40px, `-0.374px` at 34px)
- Weight ladder: 300 / 400 / 600 / 700 only — never 500
- Apply the `--tracking-normal` custom property from styles.css; use the calculated tighter/tight/wide variants for display sizes

### Spacing — use the token scale
`4px · 8px · 12px · 17px · 24px · 32px · 48px · 80px`  
Map these to Tailwind spacing utilities or inline CSS vars. Never use arbitrary pixel values outside this set.

### Border radius — use the DESIGN.md scale
| Name | Value | When |
|---|---|---|
| none | 0 | Full-bleed tiles |
| xs | 5px | Subtle inline chips |
| sm | 8px (= `rounded-md` in Tailwind) | Utility buttons, inline card images |
| md | 11px | Pearl capsule buttons |
| lg | 18px | Utility cards, accessory grid |
| pill | 9999px | Primary CTAs, search, configurator chips |
| full | 9999px / 50% | Circular icon buttons |

Map to Tailwind: `rounded-none`, `rounded`, `rounded-md`, `rounded-xl`, `rounded-full` or `var(--radius)` scale where exact values are needed.

### Elevation — one shadow rule
- **Never** add box-shadow or drop-shadow to cards, buttons, nav, or text elements.
- The **only** permitted shadow is on photographic product imagery: `rgba(0, 0, 0, 0.22) 3px 5px 30px 0`.
- Backdrop-blur is permitted on frosted sticky/sub-nav surfaces: `backdrop-filter: saturate(180%) blur(20px)`.

### Buttons — two grammars only
1. **Pill CTA** (`rounded-full`, `bg-[var(--primary)]`, `text-[var(--primary-foreground)]`, 11px × 22px padding)
2. **Utility rect** (`rounded-md` / 8px, `bg-[var(--foreground)]`, `text-[var(--card-foreground)]` on dark, 8px × 15px padding)

Active state: `transform: scale(0.95)` — not a color change.  
Focus state: `outline: 2px solid var(--ring)`.

### Tile structure — light ↔ dark alternation
- Light tile: `bg-[var(--card)]` or `bg-[var(--background)]`, text `text-[var(--foreground)]`
- Dark tile: `bg-[var(--background)]` inside `.dark`, text `text-[var(--foreground)]` (resolved dark)
- 80px vertical padding inside every tile (`py-20` in Tailwind)
- Zero gap between tiles — the color change is the divider

### No decorative gradients
Never add `background: linear-gradient(…)` or `bg-gradient-*` to surface or text elements.

---

## What to do with $ARGUMENTS

The user's request is: **$ARGUMENTS**

1. Read `basekit-fe/docs/DESIGN.md` and `basekit-fe/src/styles.css` now.
2. Identify which DESIGN.md component(s) the request maps to (e.g. `product-tile-dark`, `button-primary`, `store-utility-card`).
3. Implement or review the code, applying every rule above. Use Tailwind utility classes where possible; fall back to inline CSS vars for values Tailwind can't express.
4. After writing code, do a self-check: scan for any hardcoded hex/oklch color, any shadow on a non-product element, any font-family string, any radius outside the scale, any weight-500 usage. Fix violations before responding.
5. If the request is a review rather than implementation, list each violation as a bullet with: file path, line number, rule broken, and the corrected value.
