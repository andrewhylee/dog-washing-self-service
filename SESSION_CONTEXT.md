# Session Context — Fresh Paws Dog Wash

Handoff notes so a new session can resume work quickly. All known state is captured here.

## Project
- Next.js 16 static export (`output: "export"`) site for Fresh Paws self-serve dog wash, hosted on here.now.
- Site slug: `mystic-lagoon-2g3s`; live URL: **https://mystic-lagoon-2g3s.here.now** (booking page: `/book`)
- Publish config in `.herenow/state.json` (`auth_mode=authenticated`, `persistence=permanent`).
- Regenerate + republish flow after edits:
  ```
  npm run lint && npm run build
  /Users/drew/.claude/skills/here-now/scripts/publish.sh out --slug mystic-lagoon-2g3s --client opencode
  ```

## Live booking system (the main feature)
Two-collection architecture (owner explicitly wanted customer PII kept out of browser-accessible data):

- **`availability`** (`public/.herenow/data.json`, public read/write): only `date` + `time`, used for capacity counting. No PII.
- **`bookings`** (owner-only read/write via proxy): full PII (`first_name`, `last_name`, `pet_name`, `phone`, `email`) + `date`/`time`.
- **Capacity**: `TUB_CAPACITY = 2` tubs. Slots show state — `Full` / `1 spot left`, disabled when full.
- **16 half-hour slots** 9:00am–4:30pm; calendar pages current/next month.
- **Disabled dates**: `d <= today` (today is disabled) OR `d > lastDayOfNext`.
- **Phone validation**: `/^(\d{10}|\d{3}-\d{3}-\d{4})$/` — 10 digits, or 10 digits with hyphens (`5551234567` | `555-123-4567`). Inline `.field-error` message; confirm button disabled until valid.

### here.now manifests (must exist in `out/.herenow/` after build)
- `public/.herenow/data.json` — defines collections `bookings` (owner) and `availability` (public).
- `public/.herenow/proxy.json` — proxies:
  - `/api/bookings` → here.now owner API, header `${HERENOW_API_KEY}` (server-side only).
  - `/api/notify` → Discord webhook (real URL, no placeholders).
  - Uses top-level key `"proxies"` (NOT `"routes"`), `"method"` singular.
- Access/rate limits: availability insert `30/hour/ip`; bookings write `10/hour/ip`; notify `30/hour/ip`.
- **IMPORTANT**: Browser Site Data must use root-relative `/.herenow/data/:collection` — the relative `./.herenow/data/...` form breaks on `/book/` (resolves to `/book/.herenow/` → 404).

### Owner notification
- Switched to **Discord webhook** (ntfy free tier hit 429 "daily message quota reached"; Telegram deprioritized — do not revert to ntfy).
- Setup doc in README: Server Settings → Integrations → Webhooks → New Webhook.
- If the webhook URL rotates, update `public/.herenow/proxy.json` `/api/notify` `upstream` and republish.

## Homepage section order (current)
1. Hero
2. **Loved by the neighborhood** (reviews / `#reviews`) — moved to 2nd position at user request
3. **Wash day, minus the ordeal** (`#how-it-works`)
4. What's included (`#included`) — `--navy` (dark)
5. Pricing (`#pricing`)
6. Booking teaser
7. Visit (`#visit`)
8. FAQ (`#faq`)
9. Final CTA

### Visual styling notes
- Hero uses `--navy`.
- Reviews / proof section: `--tub-blue`.
- **Wash-day section background changed** from `--tub-blue` to `--soap` (light) so it visually separates from the reviews section above it. Its step cards flipped from `--soap` to `--tub-blue` to pop against the light section (3rd card stays `--lime`; step numbers `--orange`).
- Included section: `--navy` (dark).
- This means a light section (wash-day) sits between two `--tub-blue`/`--navy` sections — intentional for separation.

## Files
- `app/page.tsx` — homepage sections (reviews block is the 2nd section now).
- `components/booking-demo.tsx` — booking flow; fetches root-relative; `TUB_CAPACITY = 2`; phone validation; date disabled logic.
- `app/globals.css` — all section backgrounds + booking/skeleton/field styles.
- `README.md` — booking flow, `HERENOW_API_KEY` setup, Discord webhook setup, verify commands.
- `public/.herenow/data.json`, `public/.herenow/proxy.json` — manifests.
- `lib/site.ts` — site content config.
- `scripts/qa.mjs` — Playwright/Axe QA. Note: QA test clicks a fixed future date ("Tue, Sep 1") which goes stale/past as time rolls forward; may need updating.
- `out/.herenow/` — build output, manifests verified present after each build.

## Work state / next moves
- Latest publish `live_version_id`: `01M1HFVRQ89HCCHRWSGZ77PJMT` (section reorder + wash-day background change).
- Verified end-to-end earlier: availability returns 200, bookings unauthenticated GET → 403, `/api/bookings` proxy created + deleted a test record, `/api/notify` → Discord 204. `HERENOW_API_KEY` account variable exists (`7001555d...e4d2`).
- **Pending (owner, out of agent scope)**: do one real browser booking on the live site to confirm the Discord notification lands.
- QA test may need the stale date / phone format check revisited.