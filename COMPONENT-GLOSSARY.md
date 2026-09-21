# Component glossary

Static HTML + CSS + vanilla JS. **Components** are BEM-style classes grouped in `style.css` under `@layer tokens`, `base`, `layout`, and `components`. Behavior lives in `main.js`.

---

## Architecture

| Layer | Role |
| --- | --- |
| **tokens** | Colour, one type scale, space, motion, plus the two metric-matched `@font-face` fallbacks. Light/dark via `:root` and `prefers-color-scheme` only. Local to this site: nothing here is shared with or mirrored to another project. `--ink-3` is the contrast floor and stays at or above 4.5:1 on **both** `--bg` and `--bg-2`, because small type sits on the hover band as well as the page. |

**`--accent-deep` means "further from the page than the accent", not "darker".** It is the colour a hovered word or the hovered email takes; the stroke and the underline stay `--accent`. The two schemes reach it by opposite mixes, and that is the point: on `--bg` the word goes **down** (accent 58% + black, `#6b1b08`, 9.98:1), on the dark ground it goes **up** (accent 88% + white, `#ff7c54`, 7.54:1). Mixing black into it on the dark ground was measured and rejected — 82% gave 4.67:1 and the next step down gave 3.75:1, under the floor above, and on screen the hovered word receded into the page instead of coming forward. Deepened on both sides 2026-09-21; light was 76% + black at 7.45:1, dark was 82% + black.

Because the dark value is lighter than `--accent`, a hovered word there sits one step lighter than the stroke drawing underneath it. That is intended, not drift.
| **base** | Resets, page surface, links, focus ring, skip link, selection. |
| **layout** | `.page`: a single-column grid, `1fr` between a header-less top and the footer, `padding-inline: var(--gut)`, and `container-type: inline-size` so `cqi` measures the column rather than the window. |
| **components** | Hero, index table, contact, footer, reveal. |

**Two alignments, on purpose.** The hero, the contact links and the footer are **centred**; the section marks (`.sec`) and every index cell stay **flush left**. That split is the layout, not drift — see *Optical edge* and *Centred axis* below, which are different corrections for the two halves.

**One family.** Archivo, variable, worked across its width axis (62–125). `font-weight` carries weight; `font-variation-settings` carries only `'wdth'`. Do not move weight back into `font-variation-settings`: the browser's own font matching reads `font-weight`, so an axis set only through variation-settings leaves the *fallback* face at 400 wherever the page renders 600.

---

## Hero

| Class | Purpose |
| --- | --- |
| `.hero__name` | Semantic `h1`. Carries a `.vh` "Peter Franko" beside the decorative signature, so the name survives if the SVG does not render. |
| `.hero__sig` | The signature, inline SVG traced from the brush original. Centred by `margin-inline: auto` on its own box, which is also its ink: the trace fills the viewBox (`getBBox` x 0.82, width 3346.67 of 3348), so box centre and ink centre agree to 0.01px. Inline rather than `<img>` because `currentColor` only resolves inside the document; that is what makes one file serve both schemes. Sized `clamp(11rem, 27cqi, 22rem)` — signature scale. Blown past that it reads as a scribble. |
| `.hero__role` | "Product Designer, NYC", set tight under the signature as its caption rather than as page furniture. |
| `.hero__stmt` | The statement, and the page's typographic hero. |
| `.hero__l` | One authored line of the statement. **Block above 30rem, inline below.** |
| `.hero__hang` | The line's terminal comma or period. Zero-width above 30rem so the mark hangs off the centred axis; a plain inline below it. |
| `.hero__stmt em` | The three claims. Accent underline **at rest** so touch and keyboard see them marked; on hover the word swells on Archivo's own axes and takes `--accent-deep`. See *The statement hover* below — it is the one thing on the page that moves layout. |

**The statement hover: the word swells, the sentence breathes.** (Replaced a left-to-right stroke wipe, 2026-09-21.) On hover the claim goes `font-weight` 620 → 780 and `wdth` 100 → 118 and takes `--accent-deep`, on the signature's own easing curve. Nothing is drawn that was not already type: no bar, no band, no second object. The rest-state hairline stays and widens with the word it belongs to.

Weight goes in `font-weight` and width in `font-variation-settings`, per *One family* above. That is not just house style here — it is what makes the cold-load case safe.

**It moves layout, and that is the design.** The sentence is centred, so half the growth goes each way: words left of the hovered claim slide left, words right slide right, and the line stays on its axis. Measured at 1280px / 80px type, the claim grows 24.6–31% and its neighbours shift 42–47px.

Three guards, and the third is the one that matters:

- **Only above 30rem.** Below it the two authored lines go inline and become one wrapping sentence, where a swelling word could move the **wrap point** and reflow the whole statement. Same breakpoint the hanging punctuation uses. Below it the claims answer in colour only.
- **Only on a real pointer.** `hover: hover` already gated this; it matters more now, because a tap that resized the sentence would be a bug.
- **The line has the headroom — measured, not assumed.** Swelling the widest claim on line 2 takes it to 83.3% of the column at 500px (the tightest point of the block regime), 83.2% at 700px, 74.4% at 1280px, 58.6% at 1600px. Worst case leaves a sixth of the column spare, so it can never re-wrap or cross the gutter. **Re-measure if the copy grows: the guard is the measurement, not the breakpoint.**

**Reduced motion drops the swell, not just the transition.** The blanket `transition: none !important` would have left it as a *snap* — the sentence jumping to a new width on pointer-enter and back on leave, which is precisely what that setting asks us not to do. So the axes are pinned to their rest values there and the claim answers in colour alone. It works by source order: same selector, same specificity, same layer, later in the file.

**A cold load degrades to colour only, for free.** 620 and 780 both fall inside the fallback's `501 900` face, so there is no face flip, and Helvetica has no width axis. Measured with the fallback forced: the swell is **0.00px**. The sentence cannot reflow while the webfont is still in flight.

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
| `.contact__mail` | Primary action. Serif-free, large, with an arrow that moves on hover. Centred as a box **and** as an address: an empty `::before` matching the arrow's width balances the row, so the email itself lands on the axis and the arrow hangs off it. |
| `.contact__arr` | Decorative, `aria-hidden`. |
| `.contact__alt` | LinkedIn, small uppercase. |
| `.foot` | Top rule, copyright. |

Both contact links keep a typographic box and expand only the hit area, via a 44px-tall `::after`. **They are the only two links on the page; do not let that expander get dropped again.** The `::before` spacer is a flex item; the `::after` hit area is absolutely positioned and so is not one — they do not collide.

**The email's balancing spacer is dropped below 22rem.** What breaks first on a narrow phone is not the address wrapping: the flex box wraps and the **arrow** drops to its own line underneath. Measured against Archivo, the worst case here (the Helvetica fallback renders this string 2.6px *narrower*), the balanced box is 283.3px, the arrow falls off the line at a 320px viewport and holds at 328px. 22rem keeps a 24px cushion, and costs only 320–351px the 12px of offset.

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

## Traps and corrections worth keeping written down

**Never measure in `ch`.** It is font-relative, so a fallback face silently re-wraps the text — it changed the hero statement's line count on every cold load, and it made the width unmeasurable, because what moved was the wrap point rather than the text. The statement's two lines are authored; `.entry__d` is capped in `rem`.

**Optical edge (the flush-left column).** The section marks and the index cells are flush to the same box; ink is not. Type carries a left side bearing that grows with size — the statement sat 5.35px inside the signature's ink edge. `.sec`, `.entry__t` and `.entry__d` take an em-based `text-indent`; `.entry__yr` takes the same correction as a `margin-left`, because it is a flex container and `text-indent` does not reach flex items. Re-measure against `path.getBBox()`, not the viewBox, if the type scale changes.

**Centred axis (the hero, contact and footer).** Those roles are centred, so they have no flush edge to correct to and carry no side-bearing indent. They have the *other* problem: a centred line is centred on its **box**, and the box holds one letter-space more than the word does, because the tracking is added after the final character and measured in. Verified on the page, not assumed — the `LINKEDIN` box is exactly 8 tracking steps wider than the untracked string, not 7 — so each tracked line hung 0.96px left of the axis the signature sits on. `.hero__role`, `.contact__alt` and `.foot__c` take `text-indent: var(--track-k)`, which moves a centred line by half its own value and, on a shrink-to-fit box, squares LinkedIn's rule around the word as a bonus. Measured spread after: 0.01px.

The two negatively tracked roles, `.hero__stmt` (-0.02em) and `.contact__mail-t` (-0.022em), lean the other way by 0.63px and 0.53px and are deliberately left alone: the correction is a *negative* indent on a shrink-to-fit box, where the intrinsic-width contribution is not interoperable.

**Terminal punctuation hangs.** Both statement lines end in a mark carrying 0.257em of advance — 20.56px at the desktop step — and a centred line counts that advance, so the letterforms sat 10.28px left of the axis. Each mark is wrapped in `.hero__hang`, which takes `display: inline-block; width: 0`: **the mark keeps its glyph and gives up its box.** Exact for any mark at any step of a scale that runs 24px to 80px, where a measured negative margin would be wrong the moment the copy or the scale moved. Measured after: both letterform runs centre to 0.00px, leading is byte-identical (139.68px with and without), no overflow.

`hanging-punctuation: allow-end` was not used — it is Safari-only, so it would have centred the sentence differently in different browsers.

**The hang is off at 30rem and below**, where `.hero__l` goes inline and the two authored lines run together as one wrapping sentence. The marks stop being line-terminal there, and a zero-width one mid-sentence would sit on top of the word after it. Same breakpoint as the `display: inline` switch, no gap and no overlap between the two queries.

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
