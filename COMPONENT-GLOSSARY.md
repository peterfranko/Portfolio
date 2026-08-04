# Component glossary

This site is a static HTML + CSS + vanilla JS portfolio. **Components** are BEM-style CSS classes grouped in `style.css` under `@layer tokens`, `base`, `layout`, and `components`. Behavior lives in `main.js`.

---

## Architecture

| Layer | Role |
| --- | --- |
| **tokens** | Design tokens: color, typography, space, layout measure, grid templates, motion, z-index. Light/dark via `:root`, `html[data-theme]`, and `prefers-color-scheme`. |
| **base** | Resets, `body` surface, links, focus rings, **skip link**, base styles for **contact line** focus. |
| **layout** | Page shell: three-column grid with optional **subgrid** on `main` so children can span full width or the center “prose” column. |
| **components** | UI blocks, hero motif, timeline, contact, footer, reveal animation, and (prepared) project list styles. |

---

## Layout primitives

| Class | Purpose |
| --- | --- |
| `.layout-page` | Root shell: min-height viewport, three-track grid (gutter \| measure \| gutter). |
| `.layout-main` | Full-width grid row; when subgrid is supported, becomes a subgrid so descendants align to the same columns. |
| `.layout-full` | Spans all columns (e.g. full-bleed hero motif). |
| `.layout-prose` | Center column (~`--layout-measure`), aligned with footer. Hero and sections use this. |
| `.footer` | Sits in the center track; copyright and meta chrome. |

**Fallback:** Without subgrid, `layout-page` falls back to a max-width block; `layout-full` uses negative margin breakout for full-bleed.

---

## Accessibility & motion

| Name | Purpose |
| --- | --- |
| `.skip-link` | Off-screen until focused; jumps to `#main`. |
| `.reveal` | Starts hidden (opacity + translate); gains `.visible` when scrolled into view. Stagger via inline `--d` (index × `--reveal-stagger`). |
| `prefers-reduced-motion` | Disables hero animations and reveal transitions; reveals content immediately. |

**JS:** `IntersectionObserver` adds `.visible` once per element; if unsupported, all `.reveal` elements get `.visible` immediately.

---

## Hero motif (aurora)

Decorative full-width block above the hero copy. **Not** for essential information (`aria-hidden="true"` on the container).

| Class | Role |
| --- | --- |
| `.hero-aurora` | Container: height clamp, bottom fade mask, entry animation. Uses `--parallax-y` (set by JS) for scroll parallax. |
| `.hero-aurora__backing` | Parallax layer for wash + mesh + grain (moves with scroll). |
| `.hero-aurora__wash` | Soft radial gradients (theme-aware). |
| `.hero-aurora__mesh` | Dot grid overlay with drift animation. |
| `.hero-aurora__grain` | SVG noise texture for grain. |
| `.hero-aurora__schema` | SVG layer: schematic lines; parallax opposite to backing. |
| `.hero-aurora__drift` | Slow drift animation on the SVG group. |
| `.hero-aurora__ln` | Base stroke for SVG paths/lines. Modifiers: `--hairline`, `--fine`, `--medium`, `--ghost`; line styles `--solid`, `--dash`, `--dot`. |
| `.hero-aurora__node` | Small circles on the schema. Modifier: `--soft`. |

**JS:** `initHeroScrollParallax()` updates `--parallax-y` on scroll/resize unless `prefers-reduced-motion: reduce`.

---

## Hero copy

| Class | Purpose |
| --- | --- |
| `.hero` | Hero region spacing (top padding, section gap). Used on `<header>`. |
| `.eyebrow` | Mono, uppercase, muted — role / location line. |
| `.hero-name` | Display-sized name. |
| `.hero-lede` | Intro paragraph; `strong` bumps weight and primary text color. |

---

## Section shell

| Class | Purpose |
| --- | --- |
| `.block` | Vertical section spacing. |
| `.block--contact` | Contact section: top border, column gap, padding. |
| `.label` | Mono uppercase section title (`h2` resets). |
| `.label--dim` | Muted label variant (defined for flexibility). |

---

## Timeline (background)

| Class | Purpose |
| --- | --- |
| `.timeline` | Vertical stack with left border and padding. |
| `.tl-row` | Grid row: year column + details (`dt` / `dd`). Marker dot on the border via `dt::before`. |
| `.tl-title` | Primary line (serif). |
| `.tl-sub` | Secondary line (smaller, secondary color). |

Responsive: timeline columns switch to a narrower grid template below 640px.

---

## Contact

| Class | Purpose |
| --- | --- |
| `.contact-line` | Large italic mailto link with underline styling and hover/focus transitions. |
| `.contact-secondary` | Small mono secondary contact link, currently used for LinkedIn. |

---

## Footer

| Class | Purpose |
| --- | --- |
| `.footer` | Top border, mono uppercase muted text; flex for future left/right split. |

---

## Projects (prepared styles)

These classes are fully styled in CSS for a future or alternate **project list**; they are not used in the current `index.html`.

| Class | Purpose |
| --- | --- |
| `.projects` | Column list container. |
| `.project` | Row wrapper; bottom border between items. |
| `.project-row` | Grid: index, title, meta; hover moves title and shows arrow. |
| `.project-row--soon` | Disables hover motion when not yet a real link. |
| `.project-meta` | Right-aligned org + period (and similar). |
| `.project-index` | Mono index. |
| `.project-title` | Serif project name. |
| `.project-org` | Pill-style org tag. |
| `.project-period` | Mono date range. |
| `.project-soon` | “Coming soon” style label. |
| `.project-arrow` | Decorative arrow on hover/focus. |

---

## JavaScript (`main.js`)

| Behavior | Description |
| --- | --- |
| **Theme color** | Syncs `meta[name="theme-color"]` to the current system color scheme. There is no visible theme toggle in the current markup. |
| **Hero parallax** | Sets `--parallax-y` on `.hero-aurora` from scroll position (skipped when reduced motion is preferred). |
| **Reveal** | IntersectionObserver adds `.visible` to `.reveal` elements. |

---

## File map

| File | Contents |
| --- | --- |
| `index.html` | Markup: skip link, layout, aurora SVG, hero, background timeline, contact, footer. |
| `style.css` | Layers, tokens, and all classes above. |
| `main.js` | Theme, parallax, reveal. |
| `favicon-light.png` | PF mark, black on transparent. Served to `prefers-color-scheme: light`. |
| `favicon-dark.png` | PF mark, white on transparent. Served to `prefers-color-scheme: dark`. |
| `favicon.ico` | Light-mark fallback (16/32/48/64) for clients that request `/favicon.ico` and ignore the `<link>` tags. |
| `apple-touch-icon.png` | 180px iOS web clip. Opaque `--color-surface-base` backing: iOS ignores media queries and renders transparency black. |
| `og-image.svg` | Social card for `og:image` / `twitter:image`. |

**Favicon source:** both marks are generated from `/Users/peter/Developer/Assets/pf-light-mode.png` and `pf-dark-mode.png`. The generator trims the source's dead space to the ink bounds and re-centers at 84% fill, so the mark stays legible at 16px. Regenerate both together; they share geometry.
