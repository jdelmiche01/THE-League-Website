// scripts/sync-fantrax.mjs
//
// Pulls standings, scores, and transactions from your Fantrax league and
// writes them into the /data/*.json files the site reads from.
//
// IMPORTANT — read this before running:
// Fantrax doesn't publish an official, documented API for league standings
// and transactions. This script talks to the same internal endpoint
// ("fxpa/req") that Fantrax's own website uses in your browser, and that the
// community library https://fantraxapi.kometa.wiki relies on. It only works
// reliably if:
//   1. Your league is set to PUBLIC (Commissioner -> League Setup -> Misc ->
//      Misc -> "League visible to public"), and
//   2. Fantrax hasn't changed the shape of that internal endpoint.
//
// If this script ever starts failing, that's almost certainly why — check
// fantraxapi.kometa.wiki for the current field names, or fall back to
// updating the JSON files in /data by hand (they're plain, readable JSON).
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

const FXPA_URL = "https://www.fantrax.com/fxpa/req";

async function fxRequest(method, extra = {}) {
  const res = await fetch(FXPA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      msgs: [
        {
          method,
          data: { leagueId: LEAGUE_ID, ...extra },
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Fantrax request failed (${method}): ${res.status}`);
  }

  const json = await res.json();
  return json?.responses?.[0]?.data;
}

async function syncStandings() {
  const data = await fxRequest("getStandings");

  // TEMPORARY DEBUG LOGGING — once we see the real shape in the Action log,
  // this block and the fallback mapping below get replaced with the correct
  // field names and this can be deleted.
  console.log("--- RAW STANDINGS RESPONSE (debug) ---");
  console.log(JSON.stringify(data, null, 2).slice(0, 4000));
  console.log("--- END RAW STANDINGS RESPONSE ---");

  const teams = (data?.tableList?.[0]?.rows ?? []).map((row, i) => ({
    rank: i + 1,
    team: row.team?.name ?? row.teamName ?? "Unknown",
    owner: row.team?.owner ?? "",
    wins: Number(row.wins ?? 0),
    losses: Number(row.losses ?? 0),
    ties: Number(row.ties ?? 0),
    pointsFor: Number(row.pointsFor ?? 0),
    streak: row.streak ?? "-",
  }));

  writeJson("standings.json", { asOf: today(), teams });
}

async function syncTransactions() {
  const data = await fxRequest("getTransactionDetailsHistory");
  const transactions = (data?.transactions ?? []).slice(0, 25).map((t) => ({
    date: t.date ?? today(),
    team: t.teamName ?? "Unknown",
    type: (t.type ?? "add").toLowerCase(),
    player: t.playerName ?? t.description ?? "",
  }));

  writeJson("transactions.json", transactions);
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
  await syncTransactions().catch((err) =>
    console.error("Transactions sync failed:", err.message)
  );

  // Update the "last synced" timestamp shown in the site footer.
  const leagueConfigPath = path.join(DATA_DIR, "league.json");
  const leagueConfig = JSON.parse(fs.readFileSync(leagueConfigPath, "utf8"));
  leagueConfig.lastSynced = new Date().toISOString();
  fs.writeFileSync(leagueConfigPath, JSON.stringify(leagueConfig, null, 2) + "\n");

  console.log("Sync complete.");
}

main();
