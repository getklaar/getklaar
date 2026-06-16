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
git commit -m "fix: persona-tests (4x) + KLAAR_PROMPT multi-device beperking + sub-recipe gap; KLAAR_PROMPT: localStorage single-device waarschuwing toegevoegd, recept-in-recept beperking gedocumenteerd, alle Marco-refs verwijderd uit antwoordregels; sim-bevindingen: Reza/Silke/Dante/Fatou — EDI geen ondersteuning, batch-kostprijs workaround, allergen niet per event filterbaar (eerlijk gedocumenteerd)"
git push
echo ""
echo "Klaar! Vercel bouwt nu automatisch (1-2 min)."
echo "Live op: https://www.getklaar.app"
