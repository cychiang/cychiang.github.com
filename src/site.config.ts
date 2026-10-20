// Everything about the site that is not a deck: who it belongs to, the words on
// the homepage, and the links in the header. Change copy here, not in components.

import { prompt } from '../design/tokens.ts';

export const site = {
  /** Shown in the header and the browser tab. */
  name: 'Chuan-Yen Chiang',
  /** The homepage headline. */
  headline: 'Slide decks and notes on platform engineering.',
  /** Used for <meta name="description"> and link previews. */
  description: 'Slide decks and notes on platform engineering by Chuan-Yen Chiang.',
  /** The page language, for <html lang> and the feed. */
  language: 'en',
  /** The author, for metadata and structured data. */
  author: { name: 'Chuan-Yen Chiang', url: 'https://github.com/cychiang' },
  /** The shell prompt shown before each section: user@host:~$ */
  prompt,
  links: [
    { label: 'GitHub', href: 'https://github.com/cychiang' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/chuan-yen' },
  ],
  repo: 'https://github.com/cychiang/cychiang.github.io',
} as const;

/** How each `card.type` is worded on the site. Keys mirror DECK_TYPES. */
export const typeLabels: Record<string, { one: string; many: string }> = {
  talk: { one: 'Talk', many: 'Talks' },
  'case-study': { one: 'Case study', many: 'Case studies' },
  note: { one: 'Note', many: 'Notes' },
  'open-source': { one: 'Open source', many: 'Open source' },
};

/** Labels for the optional `card.links` keys. Unknown keys show as written. */
export const linkLabels: Record<string, string> = {
  video: 'Video',
  repo: 'Repository',
  post: 'Write-up',
  pdf: 'PDF',
};
