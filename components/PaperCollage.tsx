/**
 * A faint contact-sheet of everything in today's notebook except the news —
 * the paintings, film posters, book covers, history portraits and quote
 * portraits — tiled small behind the whole page. Purely decorative: it is
 * aria-hidden and non-interactive, a quiet texture that hints at how much is
 * inside without competing with the content on top of it.
 */
export function PaperCollage({ images }: { images: string[] }) {
  if (images.length === 0) return null;

  // Repeat the day's images enough to cover a tall, wide viewport with no gap
  // at the bottom; duplicates reuse the same cached files, so this stays a
  // handful of real requests.
  const tiles = Array.from({ length: 560 }, (_, i) => images[i % images.length]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 select-none overflow-hidden"
    >
      <div className="grid h-full grid-cols-[repeat(auto-fill,minmax(76px,1fr))] gap-1 opacity-[0.26] dark:opacity-[0.17]">
        {tiles.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
        ))}
      </div>
    </div>
  );
}
