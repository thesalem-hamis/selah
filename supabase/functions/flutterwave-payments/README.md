# Flutterwave payments

Deploy the `flutterwave-payments` Supabase Edge Function and set these secrets for the function:

- `FLW_SECRET_KEY`: Flutterwave secret API key. Never expose it in browser variables.
- `FLW_WEBHOOK_HASH`: the webhook secret hash configured in the Flutterwave dashboard.
- `SITE_URL`: the production website origin, such as `https://shop.example.com`.
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`: supplied by Supabase for Edge Functions.

In the Flutterwave dashboard, register this webhook URL:
`https://<project-ref>.supabase.co/functions/v1/flutterwave-payments`

The function verifies each callback and webhook against Flutterwave before marking an order paid. A successful database update then awards purchase points. Apply the rewards migration before enabling checkout so the order and reward tables are ready.

Checkout payments are charged and verified in GBP, matching the storefront totals.