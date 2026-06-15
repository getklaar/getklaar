#!/bin/bash
cd ~/Desktop/Klaar
git add \
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
  index.html klaar-client.js vercel.json package.json \
  deploy.sh
git commit -m "fix: batch-scaler recepten + prijsalert banner + empty states + pre-service checklist + allergeenmatrix — Module 01: ×½/×2/×3/×5 scaler voor ingrediënthoeveelheden; Module 07: persistente prijsstijgingsbanner (oranje, dismissable), modal na koppelmodal; Module 04: empty state met directe links naar Recept Studio + Leveranciers; Module 02: A4 kruistabel export + live bediening-tab; Module 10: pre-service checklist + notities op keukensheet; Test: max 75 woorden"
git push
echo ""
echo "Klaar! Vercel bouwt nu automatisch (1-2 min)."
echo "Live op: https://www.getklaar.app"
