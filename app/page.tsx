import Link from "next/link";
import standings from "@/data/standings.json";
import scores from "@/data/scores.json";
import { getAllNews } from "@/lib/news";
import leagueConfig from "@/data/league.json";

export default function Home() {
  const topFive = standings.teams.slice(0, 5);
  const latestNews = getAllNews().slice(0, 2);
  const week = scores.week;

  return (
    <div>
      <section className="mb-14">
        <p className="font-mono text-xs uppercase tracking-widest text-accent mb-2">
          {leagueConfig.season} Season &middot; Week {week}
        </p>
        <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tightest max-w-2xl">
          {leagueConfig.leagueName}
        </h1>
        <p className="mt-4 text-mute max-w-xl">
          Standings, scoring, the playoff race, transactions, and everything
          else you need to keep tabs on the league — in one place.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display font-bold text-xl">Standings</h2>
            <Link href="/standings" className="text-sm text-accent hover:underline">
              Full standings &rarr;
            </Link>
          </div>
          <div className="border border-line rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-accent-soft text-mute">
                <tr>
                  <th className="text-left font-medium px-4 py-2 w-10">#</th>
                  <th className="text-left font-medium px-4 py-2">Team</th>
                  <th className="text-right font-medium px-4 py-2 font-mono">W-L</th>
                  <th className="text-right font-medium px-4 py-2 font-mono">PF</th>
                </tr>
              </thead>
              <tbody>
                {topFive.map((t) => (
                  <tr key={t.rank} className="border-t border-line">
                    <td className="px-4 py-2.5 font-mono text-mute">{t.rank}</td>
                    <td className="px-4 py-2.5 font-medium">{t.team}</td>
                    <td className="px-4 py-2.5 text-right font-mono">
                      {t.wins}-{t.losses}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono">{t.pointsFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display font-bold text-xl">Latest News</h2>
            <Link href="/news" className="text-sm text-accent hover:underline">
              All news &rarr;
            </Link>
          </div>
          <div className="space-y-4">
            {latestNews.map((post) => (
              <Link
                key={post.slug}
                href={`/news/${post.slug}`}
                className="block border border-line rounded-lg p-4 hover:border-accent transition-colors"
              >
                <p className="font-mono text-xs text-mute mb-1">{post.date}</p>
                <h3 className="font-display font-bold text-base leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-mute mt-1 line-clamp-2">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
