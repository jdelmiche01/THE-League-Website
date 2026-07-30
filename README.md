# Fantasy League Hub

A website for your Fantrax fantasy baseball league: standings, scoring, the
playoff picture, transactions, a trade block, and news.

This README is written for someone who hasn't done this before. Follow it
top to bottom.

---

## Part 1 — Get the code onto GitHub

GitHub is just a place to store your website's code online. Vercel will
watch it and publish your site automatically every time it changes.

1. Go to [github.com](https://github.com) and create a free account (skip
   if you already have one).
2. Click the **+** in the top right → **New repository**.
3. Name it something like `fantasy-league-hub`. Keep it **Private** if you
   don't want strangers seeing it (totally fine — Vercel can still use a
   private repo). Click **Create repository**.
4. On the new repo's page, click **uploading an existing file** (or use the
   "Add file" button).
5. Drag this entire project folder's contents into that upload box, and
   click **Commit changes**.

That's it — your code is now on GitHub.

---

## Part 2 — Put it on the internet with Vercel

1. Go to [vercel.com](https://vercel.com) and sign up using the **"Continue
   with GitHub"** button — this links the two automatically.
2. Click **Add New... → Project**.
3. Find your `fantasy-league-hub` repo in the list and click **Import**.
4. Leave all the settings as they are (Vercel recognizes this as a Next.js
   project automatically) and click **Deploy**.
5. Wait about a minute. When it's done, Vercel gives you a live link like
   `fantasy-league-hub.vercel.app` — that's your website.

From now on, **every time you change a file on GitHub, Vercel rebuilds and
updates the live site automatically.** You never have to manually
"republish" anything.

**Want a real domain (like `thebigsleague.com`) instead of the vercel.app
one?** In your Vercel project, go to **Settings → Domains**, buy or add a
domain there, and follow the on-screen instructions. Takes about 10 minutes.

---

## Part 3 — Connect your Fantrax league

### Step 1: Make your league public

Automated syncing only works if Fantrax allows reading your league's data
without logging in. In Fantrax:

1. Go to your league → **Commissioner** → **League Setup** → **Misc** tab.
2. Find the setting for making the league **visible to the public** and
   turn it on. (This only makes read-only info like standings and
   transactions visible — it doesn't let anyone join or manage your team.)

### Step 2: Find your League ID

Open your league on Fantrax and look at the web address in your browser.
It'll look like:

```
https://www.fantrax.com/fantasy/league/8u34hf93jal20p1/home
                                       ^^^^^^^^^^^^^^^^
                                       this part is your League ID
```

### Step 3: Add it to the project

Open `data/league.json` in this project and replace
`"REPLACE_WITH_YOUR_LEAGUE_ID"` with your real League ID. Also fill in your
league name, commissioner name, etc. — those show up around the site.

### Step 4: Let the sync robot run automatically

This project comes with a small script (`scripts/sync-fantrax.mjs`) that
fetches fresh standings and transactions from Fantrax and a GitHub Action
(think of it as a robot on a timer) that runs it once a day and saves the
results.

To turn it on:

1. On GitHub, open your repo → **Settings → Secrets and variables →
   Actions**.
2. Click **New repository secret**.
3. Name it `FANTRAX_LEAGUE_ID` and paste in your League ID as the value.
   Save it.

That's the whole setup. Once a day, the robot fetches your league's latest
standings and transactions, saves them into the `data/` folder, and
GitHub/Vercel take care of the rest — your site updates itself.

**Want to test it right now instead of waiting a day?** Go to your repo's
**Actions** tab, click **Sync Fantrax Data** in the sidebar, then **Run
workflow**.

**A heads-up:** Fantrax doesn't officially support this kind of automated
reading — the script uses the same internal request the Fantrax website
itself makes. It works well in practice, but if Fantrax ever changes
something on their end and the sync starts failing, the simplest fix is
just editing the plain JSON files in `data/` by hand until it's sorted out.
Nothing will break — the site just keeps showing the last data it has.

---

## Part 4 — The two things Fantrax can't do for you

Fantrax has no concept of a "trade block" or "news articles" — those are
custom to your site, which means you manage them directly as simple files.
Editing a file on GitHub is easy even from your phone:

- **Trade Block:** open `data/tradeblock.json` on GitHub, click the pencil
  (edit) icon, update the listings, and commit. The site updates in about a
  minute.
- **News:** add a new file inside `content/news/`, following the pattern of
  the two example articles already there (a title/date/author at the top,
  then your article text below). Commit it, and it appears on the News page
  automatically.

---

## Running it on your own computer (optional)

If you want to preview changes before they go live:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Project structure, in brief

```
app/                 the pages (standings, scoring, playoff-picture, transactions, trade-block, news)
components/          shared pieces (nav bar, footer, the scrolling ticker)
data/                the JSON files that hold your league's info
content/news/         one markdown file per news article
scripts/sync-fantrax.mjs   the script that talks to Fantrax
.github/workflows/    the "robot on a timer" that runs the sync daily
```
