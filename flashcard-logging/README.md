# Flashcard usage logging

The Stats flashcards page (`articles/stats-ch1-flashcards.html`) logs, for
every visitor: how long they spent on the page, which cards they saw, how
long on each card, and whether they flipped it.

This site is static (GitHub Pages) — a page loaded in a student's browser
has no access to your filesystem at all, so the logs can't be written
directly into this repo from their visit. Instead, the page sends one
beacon per visit to a small Google Sheet (via a free Apps Script Web App)
that you own, and `pull-logs.sh` downloads that Sheet into local CSVs here
whenever you want.

Nothing identifies a student by name — just a random per-browser ID
(stored in that browser's `localStorage`) so repeat visits from the same
device link together.

## One-time setup (~5 minutes)

1. Create a new Google Sheet (sheets.new). Copy its ID from the URL:
   `https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`
2. Go to [script.google.com](https://script.google.com) → New project.
   Delete the placeholder code and paste in `apps-script.gs` from this
   folder. Replace `SHEET_ID` near the top with the ID from step 1.
3. Deploy → New deployment → type: **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click Deploy, approve the permissions prompt (it's your own script
   touching your own Sheet), then copy the Web app URL — it ends in
   `/exec`.
5. Open `articles/stats-ch1-flashcards.html`, find `LOG_ENDPOINT` near
   the top of the main `<script>` block, and paste that URL in.
6. In the Sheet: **Share** → change "General access" to **Anyone with
   the link / Viewer**. This only lets `pull-logs.sh` *read* it with no
   credentials — nobody can edit it this way.
7. In `pull-logs.sh`, paste the same Sheet ID into `SHEET_ID`. After the
   first real submission arrives, open the Sheet, click the "Cards" tab,
   and copy the number after `#gid=` in the URL into `CARDS_GID`.
8. Commit and push the `LOG_ENDPOINT` change.

## Pulling a local CSV

Once some sessions have logged in:

```sh
./flashcard-logging/pull-logs.sh
```

This writes `flashcard-sessions.csv` (one row per visit) and
`flashcard-logs.csv` (one row per card seen) to the repo root. Re-run it
anytime to refresh — it overwrites the previous files.

## What gets logged

**Sessions** — one row per visit: `sessionId`, `uid` (anonymous,
per-browser), `startedAt`, `durationSeconds` (total time on the page),
`cardsViewed` (count).

**Cards** — one row per card a visitor stopped on: `sessionId`, `uid`,
`section` (e.g. `"1.4"`), `type` (`"term"` or `"apply"`), `question` (the
card's front text), `secondsSpent`, `flipped` (did they click to see the
answer).

A visit only logs once it ends (the beacon fires on page close/navigate
away), so nothing is sent for a page that's merely open.
