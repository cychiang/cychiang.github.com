// Links between posts are written as relative Markdown links
// (`./2026-other-post.md`), so OpenKnowledge can check them. A post is served
// at /posts/<slug>/, so rewrite each one to the other post's page:
// `./2026-other-post.md#part` becomes `../2026-other-post/#part`.
// A Sätteri mdast plugin; only files in posts/ get it.

interface Link {
  url: string;
}

interface Context {
  setProperty(node: Link, key: 'url', value: string): void;
}

const POST_LINK = /^\.\/([a-z0-9][a-z0-9-]*)\.md(#.*)?$/;

function rewrite(node: Link, ctx: Context) {
  const match = node.url.match(POST_LINK);
  if (match) ctx.setProperty(node, 'url', `../${match[1]}/${match[2] ?? ''}`);
}

const plugin = { name: 'post-links', link: rewrite, definition: rewrite };

/** Plugin factory: Sätteri calls it per document with the file's URL. */
export default function postLinks({ fileURL }: { fileURL: URL | undefined }) {
  return fileURL?.pathname.split('/').at(-2) === 'posts' ? plugin : null;
}
