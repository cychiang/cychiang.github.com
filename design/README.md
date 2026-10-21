# Design system: terminal

The one visual language for everything in this repository: the homepage, every
slide deck, every diagram, and whatever gets added later. This file is the
rule book; `tokens.ts` is the single source of the values; `slidev-theme/` and
`templates/` are the system applied. `AGENTS.md` points here and must stay in
agreement with it.

## The idea

The site is a terminal session. The reader opens a prompt, lists the decks,
opens one. Everything is set in one monospace typeface on a quiet slate
background, in light or dark. Colour is used the way a terminal uses it: a
prompt is green, something you can open is blue (a directory in `ls`), a
warning is yellow, an error is red. Nothing is coloured for decoration.

Structure comes from the vocabulary of terminal multiplexers: content sits in
**panes** with a hairline border, a title bar and sometimes a status line.
Commands introduce sections. A block cursor marks where the next thing goes.

What it is not: a retro CRT, green-on-black phosphor, scanlines, glitch
effects, ASCII art banners. It is a modern terminal with a good font.

The typeface is JetBrains Mono. It was chosen over IBM Plex Mono, Commit
Mono and Iosevka after rendering the site and the specimen deck in each: its
tall x-height keeps small text (status lines, pane bars, projected slides)
readable, and its width matches the layouts, so nothing had to be re-set.
Ligatures are disabled everywhere so code reads character by character.

## Principles

1. **One typeface, two weights.** JetBrains Mono, regular and strong. Italic
   is for titles of things. There is no second family, ever.
2. **Colour is meaning.** Each colour has one job (see Tokens). If a colour
   does not say prompt, open, warn, fail or data, it is not used.
3. **Structure is a pane.** Borders, title bars and status lines encode what
   something is (a deck, a code block, a system boundary). They are never
   added for decoration.
4. **Terminal vernacular, no cosplay.** Prompts, paths, flags, `ls` output.
   Commands shown must be plausible; nothing is a joke the reader has to get.
5. **Still, until something happens.** The only animation is a cursor blink.
   Motion that answers an action (filtering, opening) is fine.
6. **Both modes are first-class.** Every surface is checked in light and dark.
   Contrast minimums are enforced by `pnpm design:check`.

## Tokens

All values live in `tokens.ts`. `pnpm design:build` writes them to:

| File | Used by |
| --- | --- |
| `generated/tokens.site.css` | the homepage (follows the OS light/dark setting) |
| `generated/tokens.slidev.css` | the slide theme (follows Slidev's own toggle) |
| `public/favicon.svg` | the browser tab, copied into every built deck |

`mermaid.ts` and `slidev-theme/setup/shiki.ts` import `tokens.ts` directly.

### Colour

| Token | Light | Dark | Meaning |
| --- | --- | --- | --- |
| `--color-bg` | `#f3f4f6` | `#161a22` | page and slide background |
| `--color-surface` | `#fbfbfc` | `#1d222c` | panes, code blocks, diagram nodes |
| `--color-ink` | `#1c2028` | `#dfe3ea` | text |
| `--color-ink-soft` | `#5d6673` | `#8b94a3` | comments, status lines, edge labels, secondary text |
| `--color-line` | `#cdd2da` | `#323a48` | borders, rules, diagram edges |
| `--color-accent` | `#2452c9` | `#7aa7ff` | links, focus, the thing a slide is about |
| `--color-on-accent` | `#ffffff` | `#0f131a` | text on an accent fill |
| `--color-prompt` | `#1f7a3a` | `#8fd694` | the prompt, the cursor, healthy states |
| `--color-flag` | `#8a6100` | `#e6c36a` | warnings, drafts, pending states |
| `--color-danger` | `#b3261e` | `#ff8e84` | errors, failure paths |

The table is documentation; `tokens.ts` is the truth. If they disagree, fix
the table.

### Type and shape

| Token | Value | Use |
| --- | --- | --- |
| `--font-mono` | JetBrains Mono (variable), system monospace fallbacks | everything |
| `--weight-regular` / `--weight-strong` | 400 / 600 | body / headings and emphasis |
| `--text-xs` / `--text-sm` / `--text-base` | 12 / 13 / 15→16 px | pane bars and status lines / comments and output / body (15px on a phone, 16px from a tablet up) |
| `--radius` | 4px | every corner |
| `--border` | 1px | every border and diagram line |

Slides use their own scale, defined in `slidev-theme/styles/base.css`
(`--slide-text` 1.2rem, `--slide-h1` 2.1rem, `--slide-display` 3.4rem). The
slide canvas is 980 × 552; body text fits about 70 characters per line.

Spacing is on the character grid: horizontal distances in `ch`, vertical
distances in multiples of the line height.

## Patterns

**Prompt line.** `user@host:path$ command`. On the homepage it opens a
section (`Prompt.astro`); on slides it shows a command that was run
(`<Prompt>`), and the cover's first line is `open <deck>`. Host and path are coloured, the command is plain ink.

The parts come from three layers, most specific first: a slide's
frontmatter (`prompt: { user, host, path, command }`, `prompt: "command"`
or `prompt: false`), the deck's headmatter (`themeConfig.prompt`), then
`prompt` in `tokens.ts`. The homepage always uses the tokens. Use the
override when the deck is given somewhere specific (`host: kubecon`) or
when a slide shows a command on another machine (`user: root`,
`host: node-1`); keep the default otherwise, so the site reads as one
session.

**Pane.** A surface with a hairline border, `--radius` corners, an optional
title bar (path or name, soft, `--text-xs`) and an optional status line. A
deck on the homepage is a pane; a code block is a pane; `<Pane>` on a slide
is a pane; a diagram node is a small pane. Inline code is not: a tint of
`--color-surface` with a faint inset edge, so a paragraph that names five
things does not turn into five boxes.

**Status line.** Full-width, soft text, hairline rule above: on every slide
(title left, `n/total` right) and at the bottom of a deck card (date left,
length right).

**Cursor.** A block in `--color-prompt` after a title that invites the next
step: the deck you are about to open, the empty slot on the wall, the cover
title. On the homepage it blinks; on slides it is still.

**Lists, quotes, tables.** Lists are plain text with `-` or `1.` markers.
Quotes are a left rule and soft text. Tables look like `column -t` output:
header row soft with a rule beneath, hairlines between rows, no fills.

**Links.** Accent colour, no underline until hovered.

## The homepage

`src/` is the system applied to one page. `global.css` imports the fonts and
the generated tokens and adds only layout values (`--page-width`,
`--wall-gap`). Components use tokens and nothing else. The rules in
`AGENTS.md`, "Site style", cover what each component may do.

## Posts

A post is the homepage's typography applied to a column of Markdown
(`src/pages/posts/[slug].astro`, styles under `.prose` in
`src/styles/global.css`). It opens with the prompt line
`cat posts/<slug>.md`, then the title, a soft meta line (date, `#tags`),
the body at 76 characters per line, and closes with `cd ~` and a link
home. Headings are strong with a rule under `h2`; lists, quotes, tables and
code blocks look exactly as they do on slides; code is coloured by the same
Shiki themes (`design/shiki.ts`); fenced `mermaid` blocks render in the
browser with `design/mermaid.ts`. On the homepage, posts are a listing
under `ls posts/`: one line per post, date and title, a long title ending in
an ellipsis.

On a screen at least 60rem wide and 34rem tall the homepage fits without
scrolling: the headline, then posts and decks side by side, each with a
pager (`prev --page 1/3 next`, styled like the `--type` filter) that shows
as many items as fit. Smaller screens stack the two lists and scroll.

## The about page

`/about/` is a post-width column of sections, one per file in `about/`.
Each section opens with `cat about/<tab>.md`, then its title at post-title
size and a Markdown body under `.prose` (section headings are `h3`). With
JavaScript the sections become tabs under a `--tab` row styled like the
`--type` filter, the selected tab in `--color-accent`; without it they
follow each other. The header links to it as `About`, before the profiles.

## Screens of every size

The homepage and posts are responsive without a separate mobile design:
sizes are fluid (`clamp()` for headings and padding, `ch` for horizontal
spacing), the deck wall is a grid that fills as many 19rem columns as fit,
and the post column is centred at 76 characters wide on a large screen and
full width on a phone. Body text is 15px on a phone and 16px from a tablet
up (`--text-base` is a `clamp()`), and the column is set in `ch`, so it
grows with the type. Below 36rem the prompt loses its `user@host` part (the
`$` alone still reads as a prompt); the wall shows its second empty slot
only when three columns fit. Anything wider than the column scrolls
sideways inside its own pane rather than widening the page: code blocks,
tables, and diagrams, which render at their natural size (labels at 15px)
instead of shrinking to a thumbnail. A diagram in a post is therefore drawn
top to bottom (`flowchart TD`) so it fits the column; left to right is for
slides.

Decks are Slidev's responsibility; they scale the 16:9 canvas to the
screen. Held upright, a phone shows a slide at less than half size, so the
addon prints `# rotate your phone for a larger slide` above it; the "All
decks" link is interface, not content, and keeps its size at every scale.

Check every change at 390px, 768px and 1920px in both modes; the page must
never scroll horizontally.

## Link previews

Every page has an Open Graph image (`src/og/render.ts`), rendered from the
tokens in the dark palette: the prompt line that opens the page at the top,
the title bottom-left with the cursor block after its last word, an
optional one-line description, and a status line (site name, length, date)
under a rule. The same pane, at 1200 × 630. Titles over forty characters
step down a size rather than wrapping past two lines; keep titles short.

## Slides

Every deck declares `theme: terminal` (`pnpm check` refuses anything else).
The theme lives in `slidev-theme/`:

- **Layouts**: `cover` (prompt line, title bottom-left with cursor),
  `default`, `section` (chapter title bottom-left), `diagram` (small title,
  picture centred), `end`, plus Slidev's built-in `center`, `two-cols`,
  `two-cols-header`, `statement`, `fact`, `quote`, `image-*`, `iframe-*`,
  restyled.
- **Components**: `<Prompt>cmd</Prompt>` (optional `user`, `host`, `path`
  attributes), `<Pane title="…" status="…">`.
- **Cover prompt**: `prompt:` in the cover slide's frontmatter, or
  `themeConfig.prompt` in the headmatter for the whole deck; see Patterns.
- **Colour classes**: `.ok`, `.warn`, `.fail`, `.soft`. There are no others.
- **Code**: Shiki with `terminal-light` / `terminal-dark` themes built from
  the tokens (`design/shiki.ts`, shared with posts). Strings are prompt-green, keywords accent-blue, numbers
  flag-yellow, comments soft. Line highlighting dims the other lines.
- **Status line** on every slide except the cover.

Writing slides: one idea per slide, a heading of at most one line, body of
at most eight lines, code of at most twelve. Use `<Prompt>` for commands and
`<Pane>` for their output. Emphasis is **strong** or a colour class; never
both. `pnpm design:preview` shows the specimen deck with every layout.

## Diagrams

Diagrams are Mermaid, rendered inside decks and posts with the configuration in
`mermaid.ts`: tokens as CSS custom properties, so a diagram follows light
and dark and any later token change without being touched. Nodes are panes,
edges are hairlines with small rounded corners, labels sit on the background.

Semantic node classes, written as `name[Label]:::class`:

| Class | Meaning |
| --- | --- |
| `:::focus` | the subject of the slide (accent) |
| `:::ok` | healthy or desired (prompt green) |
| `:::warn` | degraded, pending, worth watching (flag yellow) |
| `:::fail` | failed or forbidden (danger red) |
| `:::ext` | outside the system described (dashed, soft) |
| `:::store` | data at rest: databases, buckets, queues (strong border) |

Everything else stays plain. At most two classes besides `focus` per
diagram, or the colours stop meaning anything.

Templates, one per kind, in `templates/diagrams/`. Each is a complete slide
(`layout: diagram`) whose presenter note states the rules for that kind:

| Template | For |
| --- | --- |
| `flowchart.md` | how a request or a process moves; decisions |
| `architecture.md` | components inside boundaries (clusters, accounts, teams) |
| `sequence.md` | who talks to whom, in what order |
| `state.md` | the lifecycle of one thing |

Shared rules: left to right on slides, top to bottom in posts (the
reading column is 76 characters wide); about eight nodes or eight messages
per picture; label one edge of a fan-out, not every edge; edge labels of two
words; split rather than shrink. Shapes carry structure (`[process]`,
`{decision}`, `([start or end])`, `[(data)]`, `[[queue]]`); do not add
others. Solid edges are the normal path, dotted are asynchronous, thick is
the one path the slide is about.

A diagram that needs more than Mermaid offers (a drawing, a screenshot) is
exported as PNG at 2× and placed with the same `layout: diagram`. It must
use the token colours.

To add a new kind of diagram: add a template under `templates/diagrams/`
with its rules in the note, add it to the specimen deck, extend `themeCSS`
in `mermaid.ts` for its SVG classes, check both modes, and add a row to the
table above.

## Changing the style

Any change to the look goes through here, in this order:

1. Edit `tokens.ts` (colours, typeface, weights, radius, prompt). For
   layout-level changes, edit the theme (`slidev-theme/styles/`), the
   homepage components, or `mermaid.ts`.
2. `pnpm design:build`, then `pnpm design:check` (regenerates and verifies
   contrast). Both must pass.
3. Look at everything in both modes: `pnpm dev` for the homepage,
   `pnpm design:preview` for every slide layout and every diagram template,
   `pnpm deck <slug>` for a real deck.
4. Search the repository for raw values that escaped the tokens: hex colours,
   font names, pixel borders. None are allowed outside `tokens.ts`, the
   generated files, and the favicon.
5. Update this file: the colour table, the patterns, the principles if they
   changed. Update `AGENTS.md` if a rule changed.
6. Commit everything together: tokens, generated files, theme, templates,
   docs. The generated files are committed so a checkout always matches.

If a typeface changes: install the new `@fontsource` package, point
`fonts.css` at it, set `font.family` and `font.stack` in `tokens.ts`, and
set the three `fonts` defaults in `slidev-theme/package.json` to the same
name. It must be monospace.

## Review checklist

Use this to audit a page, a deck or a diagram against the system:

- [ ] Only JetBrains Mono; only weights 400 and 600; ligatures off.
- [ ] No raw colours, font names or sizes; every value is a token.
- [ ] Colour appears only with its meaning (prompt, open, warn, fail, data).
- [ ] Panes have a hairline border and the one radius; no shadows, no fills
      other than `--color-surface`.
- [ ] Works in light and dark; text meets the contrast minimums.
- [ ] No animation except the homepage cursor; reduced motion respected.
- [ ] Commands and paths are plausible; labels in lowercase, prose in
      sentence case.
- [ ] Slides: one idea, ≤ 8 body lines, ≤ 12 code lines, status line visible.
- [ ] Diagrams: ≤ 8 nodes or messages, left to right on slides and top to
      bottom in posts, classes only for meaning, one label per fan-out.

## Files

```
design/
  README.md                this file
  tokens.ts                the source of every value
  fonts.css                the typeface, self-hosted
  mermaid.ts               diagram configuration built from the tokens
  shiki.ts                 code colours built from the tokens (slides and posts)
src/og/render.ts           link preview images, drawn from the tokens
  generated/               written by `pnpm design:build`; committed
  slidev-theme/            slidev-theme-terminal: layouts, styles, components,
                           setup/shiki.ts, setup/mermaid.ts, global-top.vue
  templates/
    deck/slides.md         the specimen deck: every layout and template
    diagrams/*.md          one slide per diagram kind, rules in the note
scripts/design-build.ts    the generator and the contrast check
public/favicon.svg         generated
```
