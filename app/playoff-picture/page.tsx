import PageHeader from "@/components/PageHeader";
import playoffs from "@/data/playoffs.json";

export const metadata = { title: "Playoff Picture" };

const statusStyles: Record<string, string> = {
  clinched: "bg-accent text-paper",
  in: "bg-accent-soft text-accent border border-accent-line",
  "on the bubble": "bg-white text-mute border border-line",
  eliminated: "bg-white text-mute border border-line line-through",
};

export default function PlayoffPicturePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Playoff Picture"
        title="Who's In, Who's Out"
        description={`${playoffs.weeksRemaining} weeks remain. Top ${playoffs.playoffTeams} make the playoffs.`}
      />

      <div className="border border-line rounded-lg overflow-hidden mb-10">
        <ul>
          {playoffs.seeds.map((s) => (
            <li
              key={s.seed}
              className={`flex items-center justify-between px-4 py-3 ${
                s.seed !== 1 ? "border-t border-line" : ""
              } ${
                s.seed === playoffs.playoffTeams
                  ? "border-b-2 border-b-accent"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-mute w-6">{s.seed}</span>
                <span className="font-medium">{s.team}</span>
              </div>
              <span
                className={`text-xs font-mono px-2 py-1 rounded-full ${statusStyles[s.status] ?? "text-mute"}`}
              >
                {s.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <section>
        <h2 className="font-display font-bold text-xl mb-4">
          Clinching Scenarios
        </h2>
        <ul className="space-y-3">
          {playoffs.scenarios.map((s, i) => (
            <li
              key={i}
              className="flex gap-3 text-sm border-l-2 border-accent pl-4"
            >
              {s}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
