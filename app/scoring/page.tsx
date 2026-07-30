import PageHeader from "@/components/PageHeader";
import scores from "@/data/scores.json";

export const metadata = { title: "Scoring" };

export default function ScoringPage() {
  return (
    <div>
      <PageHeader
        eyebrow={`Week ${scores.week}`}
        title="Scoring"
        description={`Matchup results as of ${scores.asOf}.`}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {scores.matchups.map((m, i) => {
          const aWins = m.teamA.score > m.teamB.score;
          const bWins = m.teamB.score > m.teamA.score;
          return (
            <div key={i} className="border border-line rounded-lg p-5">
              <div className="flex items-center justify-between">
                <span className={`font-medium ${aWins ? "text-ink" : "text-mute"}`}>
                  {m.teamA.name}
                </span>
                <span className={`font-mono text-lg ${aWins ? "text-accent" : "text-mute"}`}>
                  {m.teamA.score.toFixed(1)}
                </span>
              </div>
              <div className="my-2 border-t border-dashed border-line" />
              <div className="flex items-center justify-between">
                <span className={`font-medium ${bWins ? "text-ink" : "text-mute"}`}>
                  {m.teamB.name}
                </span>
                <span className={`font-mono text-lg ${bWins ? "text-accent" : "text-mute"}`}>
                  {m.teamB.score.toFixed(1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
