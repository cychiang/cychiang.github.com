import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { DECK_TYPES, listDecks } from '../scripts/lib/decks.ts';

// The `decks` collection is read straight from decks/<slug>/slides.md, so a
// deck's headmatter is the only place its title, date and type are written.
const decks = defineCollection({
  loader: async () =>
    (await listDecks()).map((deck) => ({
      id: deck.slug,
      title: deck.title,
      description: deck.description,
      date: deck.date,
      type: deck.type,
      event: deck.event,
      tags: deck.tags,
      draft: deck.draft,
      links: deck.links,
      slides: deck.slides,
    })),
  schema: z.object({
    title: z.string().min(1),
    description: z.string(),
    date: z.coerce.date(),
    type: z.enum(DECK_TYPES),
    event: z.string().optional(),
    tags: z.array(z.string()),
    draft: z.boolean(),
    links: z.record(z.string(), z.string()),
    slides: z.number().int().positive(),
  }),
});

// Posts are plain Markdown files in posts/, one per note. The file name is the
// slug and the URL; the frontmatter is the card. scripts/check-posts.ts
// enforces the naming and date rules before a build.
const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './posts' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// The about page: one Markdown file per tab in about/. The file name is the
// tab; scripts/check-about.ts enforces the rules in scripts/lib/about.ts.
const about = defineCollection({
  loader: glob({ pattern: '*.md', base: './about' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().default(''),
    order: z.number().int(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { decks, posts, about };
