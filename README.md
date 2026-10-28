# cychiang.github.io

My personal site, [cychiang.github.io](https://cychiang.github.io): slide
decks and notes about platform engineering, and an about page. Decks are
built with [Slidev](https://sli.dev), the homepage, posts and about page with
[Astro](https://astro.build), and everything is deployed to GitHub Pages from
`main`.

## What is in this repository

| Path | Contents |
| --- | --- |
| `decks/` | Published slide decks, one folder per deck |
| `posts/` | Published notes |
| `about/` | The tabs of the about page |
| `src/`, `scripts/` | The Astro site and the scripts that check and build it |
| `design/` | Design tokens, the Slidev theme and diagram templates |

`decks/`, `posts/` and `about/` are not edited here. They are written in a
private repository, which lists what is public and sends those items here as
a pull request. Merging that pull request publishes them. See "Where content
comes from" in [AGENTS.md](AGENTS.md).

## Quick start

Requires Node.js 24 LTS (24.11 or newer, `.nvmrc`) and
[pnpm](https://pnpm.io) (`corepack enable` installs the version pinned in
`package.json`).

```bash
pnpm install
pnpm dev                     # homepage at http://localhost:4321
pnpm deck 2026-hello-world   # one deck at http://localhost:3030
```

## Check and build

```bash
pnpm check     # design tokens, decks, posts, about page and types
pnpm build     # homepage and every published deck into dist/
pnpm preview   # serve dist/ as it will be published
```

Every pull request runs `pnpm check` and a build; only `main` deploys.

## Further reading

- [AGENTS.md](AGENTS.md): the full conventions, for people and coding agents.
- [design/README.md](design/README.md): the visual language (tokens, slide
  theme, diagram templates); `pnpm design:preview` shows every layout.
