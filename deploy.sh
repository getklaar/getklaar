#!/bin/bash
cd ~/Desktop/Klaar
git add index.html api/demo-chat.js
git commit -m "feat: dashboard redesign - module cards hover reveal, bigger titles, AI action banner"
git push
echo ""
echo "Klaar! Vercel bouwt nu automatisch (1-2 min)."
echo "Ga daarna naar: https://vercel.com/getklaar-s-projects/getklaar/settings/environment-variables"
echo "Voeg toe: ANTHROPIC_API_KEY = (zie KLAAR-API-KEYS.md)"
