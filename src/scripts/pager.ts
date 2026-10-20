// Pages a list so the homepage fits one screen. On a screen tall and wide
// enough for the two-column layout, a page holds as many items as fit in the
// list's height; elsewhere the page scrolls and holds a fixed number. Without
// JavaScript nothing is paged and every item shows.

/** When the homepage fits one screen. Mirrors the media query in src/pages/index.astro. */
export const FIT_QUERY = '(min-width: 60rem) and (min-height: 34rem)';

interface PagerOptions {
  /** The list or grid whose children are paged. */
  list: HTMLElement;
  /** Which `<Pager name="…">` drives this list. */
  name: string;
  /** The items in the current set, in order (a filter may leave some out). */
  items: () => HTMLElement[];
  /** Items per page when the page scrolls instead of fitting the screen. */
  perPage: number;
}

export function createPager({ list, name, items, perPage }: PagerOptions) {
  const pager = document.querySelector<HTMLElement>(`[data-pager="${name}"]`);
  const prev = pager?.querySelector<HTMLButtonElement>('[data-prev]');
  const next = pager?.querySelector<HTMLButtonElement>('[data-next]');
  const status = pager?.querySelector<HTMLElement>('[data-status]');
  const fit = window.matchMedia(FIT_QUERY);
  let first = 0;
  let size = perPage;

  // The one-screen layout only applies once paging is running.
  document.documentElement.classList.add('paged');
  if (pager) pager.hidden = false;

  /** How many items fit: rows that fit the list's height times its columns. */
  function measure(set: HTMLElement[]): number {
    const sample = set[0];
    if (!fit.matches || !sample) return perPage;
    for (const child of list.children) (child as HTMLElement).hidden = child !== sample;
    const itemHeight = sample.getBoundingClientRect().height;
    const style = getComputedStyle(list);
    const gap = Number.parseFloat(style.rowGap) || 0;
    const columns =
      style.display === 'grid' ? style.gridTemplateColumns.split(' ').filter(Boolean).length : 1;
    const rows = Math.max(1, Math.floor((list.clientHeight + gap) / (itemHeight + gap)));
    return columns * rows;
  }

  function render() {
    const set = items();
    size = Math.max(1, measure(set));
    const pages = Math.max(1, Math.ceil(set.length / size));
    first = Math.min(Math.floor(first / size), pages - 1) * size;
    const shown = new Set<Element>(set.slice(first, first + size));
    for (const child of list.children) (child as HTMLElement).hidden = !shown.has(child);

    const current = first / size + 1;
    if (pager) pager.toggleAttribute('data-single', pages <= 1);
    if (status) status.textContent = `--page ${current}/${pages}`;
    if (prev) prev.disabled = current === 1;
    if (next) next.disabled = current === pages;
  }

  prev?.addEventListener('click', () => {
    first = Math.max(0, first - size);
    render();
  });
  next?.addEventListener('click', () => {
    first += size;
    render();
  });

  let queued = 0;
  const later = () => {
    cancelAnimationFrame(queued);
    queued = requestAnimationFrame(render);
  };
  window.addEventListener('resize', later);
  fit.addEventListener('change', later);
  document.fonts?.ready.then(later);

  render();
  return {
    /** Back to the first page, after the set of items changed. */
    reset() {
      first = 0;
      render();
    },
  };
}
