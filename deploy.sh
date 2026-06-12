#!/bin/bash
# ─────────────────────────────────────────────
#  KLAAR DEPLOY — stuur wijzigingen naar live
# ─────────────────────────────────────────────
set -e

cd "$(dirname "$0")"

echo ""
echo "🚀 Klaar Deploy"
echo "───────────────"

# Check of er iets te committen is
if git diff --quiet && git diff --staged --quiet; then
  echo "✓ Geen lokale wijzigingen om te committen"
else
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
  git add -A
  git commit -m "deploy: $TIMESTAMP"
  echo "✓ Commit aangemaakt: $TIMESTAMP"
fi

# Push naar GitHub (force: lokale versie is leidend)
# -c credential.helper= forceert gebruik van token in remote URL, niet Keychain
echo "⬆  Pushen naar GitHub..."
git -c credential.helper= push --force origin main

echo ""
echo "✅ Live! Vercel deployt automatisch."
echo "   Check: https://getklaar.app (± 30 sec)"
echo ""
