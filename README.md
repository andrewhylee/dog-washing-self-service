# Fresh Paws Dog Wash — concept website

A mobile-first pitch demo for Fresh Paws Dog Wash in Sunnyside, Queens. The site includes a responsive marketing homepage and an interactive, clearly labeled reservation preview. It does not save customer data, reserve a tub, or process payment.

## Stack

- Next.js 16 App Router
- React 19 + TypeScript
- Custom CSS and code-native SVG artwork
- Playwright + Axe for browser and accessibility checks

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verify

```bash
npm run lint
npm run build
npm run start -- --hostname 127.0.0.1 --port 3001
BASE_URL=http://127.0.0.1:3001 npm run qa
```

The QA script tests the homepage at 320px, 390px, and 1440px, exercises the mobile menu and booking flow, checks for overflow and sticky-header regressions, runs Axe, and records screenshots in `output/playwright`.

## Before launch

Confirm the owner-approved logo, service details, products, price, business hours, policies, photography, and booking/payment provider. The demo uses verified public contact details but intentionally labels unconfirmed information.
