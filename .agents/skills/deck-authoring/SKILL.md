---
name: deck-authoring
description: Create or edit a slide deck in decks/ (a talk, case study, note or open-source deck) - headmatter, the prompt line, layouts, components, diagrams from the templates, drafts and publishing. Use whenever slides are to be written or changed in this repository.
---

# Writing a deck

Decks are Slidev presentations in `decks/<slug>/slides.md`, published at
`/decks/<slug>/` and listed on the homepage from their headmatter. Read
`AGENTS.md` "Adding a deck" for the full rules; read the Slidev skill
(`.agents/skills/slidev/SKILL.md`) for Slidev syntax. This skill is the
working order.

Decks are written in the private repository `cychiang/knowledge` and
synced here (`AGENTS.md`, "Where content comes from"). A deck edited only
in this repository is overwritten by the next sync.

## Create

In `cychiang/knowledge`: create `decks/<year>-<kebab>/slides.md` from the
"Deck (slides.md)" template in OpenKnowledge, then preview it with the
public toolchain:

```bash
pnpm site                                   # copies every item into .site/
pnpm --dir .site install
pnpm --dir .site deck 2026-short-title      # dev server, http://localhost:3030
```

In this repository, `pnpm new:deck` and `pnpm deck` still work for trying
the toolchain or the theme. Never rename a published deck's folder; links
would break. Notes and reviews may sit next to `slides.md` in the private
repository; only `slides.md`, `cover.*` and the folders `pages/`,
`images/`, `public/`, `components/`, `layouts/`, `snippets/` are synced.

## Headmatter

```yaml
---
theme: terminal           # required
title: Deck title
info: |
  One or two plain sentences, for link previews and the feed.
routerMode: hash          # required (GitHub Pages cannot rewrite URLs)
themeConfig:              # optional: the prompt line on the cover and in <Prompt>
  prompt: { user: cychiang, host: kubecon, path: "~" }
card:
  date: 2026-09-12        # YYYY-MM-DD; the year must match the folder name
  type: talk              # talk | case-study | note | open-source
  event: Meetup, Stockholm   # optional
  tags: [crossplane]      # optional
  draft: true             # false to publish
  links: { video: https://…, repo: https://… }   # optional
---
```

The first slide is the cover. Its own frontmatter may set
`prompt: { user, host, path, command }`, `prompt: "command"` or
`prompt: false`. Default: `cychiang@github.io:~$ open <slug>`.

## Slides

- Layouts: `cover`, `default`, `section`, `diagram`, `end`, `center`,
  `two-cols` (`::right::`), `two-cols-header`, `statement`, `fact`, `quote`.
  See them all: `pnpm design:preview`.
- Components: `<Prompt>cmd</Prompt>` (optional `user`, `host`, `path`),
  `<Pane title="…" status="…">…</Pane>`.
- Emphasis: `**strong**`, or a colour class on a span: `.ok`, `.warn`,
  `.fail`, `.soft`. Nothing else; no inline styles, no UnoCSS colours.
- One idea per slide, one-line heading, at most eight body lines or twelve
  code lines. Split rather than shrink. Presenter notes go in an HTML
  comment at the end of the slide (never write `-->` inside one).
- Images next to the deck (`decks/<slug>/images/`), relative paths. Long
  decks split with `src: ./pages/part.md`.

## Diagrams

Copy the Mermaid block from the matching template and keep its rules (in
the template's note):

| Kind | Template |
| --- | --- |
| process or request flow | `design/templates/diagrams/flowchart.md` |
| components in boundaries | `design/templates/diagrams/architecture.md` |
| who talks to whom | `design/templates/diagrams/sequence.md` |
| lifecycle of one thing | `design/templates/diagrams/state.md` |

Use `layout: diagram`. Left to right; about eight nodes or messages; classes
only for meaning (`:::focus`, `:::ok`, `:::warn`, `:::fail`, `:::ext`,
`:::store`); label one edge of a fan-out.

## Content rules

Nothing confidential from an employer or client: no internal diagrams,
data, names or screenshots; restate the problem in general terms. Back each
claim with something concrete. Sentence case; English.

## Publish

1. Set `card.draft: false` and add the slug under `decks:` in
   `publish.yml` in `cychiang/knowledge`.
2. In `.site/`: `pnpm check` (validates the deck) and `pnpm build`, then
   `pnpm preview`; check the card on the homepage and the deck in light
   and dark, and that "All decks" leads back.
3. Commit and push in `cychiang/knowledge`. The sync action opens or
   updates the pull request "Sync content from the knowledge repository"
   here; it runs the same checks.
4. Merging that pull request publishes. The live site may show the
   previous build for up to ten minutes (hard-reload before concluding
   otherwise).
