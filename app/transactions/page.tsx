import PageHeader from "@/components/PageHeader";
import transactions from "@/data/transactions.json";

export const metadata = { title: "Transactions" };

const typeStyles: Record<string, string> = {
  add: "text-accent",
  drop: "text-mute",
  trade: "text-ink font-semibold",
};

export default function TransactionsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Transactions"
        title="Recent Moves"
        description="Adds, drops, and trades across the league, most recent first."
      />

      <ol className="border border-line rounded-lg overflow-hidden">
        {transactions.map((t, i) => (
          <li
            key={i}
            className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-4 py-3 ${
              i !== 0 ? "border-t border-line" : ""
            }`}
          >
            <span className="font-mono text-xs text-mute w-24 shrink-0">
              {t.date}
            </span>
            <span
              className={`font-mono text-xs uppercase w-14 shrink-0 ${typeStyles[t.type] ?? ""}`}
            >
              {t.type}
            </span>
            <span className="font-medium w-44 shrink-0">{t.team}</span>
            <span className="text-mute">{t.player}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
