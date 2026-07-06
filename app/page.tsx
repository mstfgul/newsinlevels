import {
  getArtIndex,
  getFilmIndex,
  getHistoryIndex,
  getIndex,
  getQuoteIndex,
} from "@/lib/data";
import { TodayDesk } from "@/components/TodayDesk";
import { Highlight } from "@/components/PageIntro";

function formatDateline(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Home() {
  const news = getIndex().slice(0, 2);
  const art = getArtIndex().slice(0, 2);
  const film = getFilmIndex().slice(0, 2);
  const quote = getQuoteIndex().slice(0, 2);
  const history = getHistoryIndex().slice(0, 2);

  if (!news.length && !art.length && !film.length && !quote.length && !history.length) {
    return (
      <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
        Nothing on the desk yet — the daily pipelines will leave the first
        pages soon.
      </p>
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-17rem)] flex-col justify-center lg:relative lg:left-1/2 lg:w-[min(calc(100vw-3rem),64rem)] lg:-translate-x-1/2">
      {/* What this place is, jotted at the top of the page in pencil. */}
      <p
        className="hand-note mx-auto mb-9 max-w-md rotate-[-0.6deg] text-center lg:max-w-none"
        style={{ fontSize: "1.45rem" }}
      >
        real news, art, film &amp; history — every day, rewritten{" "}
        <Highlight>at your level</Highlight>, from A1 to C2
      </p>
      <TodayDesk
        news={news}
        art={art}
        film={film}
        quote={quote}
        history={history}
        dateline={news[0] ? formatDateline(news[0].date) : undefined}
      />
    </div>
  );
}
