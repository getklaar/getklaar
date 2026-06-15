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
git commit -m "feat: intelligente scan→koppel→recept flow + Marco testklant upgrade — inline koppeling-kolom in factuurreview, volledige bibliotheek in AI-recept-prompt, libId-koppeling na SAVE_RECIPE, Marco persona diverser (eerste-bezoek energie, anti-herhaling, toonvariatie), 2 nieuwe test-scenarios (eerste verkenning + AI-recept), pijnboompitten-herhaling eruit"
git push
echo ""
echo "Klaar! Vercel bouwt nu automatisch (1-2 min)."
echo "Live op: https://www.getklaar.app"
