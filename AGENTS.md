# AGENTS.md

How this repository is organised and how to change it. Written for coding
agents and for the owner. Follow it when adding decks, changing the homepage, or
touching the build.

## What this is

A personal site for Chuan-Yen Chiang's experience and talks. It has two parts
that are built separately and published together:

- **Decks**: each one is a [Slidev](https://sli.dev) presentation in
  `decks/<slug>/slides.md`, published at `/decks/<slug>/`.
- **Posts**: Markdown notes in `posts/<slug>.md`, published at
  `/posts/<slug>/`. All content is written in a private repository and
  synced here (see "Where content comes from").
- **About**: one Markdown file per tab in `about/`, published together at
  `/about/` (see "The about page").
- **Homepage**: an [Astro](https://astro.build) site in `src/` that shows every
  published deck as a card on a wall and lists every published post. Cards
  and rows are generated from each file's frontmatter. Nothing is written
  twice.

## Layout

```
decks/<slug>/slides.md     one Slidev deck per folder (the content)
decks/<slug>/cover.png     optional cover image for the homepage card
posts/<slug>.md            one post per file (the content)
about/<tab>.md             one section of the about page per file
.ok/                       OpenKnowledge project: config, templates, schemas
.okignore                  what OpenKnowledge hides (everything but content)
design/                    the design system: tokens, slide theme, templates
design/README.md           the design rules; read before any visual change
design/tokens.ts           every colour, typeface and shape; the only source
design/slidev-theme/       slidev-theme-terminal, used by every deck
design/templates/          specimen deck and diagram templates (not published)
src/site.config.ts         site name, homepage copy, header links, type labels
src/content.config.ts      the `decks`, `posts` and `about` collections
src/pages/                 Astro pages (index, about, 404, posts/[slug])
src/components/            DeckWall, DeckCard, PostList, Prompt, PromptPrefix
src/layouts/Base.astro     html shell, header, footer
src/styles/global.css      imports the design tokens; homepage layout values
scripts/lib/decks.ts       deck discovery and validation, shared by everything
scripts/lib/posts.ts       post discovery and validation
scripts/lib/about.ts       about section discovery and validation
scripts/                   new-deck, new-post, deck (dev server), check-*, build-decks
scripts/design-build.ts    generates token files from design/tokens.ts
scripts/templates/         the template a new deck starts from
slidev-addon-site/         local Slidev addon applied to every deck (link home)
pnpm-workspace.yaml        pnpm settings, workspace packages, overrides
.github/workflows/         build on pull requests, deploy on push to main
```

## Toolchain

- **pnpm** is the package manager. Do not use npm or yarn, and do not commit
  a `package-lock.json`. The pnpm version is pinned by `packageManager` in
  `package.json`; `corepack enable` makes it available.
- **TypeScript** everywhere: the Astro site, `astro.config.ts`, and every
  script. Do not add `.js` or `.mjs` source files.
- Scripts in `scripts/` are run directly by Node (`node scripts/x.ts`), with
  no build step. Node strips the types but cannot compile TypeScript-only
  runtime features, so use erasable syntax only: no enums, namespaces or
  parameter properties; use `import type` for types; write relative imports
  with the `.ts` extension. `tsconfig.json` enforces this
  (`erasableSyntaxOnly`), and `pnpm check` type-checks the scripts too.

Managed by other tools. Do not edit by hand:

- `skills-lock.json` and `.agents/skills/slidev/`: a skill installed with
  the `skills` CLI; update it with that CLI only. The repository's own
  skills (`terminal-design`, `deck-authoring`) live next to it and are
  edited by hand; `.claude/skills/` and `.cortex/skills/` are symlinks to
  `.agents/skills/`, so a new skill needs a symlink in each.
- `pnpm-lock.yaml`: change it through `pnpm install` / `pnpm add`.
- `design/generated/` and `public/favicon.svg`: written by `pnpm design:build`
  from `design/tokens.ts`. Edit the tokens, then regenerate.

The branch `legacy-main` holds the site that lived here until 2013. Leave it
alone.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm install` | Install dependencies. |
| `pnpm dev` | Homepage dev server (http://localhost:4321). Drafts are shown. |
| `pnpm deck <slug>` | Slidev dev server for one deck (http://localhost:3030). |
| `pnpm new:deck <slug> "Title"` | Create a deck from the template, as a draft. |
| `pnpm new:post <slug> "Title"` | Create a post from the template, as a draft. |
| `pnpm check` | Design tokens, every deck and post, types, and the specimen deck. Must pass before a commit. |
| `pnpm build` | Build the homepage, then every published deck, into `dist/`. |
| `pnpm preview` | Serve `dist/` exactly as it will be published. |
| `pnpm design:build` | Regenerate token files after editing `design/tokens.ts`. |
| `pnpm design:check` | Fail if generated files are stale or contrast is too low. |
| `pnpm design:preview` | The specimen deck: every layout and diagram template. |

Deck links on the homepage only work after `pnpm build`, because decks are
built by Slidev, not by the Astro dev server. To review the whole site, run
`pnpm build && pnpm preview`.

## Skills and docs to use

- **`deck-authoring`** (`.agents/skills/deck-authoring/SKILL.md`): the
  working order for creating or editing a deck. Use it for any slides.
- **`post-authoring`** (`.agents/skills/post-authoring/SKILL.md`): the
  working order for a post, including the private repository and its sync.
- **`terminal-design`** (`.agents/skills/terminal-design/SKILL.md`): the
  procedure for any visual change or style audit. Use it before touching
  colours, type, components, layouts or diagram styling.
- **Slidev**: read `.agents/skills/slidev/SKILL.md` before writing or editing
  slides, and the matching file in `.agents/skills/slidev/references/` for the
  feature in question (layouts, animations, code blocks, diagrams, export).
  Prefer what the skill documents over memory.
- **Slidev MCP**: while `pnpm deck <slug>` is running, slide-level tools
  are available at `http://localhost:3030/__mcp`. Use them for inserting,
  moving and removing slides. See `references/tool-mcp.md`.
- **Astro**: the Astro docs MCP server is configured in `.mcp.json`
  (`astro-docs`). Check it before using an Astro API. This repo is on Astro 7.

## The design system

Everything visible follows the terminal design system in `design/README.md`.
That file is normative; this section is the summary an agent needs most
often.

- **One source of values.** Colours, the typeface, weights and radius live in
  `design/tokens.ts`. Nothing else may contain a raw colour, font name or
  pixel border: components, the slide theme and diagrams read the generated
  custom properties (`--color-*`, `--font-mono`, `--text-*`, `--radius`,
  `--border`).
- **Colour is meaning.** `--color-prompt` for the prompt, cursor and healthy
  states; `--color-accent` for anything that opens or is in focus;
  `--color-flag` for warnings and drafts; `--color-danger` for failure.
  Nothing is coloured for decoration.
- **Structure is a pane.** Hairline border, the one radius, optional title
  bar and status line. No shadows, no gradients, no second radius.
- **Every deck uses `theme: terminal`** and the layouts, components and
  colour classes the theme provides. `pnpm check` refuses other themes.
- **Every diagram starts from a template** in `design/templates/diagrams/`
  and uses only the semantic classes listed there.
- **Changing the style** follows "Changing the style" in `design/README.md`:
  tokens → `pnpm design:build` → review the homepage, the specimen deck and a
  real deck in both modes → search for escaped raw values → update the docs →
  commit everything together. A style change that leaves any surface behind
  is not finished.

## Adding a deck

Decks are written in the private repository and synced here (see "Where
content comes from"); the steps below are the same there, with its
`pnpm site` for previews. `pnpm new:deck` here is for trying the toolchain.

1. Pick the slug: `<year>-<short-title>`, lowercase, hyphenated, for example
   `2026-building-a-provider`. The slug is the public URL. **Never rename a
   deck folder after it has been published**; links people have shared would
   break.
2. Run `pnpm new:deck <slug> "Deck title"`.
3. Fill in the headmatter (see below) and write the slides in
   `decks/<slug>/slides.md`. Preview with `pnpm deck <slug>`.
4. Put images next to the deck (`decks/<slug>/images/…`) and reference them
   with relative paths. Split long decks with `src:` imports into
   `decks/<slug>/pages/`.
5. When it is ready to publish, set `card.draft: false`.
6. Run `pnpm check && pnpm build`. Both must pass.
7. Commit. Pushing to `main` publishes it.

### Headmatter

The first frontmatter block of `slides.md` configures the deck for Slidev and
describes it for the homepage.

```yaml
---
theme: terminal           # always; the design system's theme
title: Building a provider from scratch
info: |
  One or two plain sentences. Used for link previews and the feed.
routerMode: hash          # required, see "Deck rules"
themeConfig:              # optional: the prompt line (user@host:path$)
  prompt: { user: cychiang, host: kubecon, path: "~" }
card:
  date: 2026-09-12        # when it was given or written, YYYY-MM-DD
  type: talk              # talk | case-study | note | open-source
  event: Meetup name, Stockholm   # optional; where it was given
  tags: [crossplane, platform]    # optional
  draft: false            # true keeps it off the published site
  links:                  # optional; shown as links under the card
    video: https://…
    repo: https://…
    post: https://…
---
```

`title` and `info` are standard Slidev fields. Everything under `card:` is read
only by this site.

### Deck rules

`pnpm check` enforces these, and the build refuses a deck that breaks them:

- The folder name matches `<year>-<short-title>`, and the year equals the year
  of `card.date`.
- `theme: terminal` is set.
- `title` is set.
- `card.date` is a valid `YYYY-MM-DD` date.
- `card.type` is one of the allowed types.
- `routerMode: hash` is set. GitHub Pages cannot rewrite URLs, so without hash
  routing a reload or a shared link to a slide returns 404.

### Cover images

A card shows a typeset cover (the deck's title) by default. To use an image
instead, add `decks/<slug>/cover.png` (or `.jpg`, `.webp`) at 16:9, at least
960 px wide. One way to make it from the first slide:

```bash
pnpm add -D playwright-chromium
pnpm exec playwright install chromium
pnpm exec slidev export decks/<slug>/slides.md --format png --range 1 --output decks/<slug>/cover
```

Check where Slidev wrote the PNG, move it to `decks/<slug>/cover.png`, and
commit only that file; revert the `playwright-chromium` dependency afterwards.
These steps have not been run in this repository yet. If they need adjusting,
correct this section in the same commit.

### Writing slides

- Layouts: `cover` (first slide), `default`, `section`, `diagram`, `end`,
  plus `center`, `two-cols`, `two-cols-header`, `statement`, `fact`, `quote`.
  See them all with `pnpm design:preview`.
- Components: `<Prompt>command</Prompt>` for a command that was run,
  `<Pane title="…">…</Pane>` for its output or any boxed content.
- The prompt line (`user@host:path$`) on the cover and in `<Prompt>`
  defaults to `cychiang@github.io:~$`. Change it for a deck with
  `themeConfig.prompt` in the headmatter, for one cover slide with
  `prompt:` in that slide's frontmatter (`prompt: "cmd"` sets only the
  command, `prompt: false` hides the line), or for one `<Prompt>` with its
  `user`, `host` and `path` attributes. The cover's default command is
  `open <slug>`.
- Colour classes: `.ok`, `.warn`, `.fail`, `.soft` on a `<span>`. No inline
  styles, no UnoCSS colour utilities.
- One idea per slide; a one-line heading; at most eight lines of body or
  twelve of code. Split rather than shrink.
- Diagrams: copy the Mermaid block from the matching file in
  `design/templates/diagrams/` into a slide with `layout: diagram` and follow
  the rules in that file's note (direction, node count, classes).

### Content rules

- One idea per slide. A deck is not an article; link out for long arguments.
- Back each claim with something concrete: a situation, a number, a failure.
  State the trade-off and when the opposite choice would be right.
- **Nothing confidential.** No internal diagrams, data, names or screenshots
  from an employer or client. Rewrite the problem in general terms.
- Sentence case for titles and headings. Site and deck language is English
  unless the owner says otherwise.

## Changing the homepage

- **Words and links**: edit `src/site.config.ts`. Do not hard-code copy in
  components.
- **Card contents**: `src/components/DeckCard.astro`.
- **Wall layout, filters, empty slots**: `src/components/DeckWall.astro`.
  Filter buttons appear on their own once decks of more than one type exist.
  The dashed empty slots disappear once there are three decks.
- **Page layout and paging**: `src/pages/index.astro` and
  `src/scripts/pager.ts`. From 60rem wide and 34rem tall the homepage fits
  one screen: the headline, then posts on the left and decks on the right,
  each paged with `<Pager>` to as many items as fit. Narrower or shorter
  screens stack the two and scroll, with 5 posts or 4 decks per page.
  Without JavaScript nothing is paged and everything shows. Both lists are
  newest first. The media query lives in both files (`FIT_QUERY`); change
  them together.
- **A new deck type**: add it to `DECK_TYPES` in `scripts/lib/decks.ts` and
  give it a label in `typeLabels` in `src/site.config.ts`.
- **A new field on the card**: add it to the `Deck` interface and `readDeck()`
  in `scripts/lib/decks.ts`, add it to the loader and schema in
  `src/content.config.ts`, then render it in `DeckCard.astro`. Document it in
  the headmatter section above.

### Site style

The homepage is the design system applied to one page; `design/README.md`
has the vocabulary. Rules specific to the homepage:

- Each section starts with a prompt line, `<Prompt command="…" />`, naming
  the command whose "output" follows. The prompt is decoration and is hidden
  from screen readers, so every section also needs a real heading (it may be
  `visually-hidden`) or an `aria-label`. Commands must be plausible.
- The prompt lines are static. An interactive prompt (typing `ls`, `open
  <deck>` and so on) was tried and removed until there is enough content to
  make it worth having; if it comes back, everything a command does must
  also be possible with mouse or touch, it must not take focus on load, and
  the page must still work without JavaScript.
- Decks are panes: path in the title bar, slide in the body, date and length
  in the status line. Every pane is the same size: the body is always 16:9
  and never grows, a typeset title is cut to three lines with an ellipsis,
  a cover image is cropped to fill, and the dashed empty slot is built from
  the same bar, body and status line. The homepage shows titles only: no description under a
  deck or a post, and no intro paragraph under the headline. Descriptions
  are still written, for link previews and the feed.
- Lowercase for labels that mimic commands, paths and flags (`github`,
  `--type all`); sentence case for prose and headings.
- The blinking cursor in the first empty slot is the only animation.

Layout values that only the homepage has (`--page-width`, `--wall-gap`,
`--page-gutter`) live in `src/styles/global.css`. Everything else is a token.

### What every deck gets automatically

`slidev-theme-terminal` (in `design/slidev-theme/`) and the local addon
`slidev-addon-site` are workspace packages, so Slidev finds them by name:
`theme: terminal` in a deck's headmatter, and `addons: [site]` in the root
`package.json` for every deck. The theme provides the look, the layouts, the
code colours, the diagram styling and the status line; the addon provides
the way back to the homepage (an "All decks" link top-right on every slide
and a home button in Slidev's control bar, hidden in presenter view, exports
and embeds). A deck must always offer a way back; do not remove it.

Anything that should appear on every deck (a footer, a logo) goes in the
theme, not in individual decks.

### Slidev themes

There is one: `terminal`. Do not install or reference another theme; the
whole point of the design system is that every deck looks the same. If a deck
needs something the theme lacks, add it to the theme (and to the specimen
deck and `design/README.md`) so every deck gets it.

## Writing a post

A post is one Markdown file, `posts/<year>-<short-title>.md`. The file name
is the URL. Create it in the private repository from the "Post" template in
OpenKnowledge and list it in `publish.yml` there.

```yaml
---
title: Why reconcile loops
description: One sentence, for link previews and the feed.
date: 2026-10-10        # YYYY-MM-DD; the year must match the file name
tags: [crossplane]      # optional
draft: true             # false to publish
---
```

`pnpm check` enforces the file name pattern, the title, the description and
the date (`scripts/lib/posts.ts`); OpenKnowledge shows the same rules in its
editor through `.ok/schemas/post.json`. Keep the two in step.

Writing: start with the claim; one idea per section; headings in sentence
case; code in fenced blocks with a language (coloured with the design
tokens); diagrams as fenced `mermaid` blocks copied from
`design/templates/diagrams/` but drawn top to bottom (`flowchart TD`, the
column is 76 characters wide and a diagram renders at its natural size),
rendered in the browser with the same configuration as slides. Relative links between posts (`./other-post.md`)
are fine; OpenKnowledge checks them. The content rules for decks apply.

## The about page

`/about/` is built from `about/<tab>.md`, one file per tab. The file name is
the tab label and the URL fragment (`/about/#experience`).

```yaml
---
title: Experience     # the section heading
order: 2              # tab position; intro.md is 1
description: …        # intro.md only: the page's link preview
draft: false          # true leaves the tab off the published site
---
```

- `intro.md` is required and cannot be a draft. Every other tab is
  optional: delete the file or set `draft: true` and the tab disappears.
  With one section left, the tab row disappears too.
- Headings inside a section are `###`; the title is the section's `h2`.
- Experience is written as areas of work and years. **No employer or
  client names**, no job titles, the same rule as decks.
- Open source is a short, chosen list linking to GitHub, not every pull
  request; the last line links to the full search. Nothing is fetched from
  GitHub at build time.
- Links to pages of this site need a full URL; `.md` links are not
  rewritten outside posts.

`pnpm check` enforces the rules (`scripts/lib/about.ts`); OpenKnowledge
shows them through `.ok/schemas/about.json`. The header link comes from
`pages` in `src/site.config.ts`.

## Where content comes from

This repository is public, so content is written elsewhere: in the private
repository `cychiang/knowledge`, usually in
[OpenKnowledge](https://openknowledge.ai). That repository holds every
deck, post and about tab, private ones and working notes included. Its
`publish.yml` lists what is public, and its GitHub Action copies exactly
those items here as a pull request ("Sync content from the knowledge
repository", branch `sync/knowledge`).

1. Content is written and committed in `cychiang/knowledge`.
2. A push there that touches published content opens or updates the sync
   pull request here.
3. This repository's workflow runs `pnpm check` and a build on it.
4. Merging it publishes. Only `main` deploys.

Consequences for this repository:

- `decks/`, `posts/` and `about/` are owned by the sync: each sync replaces
  them with the published items. Do not edit content here; change it in
  `cychiang/knowledge`. A fix made here is overwritten by the next sync.
- Of a deck folder only `slides.md`, `cover.*` and the folders `pages/`,
  `images/`, `public/`, `components/`, `layouts/`, `snippets/` are
  published. Notes and reviews next to a deck stay private.
- The rules stay here: `pnpm check`, the schemas in `.ok/schemas/` and this
  file. When a rule changes, copy the changed schema to `cychiang/knowledge`.
- Code changes are ordinary branches from `main`.

## Adding other kinds of content

Keep the same shape as decks and posts: files in a top-level folder, a
collection in `src/content.config.ts`, a `scripts/lib/<kind>.ts` with the
rules and a `check-<kind>.ts` in `pnpm check`, an OpenKnowledge template and
schema in `.ok/`, the same tokens and patterns, and a section in this file
and in `design/README.md`.

## Search engines and link previews

Everything below is automatic; what a page needs from its author is a
specific `title` and a one-sentence `description` (or `info` for a deck),
because those become the page title, the meta description, the link
preview and the feed entry.

- `src/layouts/Base.astro` writes the title, description, author, canonical
  URL, Open Graph and Twitter tags, `theme-color` from the tokens, and
  JSON-LD (`WebSite` on the homepage, `BlogPosting` on posts). Posts also
  carry `article:*` tags.
- Decks are built by Slidev, so `scripts/build-decks.ts` rewrites each
  deck's `<head>` with the same tags after the build.
- Preview images are rendered at build time by `src/pages/og/[...path].png.ts`
  with `src/og/render.ts` (satori and resvg, drawn from the tokens): one for
  the site, one per post, one per deck. They are terminal panes: prompt
  line, title with the cursor, status line.
- `@astrojs/sitemap` writes `sitemap-index.xml`, with deck URLs added from
  `astro.config.ts`; `src/pages/robots.txt.ts` points at it;
  `src/pages/rss.xml.ts` lists posts and decks.
- Drafts are left out of all of it.

Do not add a second metadata system (an SEO integration, per-page `<meta>`
tags in components); extend `Base.astro` and `build-decks.ts` instead so
posts and decks stay in step.

## Build and deployment

`.github/workflows/deploy.yml` runs on every pull request (check and build)
and on every push to `main` (check, build, deploy to GitHub Pages).

- `pnpm build` runs `astro build` (homepage into `dist/`) and then
  `scripts/build-decks.ts` (each published deck into `dist/decks/<slug>/`).
- The workflow sets `SITE_URL` to `https://cychiang.github.io` (fixed, always
  https) and `BASE_PATH` to `/`. `SITE_URL` is what canonical URLs, the
  sitemap, robots.txt, the feed and preview images use, so every public URL
  is https; a local `pnpm build` uses http://localhost:4321. Do not derive it
  from `actions/configure-pages`, which reports `http://`. Always build
  internal links from `import.meta.env.BASE_URL` in Astro and from
  `withBase()` in scripts. Never hard-code a leading `/`.
- In the repository's Pages settings, "Enforce HTTPS" stays on.
- The repository's Pages source must be set to "GitHub Actions".
- After a deploy, a browser can keep showing the previous build for up to ten
  minutes, and a deck that was already open can fail to load further slides.
  Hard-reload (Cmd+Shift+R) before concluding that a change did not work.

### Dependencies

- Node.js 22.18 or newer (`.nvmrc`), because scripts rely on Node running
  TypeScript directly.
- Add packages with `pnpm add <name>` (or `pnpm add -D`). pnpm holds back
  versions published in the last few days; prefer a slightly older version
  over adding entries to `minimumReleaseAgeExclude`.
- pnpm blocks dependency install scripts. If a new dependency needs one, add
  it to `allowBuilds` in `pnpm-workspace.yaml` after checking what it runs.
- Dependabot opens weekly update pull requests. Merge them only when the
  workflow is green.
- `pnpm-workspace.yaml` has an `overrides` entry pinning `magic-string` 1.x
  to `1.4.2`. Version 1.4.3 breaks every Slidev build through UnoCSS
  ([unocss#5373](https://github.com/unocss/unocss/issues/5373),
  [slidev#2768](https://github.com/slidevjs/slidev/issues/2768)). Remove the
  override once a fixed UnoCSS is released, and confirm with `pnpm build`.

## Before you finish

- `pnpm check` and `pnpm build` both pass.
- For visual changes, look at the result in light and dark: the homepage
  with `pnpm preview` at phone and desktop widths, decks and diagrams with
  `pnpm design:preview`. Run through the review checklist in
  `design/README.md`.
- No raw colours, font names or pixel borders were added outside
  `design/tokens.ts`.
- Navigation works both ways: from the homepage into a deck, and from any
  slide back to the homepage.
- No files changed under `.agents/`, `.claude/`, `.cortex/`, or in
  `skills-lock.json`, unless the task was to update skills.
- This file and `design/README.md` still describe the repository. If you
  changed a convention or the style, update them in the same commit.
