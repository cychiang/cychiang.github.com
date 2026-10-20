// About: the sections of /about/, one Markdown file each in about/<tab>.md.
// The file name is the tab label and the URL fragment (/about/#experience).
// intro.md is required; every other section is optional and is left out
// when its file is missing or set to draft.
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { ROOT } from './decks.ts';

export const ABOUT_DIR = path.join(ROOT, 'about');
export const TAB_PATTERN = /^[a-z][a-z0-9-]*$/;
export const REQUIRED_TAB = 'intro';

export interface AboutSection {
  tab: string;
  file: string;
  title: string;
  description: string;
  order: number;
  draft: boolean;
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

export async function readSection(tab: string): Promise<AboutSection> {
  const file = path.join(ABOUT_DIR, `${tab}.md`);
  const source = await readFile(file, 'utf8');
  const block = source.match(FRONTMATTER)?.[1];
  const head: Record<string, any> = (block && parseYaml(block)) || {};
  return {
    tab,
    file,
    title: String(head.title ?? '').trim(),
    description: String(head.description ?? '').trim(),
    order: typeof head.order === 'number' ? head.order : Number.NaN,
    draft: head.draft === true,
  };
}

/** Every section in about/, in tab order. */
export async function listSections(): Promise<AboutSection[]> {
  if (!existsSync(ABOUT_DIR)) return [];
  const entries = await readdir(ABOUT_DIR, { withFileTypes: true });
  const tabs = entries.filter((e) => e.isFile() && e.name.endsWith('.md')).map((e) => e.name.slice(0, -3));
  const sections = await Promise.all(tabs.map(readSection));
  return sections.sort((a, b) => a.order - b.order || a.tab.localeCompare(b.tab));
}

/** Human-readable problems; empty when the section is fine. */
export function validateSection(section: AboutSection): string[] {
  const problems: string[] = [];
  if (!TAB_PATTERN.test(section.tab)) {
    problems.push('file name must be a short lowercase word, like experience.md (letters, digits, hyphens)');
  }
  if (!section.title) problems.push('`title` is missing from the frontmatter');
  if (!Number.isInteger(section.order)) problems.push('`order` must be a whole number, like 2');
  if (section.tab === REQUIRED_TAB) {
    if (!section.description) problems.push('`description` is missing; intro.md describes the page for link previews');
    if (section.draft) problems.push('intro.md cannot be a draft; the page needs it');
  }
  return problems;
}

/** Problems with the set as a whole; empty when it is fine. */
export function validateSections(sections: AboutSection[]): string[] {
  const problems: string[] = [];
  if (!sections.some((section) => section.tab === REQUIRED_TAB)) {
    problems.push(`about/${REQUIRED_TAB}.md is missing; the about page needs it`);
  }
  const orders = sections.map((section) => section.order).filter(Number.isInteger);
  if (new Set(orders).size !== orders.length) problems.push('two sections have the same `order`');
  return problems;
}
