import {
  getArtIndex,
  getFilmIndex,
  getHistoryIndex,
  getIndex,
  getQuoteIndex,
} from "@/lib/data";
import { TodayDesk } from "@/components/TodayDesk";

function formatDateline(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Home() {
  const news = getIndex()[0];
  const art = getArtIndex()[0];
  const film = getFilmIndex()[0];
  const quote = getQuoteIndex()[0];
  const history = getHistoryIndex()[0];

  if (!news && !art && !film && !quote && !history) {
    return (
      <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
        Nothing on the desk yet — the daily pipelines will leave the first
        pages soon.
      </p>
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-17rem)] flex-col justify-center lg:relative lg:left-1/2 lg:w-[min(calc(100vw-3rem),64rem)] lg:-translate-x-1/2">
      <TodayDesk
        news={news}
        art={art}
        film={film}
        quote={quote}
        history={history}
        dateline={news ? formatDateline(news.date) : undefined}
      />
    </div>
  );
}
