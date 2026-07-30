import leagueConfig from "@/data/league.json";

export default function Footer() {
  const synced = new Date(leagueConfig.lastSynced);

  return (
    <footer className="border-t border-line mt-16">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm text-mute">
        <p>
          {leagueConfig.leagueName} &middot; {leagueConfig.season} Season
        </p>
        <p className="font-mono text-xs">
          Data last synced{" "}
          {synced.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      </div>
    </footer>
  );
}
