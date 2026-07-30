import PageHeader from "@/components/PageHeader";
import tradeblock from "@/data/tradeblock.json";

export const metadata = { title: "Trade Block" };

export default function TradeBlockPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Trade Block"
        title="On the Block"
        description="Players and picks teams are actively shopping. Managed by your league, not pulled from Fantrax — edit data/tradeblock.json to update it."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {tradeblock.map((entry, i) => (
          <div key={i} className="border border-line rounded-lg p-5">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="font-display font-bold text-lg">{entry.team}</h3>
              <span className="text-xs text-mute">{entry.owner}</span>
            </div>

            <p className="text-xs font-mono uppercase tracking-wide text-accent mb-1">
              Listed
            </p>
            <ul className="mb-4 space-y-1">
              {entry.listed.map((p, j) => (
                <li key={j} className="text-sm">
                  {p}
                </li>
              ))}
            </ul>

            <p className="text-xs font-mono uppercase tracking-wide text-mute mb-1">
              Seeking
            </p>
            <p className="text-sm">{entry.seeking}</p>

            {entry.note && (
              <p className="text-sm text-mute mt-3 border-t border-line pt-3">
                {entry.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
