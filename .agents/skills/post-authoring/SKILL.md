---
name: post-authoring
description: Create or edit a post (a Markdown note in posts/) for this site, including the private knowledge repository and its sync, frontmatter rules, Mermaid diagrams and publishing. Use whenever a note, article or write-up is to be written or changed for this site.
---

# Writing a post

Posts are Markdown files in `posts/<year>-<short-title>.md`, published at
`/posts/<slug>/` and listed on the homepage under `ls posts/`. The rules are
in `AGENTS.md` "Writing a post" and "Where content comes from"; the look is
in `design/README.md` "Posts". This skill is the working order.

## Where to write

Posts are written in the private repository `cychiang/knowledge`, never
here: the sync replaces `posts/` in this repository with the published
items, so a post edited only here is overwritten.

- **OpenKnowledge** (the owner's editor) opens `cychiang/knowledge` and
  commits and pushes to its `main` by itself. Create a document from the
  "Post" template; the editor validates the frontmatter with
  `.ok/schemas/post.json`.
- **An agent** edits `posts/<slug>.md` in a checkout of
  `cychiang/knowledge` and commits there. Pull first, so OpenKnowledge's
  own commits are not overwritten.

## Frontmatter

```yaml
---
title: Why reconcile loops            # also the page title and the link preview
description: One sentence, for link previews and the feed.
date: 2026-10-10        # the year must match the file name
tags: [crossplane]      # optional
draft: true             # false to publish
---
```

## Body

- Start with the claim, then earn it. One idea per section, headings in
  sentence case, paragraphs under 76 characters wide read best.
- Code in fenced blocks with a language; it is coloured with the design
  tokens. Inline code for names of things.
- Diagrams: a fenced `mermaid` block copied from the matching template in
  `design/templates/diagrams/` (flowchart, architecture, sequence, state),
  keeping that template's rules, but drawn top to bottom (`flowchart TD`):
  a post renders a diagram at its natural size inside a 76-character
  column, and anything wider scrolls sideways. A sequence diagram fits
  with three participants and short messages. They render in the browser
  with the same configuration as slides, in light and dark.
- Links to other posts are relative (`./2026-other-post.md`); OpenKnowledge
  flags broken ones. External links are plain Markdown links.
- Nothing confidential from an employer or client. Back claims with
  something concrete. English, sentence case.

## Publish

1. `draft: false`, and the slug under `posts:` in `publish.yml`.
2. Preview: `pnpm site` in `cychiang/knowledge` copies every item into
   `.site/`; there run `pnpm install`, `pnpm check`, `pnpm build` and
   `pnpm preview`, and read the post in light and dark.
3. Commit and push in `cychiang/knowledge`. The sync action opens or
   updates the pull request "Sync content from the knowledge repository"
   here, which runs the same checks.
4. Merging that pull request publishes. Only `main` deploys.
