// /og/site.png, /og/posts/<slug>.png and /og/decks/<slug>.png
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../../site.config';
import { renderOg } from '../../og/render';
import type { OgCard } from '../../og/render';

const published = ({ data }: { data: { draft: boolean } }) => import.meta.env.DEV || !data.draft;

export const getStaticPaths: GetStaticPaths = async () => {
  const [posts, decks, about] = await Promise.all([
    getCollection('posts', published),
    getCollection('decks', published),
    getCollection('about', published),
  ]);
  const intro = about.find((section) => section.id === 'intro');
  const iso = (date: Date) => date.toISOString().slice(0, 10);
  const cards: { path: string; card: OgCard }[] = [
    {
      path: 'site',
      card: { command: 'cat about.txt', title: site.headline, status: [site.name], statusRight: site.prompt.host },
    },
    {
      path: 'about',
      card: {
        command: 'cat about/intro.md',
        title: intro?.data.title ?? site.name,
        subtitle: intro?.data.description,
        status: [site.name],
        statusRight: site.prompt.host,
      },
    },
    ...posts.map((post) => ({
      path: `posts/${post.id}`,
      card: {
        command: `cat posts/${post.id}.md`,
        title: post.data.title,
        subtitle: post.data.description,
        status: [site.name],
        statusRight: iso(post.data.date),
      },
    })),
    ...decks.map((deck) => ({
      path: `decks/${deck.id}`,
      card: {
        command: `open ${deck.id}`,
        title: deck.data.title,
        subtitle: deck.data.description,
        status: [site.name, `${deck.data.slides} slides`],
        statusRight: iso(deck.data.date),
      },
    })),
  ];
  return cards.map(({ path, card }) => ({ params: { path }, props: { card } }));
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOg(props.card as OgCard);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
