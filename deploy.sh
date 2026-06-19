#!/bin/bash
cd ~/Desktop/Klaar
git add \
  klaar-shared.css \
  api/demo-chat.js \
  dashboard/index.html \
  01-recept-studio/klaar-recept-studio.html \
  02-allergenenkaart/klaar-allergenenkaart.html \
  03-haccp/klaar-haccp.html \
  04-kostprijs/klaar-kostprijs.html \
  07-leveranciers/klaar-leveranciers.html \
  08-scanner/klaar-scanner.html \
  10-catering-events/klaar-catering.html \
  tests/klaar-ai-test.html \
  KLAAR-BUGREPORT-2026-06-16.md \
  KLAAR-BUGREPORT-2026-06-17.md \
  index.html klaar-client.js vercel.json package.json \
  deploy.sh
git commit -m "design: klaar-shared.css — Inter font, DM Mono alleen voor data, font-sizes omhoog, emoji cleanup knoppen/tabs; bot: alle modules haiku→sonnet-4-6; fix M10: chat widget zat fout in printvenster (niet op pagina), volledig herbouwd als werkende AI-assistent; fix M10: openPrintWindow clean (21K orphan code verwijderd); prev: bugs signalen 16+17-06"
git push
echo ""
echo "Klaar! Vercel bouwt nu automatisch (1-2 min)."
echo "Live op: https://www.getklaar.app"
