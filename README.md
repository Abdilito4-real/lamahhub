LAMAH HUB — Local Development

Quick setup

1. Install dependencies

```bash
npm install
```

2. Create environment variables

Copy `.env.example` to `.env.local` and fill in your Paystack keys and site URL:

- `PAYSTACK_SECRET_KEY` — your Paystack secret (server-side).
- `NEXT_PUBLIC_APP_URL` — your local or production site origin (used for callback URLs).

Also add Supabase configuration for database and auth:

- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL (e.g. `https://xxxx.supabase.co`).
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the public anon key for client-side features.
- `SUPABASE_URL` — (optional) same as `NEXT_PUBLIC_SUPABASE_URL` for server usage.
- `SUPABASE_SERVICE_ROLE_KEY` — the service role key for server-side API routes (keep this secret).

Admin setup

- Create an `admins` table in Supabase with at least: `id`, `user_id` (auth user id), `email`.
- Add your admin user's `user_id` or `email` to that table so the app recognizes them as an admin.

3. Start dev server

```bash
npm run dev
```

Paystack webhook (recommended for reliable confirmations)

- Register a webhook URL in your Paystack dashboard: `https://<your-site>/api/paystack/webhook`
- For local development, use a tunnel tool like `ngrok` and register the tunnel URL (e.g. `https://abc123.ngrok.io/api/paystack/webhook`).
- Ensure `PAYSTACK_SECRET_KEY` in your env matches the key used for signature verification.

Testing payments

- Use Paystack test keys and test card `4084084084084081`.
- After payment completes, Paystack will redirect to `/payment/callback?reference=...` where the app verifies the transaction and stores the submission.
- If webhooks are configured, the webhook handler will also upsert the payment and generate a QR (server-side) for admin verification.

Admin dashboard

- Log in as admin (if applicable) and view the dashboard. The new "Submissions" table shows recent confirmed payments and provides a QR preview (if available).

Notes

- This project uses file-based storage under `data/*.json` for prototypes. For production use, migrate to a proper database to avoid races and ensure durability.
- Keep `PAYSTACK_SECRET_KEY` secret. Do not commit real secret keys to source control.
