#!/usr/bin/env bash
# Downloads the flashcard usage logs from the Google Sheet into two local
# CSV files at the repo root. Re-run anytime to refresh (overwrites the
# previous files). Requires no auth — the Sheet must be shared as "Anyone
# with the link: Viewer" (see README.md).
set -euo pipefail

SHEET_ID="1cyKKqMQkms_YAN8H3pv3EHTvElAHWO9a-Ox-l2KJswM"

# Apps Script creates "Sessions" first (usually gid=0) and "Cards" second.
# If a downloaded file has the wrong tab's data, open the Sheet, click the
# tab you want, and copy the number after "#gid=" in the URL into the
# matching variable below.
SESSIONS_GID="1985929930"
CARDS_GID="97437119"

cd "$(dirname "$0")/.."

curl -sL "https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SESSIONS_GID}" -o flashcard-sessions.csv
curl -sL "https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${CARDS_GID}" -o flashcard-logs.csv

echo "Wrote flashcard-sessions.csv and flashcard-logs.csv"
