# Fresh Paws Dog Wash — website

A mobile-first site for Fresh Paws Dog Wash in Sunnyside, Queens. The site includes a responsive marketing homepage and an interactive online booking flow with live 2-tub availability and owner notifications.

## Stack

- Next.js 16 App Router
- React 19 + TypeScript
- Custom CSS and code-native SVG artwork
- Playwright + Axe for browser and accessibility checks
- here.now Site Data + proxy routes (serverless storage/notifications)

## Booking flow

Customers pick a day and time (16 half-hour slots, 9:00am–4:30pm), enter their details, and confirm. The slot is marked unavailable once it reaches full 2-tub capacity. When a booking is confirmed:

- The reservation (date + time) is saved to a public Site Data `availability` collection.
- The customer's details are saved privately to an owner-only Site Data `bookings` collection via a proxy route.
- The owner receives an instant ntfy push notification with the customer's details.

No payment is processed — customers pay in store.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configure here.now

The site is published to here.now and uses two Site Data collections declared in `public/.herenow/data.json` (`availability` for slot counts, `bookings` for customer data) and proxy routes in `public/.herenow/proxy.json`.

Required here.now account variables (stored server-side, never exposed to the client):

| Variable | Used for |
|----------|----------|
| `HERENOW_API_KEY` | Authorizing the `/api/bookings` proxy route to write customer records |

Set them via the here.now API:

```bash
curl -X PUT https://here.now/api/v1/me/variables/HERENOW_API_KEY \
  -H "authorization: Bearer $(cat ~/.herenow/credentials)" \
  -H "content-type: application/json" \
  -d '{"value": "<YOUR_API_KEY>"}'
```

## Owner notifications (Discord)

The `/api/notify` proxy route posts to a Discord incoming webhook. To receive new-booking notifications:

1. Create a Discord server (or use an existing one) and a private channel for booking alerts.
2. In the channel: **Settings → Integrations → Webhooks → New Webhook**.
3. Copy the webhook URL — it looks like `https://discord.com/api/webhooks/<id>/<token>`.
4. Replace the `REPLACE_WITH_WEBHOOK_ID` / `REPLACE_WITH_WEBHOOK_TOKEN` placeholders in `public/.herenow/proxy.json`.
5. Rebuild and republish to here.now.

New bookings arrive as channel messages with the customer's details. The owner can enable Discord push notifications on their phone to get alerted in real time.

## Verify

```bash
npm run lint
npm run build
npm run start -- --hostname 127.0.0.1 --port 3001
BASE_URL=http://127.0.0.1:3001 npm run qa
```

The QA script tests the homepage at 320px, 390px, and 1440px, exercises the mobile menu and booking flow, checks for overflow and sticky-header regressions, runs Axe, and records screenshots in `output/playwright`.

## Before launch

Confirm the owner-approved logo, service details, products, price, business hours, policies, and photography. Confirm the owner's Discord webhook setup and test a real booking end-to-end, including the notification.
