import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { shikiThemes } from './design/shiki.ts';
import { listDecks } from './scripts/lib/decks.ts';
import postLinks from './src/markdown/post-links.ts';

const siteUrl = process.env.SITE_URL || 'http://localhost:4321';
const base = process.env.BASE_PATH || '/';

// Decks are built by Slidev, not Astro, so the sitemap is told about them.
const deckPages = (await listDecks())
  .filter((deck) => !deck.draft)
  .map((deck) => new URL(`${base.replace(/\/+$/, '')}/decks/${deck.slug}/`, siteUrl).href);

// SITE_URL and BASE_PATH are set by the deploy workflow (SITE_URL is fixed to
// https://cychiang.github.io). Locally they default to http://localhost:4321
// and the root.
export default defineConfig({
  site: siteUrl,
  base,
  trailingSlash: 'ignore',
  integrations: [sitemap({ customPages: deckPages, filter: (page) => !page.includes('/og/') })],
  markdown: {
    // Code in posts uses the same colours as code on slides. With
    // defaultColor off, both palettes are emitted as --shiki-light/--shiki-dark
    // and global.css picks one by the colour scheme.
    shikiConfig: { themes: shikiThemes, defaultColor: false },
    // `./other-post.md` links between posts point at the other post's page.
    processor: satteri({ mdastPlugins: [postLinks] }),
  },
});
