# Session Context — Fresh Paws Dog Wash

Handoff notes so a new session can resume work quickly. All known state is captured here.

## Hosting account (current)

- here.now personal account: `reviewmyhaul@protonmail.com` (free plan, active). This is the project's
  dedicated account (one account per project).
- Public site slug: `liminal-realm-qvmd` — live URL: **https://liminal-realm-qvmd.here.now**,
  also mounted at the root of **https://freshpawsdogwash.com/** (mount_path `""`).
  (booking page: `/book`, vaccinations page: `/vaccinations`). Live version: `01M4XVY25KEP59Z2ABH028HSQZ`.
- Admin slug: `dewy-sketch-h6k7` — canonical URL: **https://freshpawsdogwash.com/office/**
  (custom-domain mount `office` → slug `dewy-sketch-h6k7`). The bare `https://dewy-sketch-h6k7.here.now/`
  308-redirects there (set via `PUT /api/v1/publish/dewy-sketch-h6k7/primary-domain
  {"domain":"freshpawsdogwash.com"}`; synced:true).
  Live version: `01M4XZ750HQ0MBWQE81N22A48P`.
- **Serving under a sub-path**: the admin app is built with `basePath: "/office"`
  (admin/next.config.mjs) so every asset/API reference stays under the mount. Do NOT hand-relativize
  asset URLs — Next/Turbopack module keys must stay absolute and consistent; the framework handles
  the prefix. Without basePath, root-absolute `/_next/...` refs 404 at the domain root and the
  dashboard renders as an unstyled shell (giant icon, no data) — seen live 2026-10-14. If the mount
  path ever changes, basePath must match it exactly. (No basePath on the public site — root mount.)
- Publish config in `.herenow/state.json` (`auth_mode=authenticated`, `persistence=permanent`).
- Regenerate + republish flow after edits (key comes from `.envrc` / env, no flags needed):
  ```
  npm run lint && npm run build
  /Users/drew/.claude/skills/here-now/scripts/publish.sh out --slug liminal-realm-qvmd --client opencode
  ```
  First publish to a fresh account omits `--slug` (server assigns one).

## Credentials layout (multi-account scheme)

- This project's key lives OUTSIDE the repo: `~/.herenow/credentials.dogwash` (`chmod 600`).
- `.envrc` (committed, contains no secret — just a pointer) exports
  `HERENOW_API_KEY=$(cat ~/.herenow/credentials.dogwash)` so every publish from this directory
  uses this project's account. Requires `direnv allow` once per machine.
- Never store live keys in the project folder. `.gitignore` excludes `.herenow/*` (except
  `urls.json`), `.env`, `.output/`.
- Account variables (server-side, values never returned by API): `HERENOW_API_KEY` (public-site
  `/api/vaccine` + `/api/bookings` proxies) and `ADMIN_RECORDS_KEY` (admin-site proxies, value is
  the dedicated revocable named key `dogwash-admin-records`, id `bf026452-91ea-49bc-a295-3d786c381461`).
  Both pinned with `allowedUpstreams: ["here.now"]`.
- Local copies: `~/.herenow/site-admin-records-key` (current value), `~/.herenow/site-admin-password`
  (currently temp `testing111` — CHANGE TO A REAL PASSWORD BEFORE HANDOFF).
- Old-account backups (old key still works for reads until revoked): `~/.herenow/credentials.old-account`,
  `~/.herenow/site-admin-records-key.old-account`, `~/.herenow/site-admin-password.old-account`.
- Full records backup from migration day: `/var/folders/rs/nghg4yz14kjf4j9qnjwz5h6r0000gn/T/opencode/vaccine-records-backup.json`
  (temp dir — may be gone on reboot; the live data is the source of truth now).

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
- `public/.herenow/proxy.json` — proxies (upstreams point at the CURRENT public slug `liminal-realm-qvmd`):
  - `/api/upload` → Cloudinary `zjq8kp0w` unsigned `upload_preset: dog_wash` (third-party, account-independent).
  - `/api/discord` + `/api/notify` → Discord webhook (third-party; URL committed in git — rotate if that bothers you).
  - `/api/vaccine` → `.../publishes/liminal-realm-qvmd/data/vaccine_records`, header `Bearer ${HERENOW_API_KEY}`.
  - `/api/bookings` → `.../publishes/liminal-realm-qvmd/data/bookings`, header `Bearer ${HERENOW_API_KEY}`.
  - Uses top-level key `"proxies"` (NOT `"routes"`), `"method"` singular.
- Access/rate limits: availability insert `30/hour/ip`; bookings write `10/hour/ip`; notify `30/hour/ip`.
- **IMPORTANT**: Browser Site Data must use root-relative `/.herenow/data/:collection` — the relative `./.herenow/data/...` form breaks on `/book/` (resolves to `/book/.herenow/` → 404).

### Owner notification

- Switched to **Discord webhook** (ntfy free tier hit 429 "daily message quota reached"; Telegram deprioritized — do not revert to ntfy).
- Setup doc in README: Server Settings → Integrations → Webhooks → New Webhook.
- If the webhook URL rotates, update `public/.herenow/proxy.json` `/api/notify` + `/api/discord` `upstream` and republish.

## Vaccination cards (photo storage)

- Upload limit **5 MB** (`MAX_FILE_MB` in `components/vaccine-form.tsx`; copy in form + `/vaccinations` page).
  Fits Cloudinary free (10 MB/file) and Discord webhook (20 MB/file) caps.
- Flow: browser → `/api/upload` (Cloudinary, returns `secure_url`; PDF→first-page preview and HEIC→preview
  delivery rewrites) → `/api/discord` (team copy with attachment) → `/api/vaccine`
  (metadata + `card_url` into owner-only `vaccine_records`). here.now stores only the URL string.
- **Photo shrink (2026-10-14, aggressive: 1600px long edge, WebP q65 → ~100-250 KB)**: `convertToWebp()`
  in `components/vaccine-form.tsx` converts JPEG/PNG (and HEIC where the browser can decode it) to WebP
  via canvas before the Cloudinary upload; Discord still gets the original; the record keeps the original
  `file.name`. PDFs skip conversion. If the WebP POST is rejected, the form retries once with the original
  so uploads never hard-fail on preset config.
- **Cloudinary preset action REQUIRED (owner, console `zjq8kp0w` → Upload preset `dog_wash`):**
  preset currently rejects webp (`400 "Image file format webp not allowed"`), so converted uploads fall
  back to originals until fixed. In the preset set **Allowed formats += webp** AND incoming transformation
  `w_1600,c_limit / f_webp / q_65` (covers PDFs + HEIC fallbacks at rest). After the change, re-run the
  upload matrix (large JPG → stored `format: webp`; HEIC; PDF) and delete the test records.
- Records currently: 3 (mew/Johnny Bravo, ppo/pp — migrated; Keke/"Testing Tester" — appeared 2026-10-14
  19:54 UTC, looks like the owner's own live-form test, NOT agent-created: do NOT delete without asking).

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
- `components/vaccine-form.tsx` — vaccine upload form (`MAX_FILE_MB = 5`).
- `app/globals.css` — all section backgrounds + booking/skeleton/field styles.
- `README.md` — booking flow, `HERENOW_API_KEY` setup, Discord webhook setup, verify commands.
- `public/.herenow/data.json`, `public/.herenow/proxy.json` — manifests (slugs = `liminal-realm-qvmd`).
- `lib/site.ts` — site content config.
- `scripts/qa.mjs` — Playwright/Axe QA. Note: QA test clicks a fixed future date ("Tue, Sep 1") which goes stale/past as time rolls forward; may need updating.
- `out/.herenow/` — build output, manifests verified present after each build.
- `.envrc` — exports `HERENOW_API_KEY` from `~/.herenow/credentials.dogwash` (pointer only, safe to commit).

## Work state / next moves

- Migration to the dedicated account completed 2026-10-14: fresh publishes, variables recreated,
  proxy slugs re-pointed, 2 vaccine records migrated (new record IDs; `card_url`s verified identical),
  `/api/vaccine` write chain verified with a create+delete probe.
- Custom domain `freshpawsdogwash.com` connected same day: root → public site, `/office/` → admin
  (admin rebuilt with `basePath: "/office"`; slug 308-redirects to the mount). Admin e2e **21/21 PASS**
  on the mount (`npm run qa:admin`, targets `https://freshpawsdogwash.com/office/`).
- **Pending (owner, out of agent scope)**: do one real browser booking on the live site to confirm the Discord notification lands.
- **CHANGE THE ADMIN PASSWORD** back to a real one before handing off (currently temp `testing111`)!
- QA test may need the stale date / phone format check revisited.

## Owner admin site (vaccine records) — Next.js app in `admin/`

- **Canonical URL**: **https://freshpawsdogwash.com/office/** (custom-domain mount: `freshpawsdogwash.com`
  → `office` mount → slug `dewy-sketch-h6k7`). The bare `https://dewy-sketch-h6k7.here.now/` 308-redirects
  here (primary-domain, synced:true; redirects take up to 60s to start, up to 1h to stop for return visitors).
- **Architecture**: a SECOND Next.js static-export app living at `admin/` in the same repo (own `app/`,
  `next.config.mjs` with `output:"export", trailingSlash:true, distDir:"out"`, `tsconfig.json`).
  Built with `next build admin` (CLI supports a directory arg), output is `admin/out/`.
  Root `tsconfig.json` excludes `admin/**`; eslint ignores `admin/.next/**`/`admin/out/**`.
- **Purpose**: lets the owner VIEW + DELETE submitted vaccine records without exposing owner-only data on the public site. Decided after proving the public-site approach impossible (here.now proxy does NOT forward client-supplied `Authorization`; injected key would make reads public).
- **Security model**: site password gate covers BOTH the page and the `/api/*` proxy routes (verified: anonymous root + api → 401 Protected wall; after gate login cookie → data OK). Proxy manifest injects account variable `ADMIN_RECORDS_KEY` server-side. Temp site password `testing111` — CHANGE BEFORE HANDOFF.
- **Admin build/publish flow**:
  ```
  npm run lint && npm run build:admin        # builds admin/out + copies admin/.herenow/proxy.json into out/.herenow/
  npm run publish:admin                      # publishes admin/out → dewy-sketch-h6k7 (uses --slug for updates)
  npm run qa:admin                           # headless Playwright e2e (gate, login, rows/search/sort/refresh, mobile overflow)
  npm run dev:admin                          # next dev admin -p 4173 (data won't load: proxy/gate exist only on here.now)
  ```
  Republish with `--overwrite` while iterating; once files stabilize, drop it.
- **Proxy routes** (`admin/.herenow/proxy.json`, upstreams point at the public slug `liminal-realm-qvmd`):
  `GET /api/vaccine-records` → injects `Bearer ${ADMIN_RECORDS_KEY}`, rateLimit `30/hour/ip`;
  `DELETE /api/vaccine-records/*` → injects same, upstream WITHOUT trailing `/*` (verified working).
- **Response shape**: list = `{"records":[{"id":"rec_...","data":{...fields...}},...]}` — fields nested under `data`; flattening lives in `admin/app/records.ts` (pure, exported).
- **Dashboard**: `admin/app/dashboard.tsx` client component — table (Pet thumb + name/file, Owner, Contact, sortable Uploaded header w/ aria-sort, Open card, Delete w/ confirm), search by owner/pet/phone/email, skeleton loading, subtle `.state-box.note`, empty/empty-search states, database-icon brand header + favicon (app/icon.png), Refresh button. ≤760px the wide table becomes stacked per-record cards (no horizontal scroll). Loading fetch deferred via `setTimeout(...,0)` to satisfy `react-hooks/set-state-in-effect`. Data fetches are RELATIVE (`fetch("api/vaccine-records")`).
- Gate login brute-force: repeated failed POSTs trigger a cooldown (~5 min) even for the right password — wait it out, don't hammer.
- Caching: here.now static assets `cache-control: public, max-age=3600, stale-while-revalidate=86400`; Next hashed `_next` chunk names + `no-cache` index.html make stale-asset issues moot.

## Retired (old account)

- Old slugs `mystic-lagoon-2g3s` (public) and `eternal-arbor-vra2` (admin) still exist on the previous
  account with their data (bookings/availability were never migrated — not in use). Old `studiomuni.com`
  mounts/redirects untouched. Delete the old sites whenever the owner confirms they're unneeded
  (needs `~/.herenow/credentials.old-account`).
