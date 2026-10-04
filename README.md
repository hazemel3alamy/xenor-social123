# XENOR Social Hub

Production-oriented Cloudflare Worker + D1 package for XENOR.

## Included
- Account registration/login and sessions
- Profiles and user search
- Friend requests: send/accept/reject/cancel
- Follow/unfollow and blocking
- Posts, likes, comments, shares
- Stories and Reels
- Direct messages and notifications
- Market, Academy, Services and Orders
- Reports and admin APIs
- PWA manifest/icon
- Optional R2 media upload endpoint

## Cloudflare setup
This repository is intentionally free of account IDs, passwords, tokens, and secrets.

1. Create a D1 database in your Cloudflare account.
2. Put its real database ID into `wrangler.toml` under `database_id`.
3. Execute `schema.sql` against the remote D1 database.
4. If you want real image/video uploads, create an R2 bucket and enable the R2 block in `wrangler.toml`.
5. Deploy with `npx wrangler deploy`.
6. Verify `/api/health` returns `database:true`.

See `DEPLOY.txt` for the exact checklist.

## Important
`wrangler.toml` contains the placeholder `DATABASE_ID` on purpose. It must be replaced with the D1 database ID from your own Cloudflare account; do not commit credentials or secrets.
