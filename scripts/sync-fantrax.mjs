// scripts/sync-fantrax.mjs
//
// Pulls standings from your Fantrax league and writes it into
// /data/standings.json, which the site reads from.
//
// IMPORTANT — read this before running:
// This uses Fantrax's public "FXEA" endpoints, which are simple, no-login
// GET requests. They only work if your league is set to PUBLIC
// (Commissioner -> League Setup -> Misc -> Misc -> "League visible to
// public"). This is a different, more reliable approach than an earlier
// version of this script used.
//
// Fantrax does NOT have a public endpoint for transactions or a trade log,
// so transactions.json stays manually edited for now — same as the trade
// block and news already are.
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
  const [standings, leagueInfo] = await Promise.all([
    fxeaGet("getStandings"),
    fxeaGet("getLeagueInfo"),
  ]);

  // TEMPORARY DEBUG LOGGING — once we confirm the real field names from
  // these two endpoints, this logging and the fallback mapping below get
  // replaced with the correct field names and this block gets deleted.
  console.log("--- RAW getStandings RESPONSE (debug) ---");
  console.log(JSON.stringify(standings ?? "NO RESPONSE BODY", null, 2).slice(0, 3000));
  console.log("--- RAW getLeagueInfo RESPONSE (debug) ---");
  console.log(JSON.stringify(leagueInfo ?? "NO RESPONSE BODY", null, 2).slice(0, 2000));
  console.log("--- END DEBUG ---");

  writeJson("standings.debug.json", { standings, leagueInfo });
}

function writeJson(filename, contents) {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(contents, null, 2) + "\n");
  console.log(`Wrote ${filePath}`);
}

async function main() {
  console.log(`Syncing Fantrax league ${LEAGUE_ID}...`);

  await syncStandings().catch((err) =>
    console.error("Standings sync failed:", err.message)
  );

  // Update the "last synced" timestamp shown in the site footer.
  const leagueConfigPath = path.join(DATA_DIR, "league.json");
  const leagueConfig = JSON.parse(fs.readFileSync(leagueConfigPath, "utf8"));
  leagueConfig.lastSynced = new Date().toISOString();
  fs.writeFileSync(leagueConfigPath, JSON.stringify(leagueConfig, null, 2) + "\n");

  console.log("Sync complete.");
}

main();
