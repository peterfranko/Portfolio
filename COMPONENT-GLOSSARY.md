# Component glossary

This site is a static HTML + CSS + vanilla JS portfolio. **Components** are BEM-style CSS classes grouped in `style.css` under `@layer tokens`, `base`, `layout`, and `components`. Behavior lives in `main.js`.

---

## Architecture

| Layer | Role |
| --- | --- |
| **tokens** | Design tokens: color, typography, space, layout measure, grid templates, motion, z-index. Light/dark via `:root` and `prefers-color-scheme` only. Local to this site: nothing here is shared with or mirrored to another project. `--color-text-muted` is the contrast floor and stays at or above 4.5:1 on `--color-surface-base` in both schemes. |
| **base** | Resets, `body` surface, links, focus rings, **skip link**, base styles for **contact line** focus. |
| **layout** | Page shell: three-column grid with optional **subgrid** on `main` so children can span full width or the center “prose” column. |
| **components** | UI blocks, hero motif, timeline, contact, footer, reveal animation. |

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
| `.skip-link` | Off-screen until focused; jumps to `#main`, which carries `tabindex="-1"` so focus actually lands there in Safari. |
| `.visually-hidden` | Text for assistive tech only. Carries the real "Peter Franko" beside the decorative wordmark, so the name survives even if the SVG does not render. |
| `.reveal` | Starts hidden (opacity + translate); gains `.visible` when scrolled into view. Stagger via inline `--d` (index × `--reveal-stagger`). |
| `prefers-reduced-motion` | Disables hero animations, reveal transitions and smooth scrolling; reveals content immediately. |
| `scripting: none` | Reveals content immediately when JavaScript never runs. A `<noscript>` style block in `index.html` does the same for Safari before 17. |

**JS:** `IntersectionObserver` adds `.visible` once per element; if unsupported, all `.reveal` elements get `.visible` immediately.

**Load-bearing:** every word on the page sits inside a `.reveal`, so removing both no-JS fallbacks leaves a visitor with an empty gradient. Test that path before touching either.

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
| `.eyebrow` | Uppercase, tracked, muted: the role and location line. |
| `.hero-name` | Semantic `h1`: a `.visually-hidden` name followed by the decorative wordmark. |
| `.hero-name__script` | The signature, an inline SVG traced from the original brush raster. Inline rather than `<img>` because `currentColor` only resolves inside the document; that is what makes one file serve both schemes. |
| `.hero-lede` | Intro paragraph; `strong` bumps weight and primary text color. |
| `.hero-lede__accent` | Inline hover accent used for key lede phrases; color variants set orange, jade, and blurple glows. |

---

## Section shell

| Class | Purpose |
| --- | --- |
| `.block` | Vertical section spacing. |
| `.block--contact` | Contact section: centered stack with column gap and top padding. |

Both `<section>` elements carry an `aria-label`, otherwise they expose as unnamed regions.

---

## Timeline (background)

| Class | Purpose |
| --- | --- |
| `.timeline` | Vertical stack with left border and padding. |
| `.tl-row` | Grid row: date range column + details (`dt` / `dd`). Marker dot on the border via `dt::before`; row dividers span the full viewport via `::after`. |
| `.tl-title` | Primary line. |
| `.tl-sub` | Secondary line (smaller, secondary color). |

Rows run newest first. Each `<dt>` is one string with an en dash, not two spans: a faded second half measured 1.96:1 and read to a screen reader as two fragments.

Responsive: a narrower date column below 640px, and a single stacked column below 22rem where two columns starve the title.

---

## Contact

| Class | Purpose |
| --- | --- |
| `.contact-line` | Restrained mailto link with underline styling and hover/focus transitions. |
| `.contact-secondary` | Small uppercase secondary contact link, currently used for LinkedIn. |

Both links keep a typographic box and expand only the hit area, via a 44px-tall `::after`. There is one type family on this site, Instrument Sans; the old `--font-mono` token aliased it and has been removed.

---

## Footer

| Class | Purpose |
| --- | --- |
| `.footer` | Top border, uppercase muted text; flex for future left/right split. |

---

## JavaScript (`main.js`)

| Behavior | Description |
| --- | --- |
| **Hero parallax** | Sets `--parallax-y` on `.hero-aurora` from scroll position (skipped when reduced motion is preferred). |
| **Reveal** | IntersectionObserver adds `.visible` to `.reveal` elements. |

---

## File map

| File | Contents |
| --- | --- |
| `index.html` | Markup: skip link, layout, aurora SVG, hero, background timeline, contact, footer. |
| `style.css` | Layers, tokens, and all classes above. |
| wordmark | Inline in `index.html`, not a file. Regenerate from `/Users/peter/Developer/Assets/peterfranko-script-light.png` with `/Users/peter/Developer/Scripts/trace-wordmark.py`. |
| `main.js` | Parallax and reveal. Theme color is now two `<meta>` tags with `media`, no JS. |
| `favicon.png` | Color PF icon. One file: the former light and dark pair were byte-identical, so the media split bought nothing. |
| `favicon.ico` | Color PF fallback (16/32/48/64) for clients that request `/favicon.ico` and ignore the `<link>` tags. |
| `apple-touch-icon.png` | 180px iOS web clip generated from the color PF icon. Opaque `--color-surface-base` backing: iOS ignores media queries and renders transparency black. |
| `og-image.png` | Social card for `og:image` / `twitter:image`, 1200×630, absolute URL. It must stay a PNG: no major scraper renders SVG, and the SVG it replaced also carried a raw `0xB7` byte that is invalid UTF-8. Regenerate with `/Users/peter/Developer/Scripts/make-og-card.py`. |

**Favicon source:** all favicon outputs are generated from `/Users/peter/Developer/Assets/pf-color.png` by `/Users/peter/Developer/Scripts/make-portfolio-favicons.py`. Regenerate the full set together so the PNG, fallback ICO, and Apple touch icon stay visually aligned; the script still emits a light/dark pair, and only one of them is kept.
