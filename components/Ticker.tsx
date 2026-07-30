import scores from "@/data/scores.json";
import transactions from "@/data/transactions.json";

function buildItems(): string[] {
  const items: string[] = [];

  scores.matchups?.slice(0, 6).forEach((m: any) => {
    items.push(
      `${m.teamA.name} ${m.teamA.score} — ${m.teamB.score} ${m.teamB.name}`
    );
  });

  transactions.slice(0, 6).forEach((t: any) => {
    items.push(`${t.team} ${t.type.toUpperCase()} ${t.player}`);
  });

  if (items.length === 0) {
    items.push("Sync your Fantrax league to populate this ticker");
  }

  return items;
}

export default function Ticker() {
  const items = buildItems();
  // duplicate the list so the CSS animation can loop seamlessly
  const looped = [...items, ...items];

  return (
    <div className="bg-ink text-paper overflow-hidden" aria-hidden="false">
      <div className="ticker-track py-2">
        {looped.map((item, i) => (
          <span
            key={i}
            className="flex items-center whitespace-nowrap font-mono text-xs sm:text-sm px-4"
          >
            {item}
            <span className="mx-4 h-1 w-1 rounded-full bg-accent inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}
