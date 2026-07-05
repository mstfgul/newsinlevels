import { getArticle, getIndex } from "@/lib/data";
import { HomeHero } from "@/components/HomeHero";
import { StoryList } from "@/components/StoryList";

function formatDateline(date: string): string {
  return new Date(`${date}T12:00:00Z`)
    .toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
}

export default function Home() {
  const entries = getIndex();

  if (entries.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
        No articles yet — the daily pipeline will add them soon.
      </p>
    );
  }

  const [lead, ...rest] = entries;
  const leadArticle = getArticle(lead.id);

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {formatDateline(lead.date)}
        </p>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {entries.length} {entries.length === 1 ? "story" : "stories"}
        </p>
      </div>

      <HomeHero article={leadArticle} />

      {rest.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Earlier stories
          </h2>
          <StoryList entries={rest} />
        </section>
      )}
    </div>
  );
}
