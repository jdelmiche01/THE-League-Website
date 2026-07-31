// scripts/sync-fantrax.mjs
//
// Pulls standings from your Fantrax league and writes it into
// /data/standings.json, which the site reads from.
//
// This uses Fantrax's public "FXEA" endpoints, which are simple, no-login
// GET requests. They only work if your league is set to PUBLIC
// (Commissioner -> League Setup -> Misc -> Misc -> "League visible to
// public").
//
// Fantrax does NOT have a public endpoint for transactions, a trade log, or
// team owner names, so transactions.json and the "owner" column stay
// manually edited — same as the trade block and news already are.
//
// Usage:
//   FANTRAX_LEAGUE_ID=your-league-id node scripts/sync-fantrax.mjs

import fs from "fs";
import path from "path";

const LEAGUE_ID = process.env.FANTRAX_LEAGUE_ID;
const DATA_DIR = path.join(process.cwd(), "data");

if (!LEAGUE_ID) {
  console.error(
    "Missing FANTRAX_LEAGUE_ID. Set it as an environment variable (see data/league.json for where you found it in your Fantrax URL)."
  );
  process.exit(1);
}

async function fxeaGet(endpoint, params = {}) {
  const url = new URL(`https://www.fantrax.com/fxea/general/${endpoint}`);
  url.searchParams.set("leagueId", LEAGUE_ID);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`Fantrax request failed (${endpoint}): ${res.status}`);
  }

  return res.json();
}

async function syncStandings() {
  const raw = await fxeaGet("getStandings");
  const rows = Array.isArray(raw) ? raw : raw?.standings ?? [];

  // Try to preserve any owner names you've filled in by hand previously,
  // since Fantrax's public data doesn't include them.
  const existingPath = path.join(DATA_DIR, "standings.json");
  let existingByTeam = {};
  if (fs.existsSync(existingPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(existingPath, "utf8"));
      existingByTeam = Object.fromEntries(
        (existing.teams ?? []).map((t) => [t.team, t])
      );
    } catch {
      // ignore, start fresh
    }
  }

  const teams = rows
    .sort((a, b) => a.rank - b.rank)
    .map((row) => {
      const [wins, losses, ties] = (row.points ?? "0-0-0")
        .split("-")
        .map((n) => Number(n) || 0);

      return {
        rank: row.rank,
        team: row.teamName,
        owner: existingByTeam[row.teamName]?.owner ?? "",
        wins,
        losses,
        ties,
        pointsFor: Number(row.totalPointsFor ?? 0),
        streak: existingByTeam[row.teamName]?.streak ?? "-",
      };
    });

  writeJson("standings.json", { asOf: today(), teams });
}

function writeJson(filename, contents) {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(contents, null, 2) + "\n");
  console.log(`Wrote ${filePath}`);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  console.log(`Syncing Fantrax league ${LEAGUE_ID}...`);

  await syncStandings().catch((err) =>
    console.error("Standings sync failed:", err.message)
  );

  // Clean up the debug file from earlier, if it's still there.
  const debugPath = path.join(DATA_DIR, "standings.debug.json");
  if (fs.existsSync(debugPath)) fs.unlinkSync(debugPath);

  // Update the "last synced" timestamp shown in the site footer.
  const leagueConfigPath = path.join(DATA_DIR, "league.json");
  const leagueConfig = JSON.parse(fs.readFileSync(leagueConfigPath, "utf8"));
  leagueConfig.lastSynced = new Date().toISOString();
  fs.writeFileSync(leagueConfigPath, JSON.stringify(leagueConfig, null, 2) + "\n");

  console.log("Sync complete.");
}

main();
