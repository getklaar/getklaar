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
  tests/klaar-ai-test.html \
  index.html klaar-client.js vercel.json package.json \
  deploy.sh
git commit -m "feat: allergeenmatrix export + live bediening tab + pre-service checklist + woordlimiet fix — Module 02: A4 kruistabel export (14 allergenen × gerechten, printklaar), live bediening-tab met zoekfunctie op naam/allergen/vrij-van (mobilevriendelijk); Module 10: pre-service checklist met verplichte checks, notities meeprinten op keukensheet; Test: KLAAR_PROMPT max 75 woorden (was 120), maxTokens 350 (was 500), AI mag nooit 'kan niet' zonder alternatief"
git push
echo ""
echo "Klaar! Vercel bouwt nu automatisch (1-2 min)."
echo "Live op: https://www.getklaar.app"
