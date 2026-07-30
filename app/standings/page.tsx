import PageHeader from "@/components/PageHeader";
import standings from "@/data/standings.json";
import leagueConfig from "@/data/league.json";

export const metadata = { title: "Standings" };

export default function StandingsPage() {
  const playoffLine = leagueConfig.playoffTeams;

  return (
    <div>
      <PageHeader
        eyebrow="Standings"
        title="League Standings"
        description={`As of ${standings.asOf}. Top ${playoffLine} make the playoffs.`}
      />

      <div className="border border-line rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-accent-soft text-mute">
            <tr>
              <th className="text-left font-medium px-4 py-3 w-10">#</th>
              <th className="text-left font-medium px-4 py-3">Team</th>
              <th className="text-left font-medium px-4 py-3 hidden sm:table-cell">Owner</th>
              <th className="text-right font-medium px-4 py-3 font-mono">W</th>
              <th className="text-right font-medium px-4 py-3 font-mono">L</th>
              <th className="text-right font-medium px-4 py-3 font-mono">PF</th>
              <th className="text-right font-medium px-4 py-3 font-mono">Streak</th>
            </tr>
          </thead>
          <tbody>
            {standings.teams.map((t) => (
              <tr
                key={t.rank}
                className={`border-t border-line ${
                  t.rank === playoffLine ? "border-b-2 border-b-accent" : ""
                }`}
              >
                <td className="px-4 py-3 font-mono text-mute">{t.rank}</td>
                <td className="px-4 py-3 font-medium">{t.team}</td>
                <td className="px-4 py-3 text-mute hidden sm:table-cell">{t.owner}</td>
                <td className="px-4 py-3 text-right font-mono">{t.wins}</td>
                <td className="px-4 py-3 text-right font-mono">{t.losses}</td>
                <td className="px-4 py-3 text-right font-mono">{t.pointsFor}</td>
                <td
                  className={`px-4 py-3 text-right font-mono ${
                    t.streak.startsWith("W") ? "text-accent" : "text-mute"
                  }`}
                >
                  {t.streak}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-mute font-mono">
        Purple line marks the current playoff cutoff.
      </p>
    </div>
  );
}
