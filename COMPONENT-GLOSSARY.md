# Component glossary

Static HTML + CSS + vanilla JS. **Components** are BEM-style classes grouped in `style.css` under `@layer tokens`, `base`, `layout`, and `components`. Behavior lives in `main.js`.

---

## Architecture

| Layer | Role |
| --- | --- |
| **tokens** | Colour, one type scale, space, motion, plus the two metric-matched `@font-face` fallbacks. Light/dark via `:root` and `prefers-color-scheme` only. Local to this site: nothing here is shared with or mirrored to another project. `--ink-3` is the contrast floor and stays at or above 4.5:1 on **both** `--bg` and `--bg-2`, because small type sits on the hover band as well as the page. |
| **base** | Resets, page surface, links, focus ring, skip link, selection. |
| **layout** | `.page`: a single-column grid, `1fr` between a header-less top and the footer, `padding-inline: var(--gut)`, and `container-type: inline-size` so `cqi` measures the column rather than the window. |
| **components** | Hero, index table, contact, footer, reveal. |

**One family.** Archivo, variable, worked across its width axis (62–125). `font-weight` carries weight; `font-variation-settings` carries only `'wdth'`. Do not move weight back into `font-variation-settings`: the browser's own font matching reads `font-weight`, so an axis set only through variation-settings leaves the *fallback* face at 400 wherever the page renders 600.

---

## Hero

| Class | Purpose |
| --- | --- |
| `.hero__name` | Semantic `h1`. Carries a `.vh` "Peter Franko" beside the decorative signature, so the name survives if the SVG does not render. |
| `.hero__sig` | The signature, inline SVG traced from the brush original. Inline rather than `<img>` because `currentColor` only resolves inside the document; that is what makes one file serve both schemes. Sized `clamp(11rem, 27cqi, 22rem)` — signature scale. Blown past that it reads as a scribble. |
| `.hero__role` | "Product Designer, NYC", set tight under the signature as its caption rather than as page furniture. |
| `.hero__stmt` | The statement, and the page's typographic hero. |
| `.hero__l` | One authored line of the statement. **Block above 30rem, inline below.** |
| `.hero__stmt em` | The three claims. Accent underline **at rest** so touch and keyboard see them marked; hover draws a heavier stroke beneath and deepens the ink. |

**Show the signature raw.** The trace is already real brush texture. A synthetic ink-bleed filter (`feTurbulence` + `feDisplacementMap`) was tried and reverted: at working size it adds high-frequency fuzz and the mark reads as a bad fax.

---

## Index (background)

| Class | Purpose |
| --- | --- |
| `.sec` | Section mark: `BACKGROUND`, `CONTACT`. An `h2` with a rule under it. |
| `.entry` | One row of the table: `year | title | scope`. Stacks below 58rem, then fully below 40rem. |
| `.entry__yr` | The span, tabular lining figures, with a rule between the two years. |
| `.entry::before` | The hover band. Bleeds a gutter past the column so a live row reads as a band across the sheet rather than a boxed rectangle. |

**Both dividers touching a live row fade with the band**, on the same curve: the row's own `border-bottom`, and the one belonging to the row above via `.entry:has(+ .entry:hover)`. For the first row that neighbour is the section rule, so `.sec` fades too — otherwise the band sits pinned under a line it did not erase.

**Touch has no hover**, so the row nearest the middle of the screen is the live one, driven by `animation-timeline: view()` through the registered `--live`.

---

## Contact and footer

| Class | Purpose |
| --- | --- |
| `.contact__mail` | Primary action. Serif-free, large, with an arrow that moves on hover. |
| `.contact__arr` | Decorative, `aria-hidden`. |
| `.contact__alt` | LinkedIn, small uppercase. |
| `.foot` | Top rule, copyright. |

Both contact links keep a typographic box and expand only the hit area, via a 44px-tall `::after`. **They are the only two links on the page; do not let that expander get dropped again.**

---

## Motion and accessibility

| Name | Purpose |
| --- | --- |
| `.skip` | Off-screen until focused; jumps to `#main`, which carries `tabindex="-1"` so focus actually lands there in Safari. |
| `.vh` | Text for assistive tech only. |
| `.reveal` / `.in` | Index rows only. Uses `translate`, **not** `transform` — as `transform` it outranks `.entry`'s own transform and silently kills the row's hover response. |
| `prefers-reduced-motion` | Disables the signature write-on and every transition; reveals content immediately. |
| `scripting: none` | Reveals content immediately when JS never runs. A `<noscript>` style block in `index.html` does the same for Safari before 17. |

**Load-bearing:** the whole background list sits inside `.reveal`, so removing both no-JS fallbacks leaves a visitor with four empty rows. Test that path before touching either.

**`@property` registrations sit at the very top of the file.** `--w` (the signature write-on mask) and `--live` (the row state). An unregistered custom property cannot interpolate — the keyframe flips discretely at 50% and the "stroke" becomes a hard cut.

---

## Two traps worth keeping written down

**Never measure in `ch`.** It is font-relative, so a fallback face silently re-wraps the text — it changed the hero statement's line count on every cold load, and it made the width unmeasurable, because what moved was the wrap point rather than the text. The statement's two lines are authored; `.entry__d` is capped in `rem`.

**Optical edge.** Every block is flush to the same box; ink is not. The signature trace starts at its box edge, while type carries a left side bearing that grows with size — the statement sat 5.35px inside it. Each role takes an em-based `text-indent` (a `margin-left` on `.entry__yr`, which is a flex container and so does not take `text-indent`). Measured spread: 0.01px. Re-measure against `path.getBBox()`, not the viewBox, if the type scale changes.

---

## File map

| File | Contents |
| --- | --- |
| `index.html` | Markup: skip link, head metadata, hero, index, contact, footer. |
| `style.css` | Layers, tokens, fallback faces, and all classes above. |
| signature | Inline in `index.html`, not a file. Regenerate from `/Users/peter/Developer/Assets/peterfranko-script-light.png` with `/Users/peter/Developer/Scripts/trace-wordmark.py`. |
| `main.js` | The reveal observer. Nine lines. Theme colour is two `<meta>` tags with `media`, no JS. |
| `favicon.png` | Colour PF icon. |
| `favicon.ico` | Colour PF fallback (16/32/48/64) for clients that request `/favicon.ico` and ignore the `<link>` tags. |
| `apple-touch-icon.png` | 180px iOS web clip. Opaque backing: iOS ignores media queries and renders transparency black. |
| `og-image.png` | Social card for `og:image` / `twitter:image`, 1200×630, absolute URL. It must stay a PNG: no major scraper renders SVG. Regenerate with `/Users/peter/Developer/Scripts/make-og-card.py`. |

**Favicon source:** all favicon outputs are generated from `/Users/peter/Developer/Assets/pf-color.png` by `/Users/peter/Developer/Scripts/make-portfolio-favicons.py`. Regenerate the full set together so the PNG, fallback ICO, and Apple touch icon stay visually aligned.

---

## The fallback faces

Two, not one. Helvetica ships Regular and Bold, so a single `size-adjust` cannot serve the page: the fallback renders Regular against Archivo 400 and Bold against Archivo 600, and those need different corrections. Both values were solved by measuring the **rendered boxes** — canvas snaps a variable font to the nearest static weight and lies about anything in between, and a probe `@font-face` behaves differently from the real one.

`local()` resolves to a *named* face: `local('Helvetica Neue')` is Regular whatever `font-weight` range the `@font-face` claims, and declaring that range suppresses the substitution that would otherwise have happened. The bold face has to ask for Bold by name.

Perfect matching across every string is not reachable — the two typefaces differ per character. What these are for is keeping **line counts** stable on swap, and that is exact.
