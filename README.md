# GoPrimy merchant dashboard prototype

A responsive, interactive prototype of the GoPrimy Shopify merchant workspace.

## View it

Download the repository and open `index.html` in a browser. The demo includes React, CSS and fonts in one self-contained file; no installation is required to review it.

Use Prototype tools to choose New merchant, Employee Active, or WhatsApp disconnected. All authentication, integrations, customer records and actions are simulations. No customer messages, payments or financial actions are performed.

## Code

- `src/dashboard/`: reusable React / TypeScript components and product rules.
- `index.html`: compiled portable demo.
- `public/fonts/`: self-hosted typefaces used by the build.

Install dependencies with `npm install`, then `npm run build` to regenerate index.html.

## Locked rules

Employee lifecycle and health are separate. Active employees never revert to Draft after an outage; affected channels stop while valid channels continue. Explicit activation, role prerequisites and platform authorization are required. Missing money/policy limits remain Not configured; the prototype never executes financial exceptions. Production OAuth, policy evaluation, identity verification and delivery must be implemented server-side.

## Vercel deployment

Import the repository root. This is a React prototype bundled with esbuild, not Next.js. The committed vercel.json selects Other, runs npm run build, serves dist, and routes direct dashboard URLs to index.html. The build also keeps the standalone root index.html for downloads. Redeploy after pulling these changes.
