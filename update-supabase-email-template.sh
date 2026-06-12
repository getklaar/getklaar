#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# Klaar — Supabase email template updater
#
# Gebruik:
#   1. Genereer een Personal Access Token op:
#      https://supabase.com/dashboard/account/tokens
#
#   2. Voer dit script uit:
#      bash update-supabase-email-template.sh <jouw-token>
#
# Wat dit doet:
#   Voegt {{ .Token }} toe aan de "Magic link or OTP" email template
#   zodat gebruikers de 6-cijferige code te zien krijgen.
# ═══════════════════════════════════════════════════════════════════

TOKEN="$1"
PROJECT_REF="imiqoxsjdynliydsuihc"

if [ -z "$TOKEN" ]; then
  echo "Gebruik: bash update-supabase-email-template.sh <personal-access-token>"
  echo ""
  echo "Genereer een token op: https://supabase.com/dashboard/account/tokens"
  exit 1
fi

SUBJECT="Jouw inlogcode voor Klaar"

BODY='<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f6f4f0;">
  <p style="font-family:monospace;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#999;margin:0 0 24px;">KLAAR</p>
  <h2 style="font-size:22px;margin:0 0 12px;color:#1a1a1a;">Jouw inlogcode</h2>
  <p style="color:#555;margin:0 0 24px;">Gebruik de onderstaande code om in te loggen op Klaar. De code verloopt na 1 uur.</p>
  <div style="background:#fff;border:1px solid #e2ddd6;padding:20px 24px;margin:0 0 24px;text-align:center;">
    <span style="font-family:monospace;font-size:36px;letter-spacing:12px;font-weight:700;color:#1a1a1a;">{{ .Token }}</span>
  </div>
  <p style="color:#999;font-size:12px;margin:0 0 16px;">Of klik op de link hieronder om direct in te loggen:</p>
  <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#e8ff47;color:#0a0a0a;padding:10px 20px;font-family:monospace;font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;text-decoration:none;">Inloggen via link</a>
  <p style="color:#ccc;font-size:11px;margin:24px 0 0;">Deze code en link zijn eenmalig bruikbaar.</p>
</div>'

echo "Template updaten voor project: $PROJECT_REF ..."

RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH \
  "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"mailer_templates_magic_link_subject\": \"$SUBJECT\",
    \"mailer_templates_magic_link_content\": $(echo "$BODY" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')
  }")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY_RESP=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
  echo "✓ Template succesvol bijgewerkt!"
  echo ""
  echo "Gebruikers ontvangen nu een email met:"
  echo "  - Een 6-cijferige code ({{ .Token }})"
  echo "  - Een directe inloglink als backup"
else
  echo "✗ Fout (HTTP $HTTP_CODE):"
  echo "$BODY_RESP"
  echo ""
  echo "Controleer of je token geldig is en de juiste rechten heeft."
fi
