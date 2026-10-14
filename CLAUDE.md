# Working on this repo

Public, open-source teaching course. Read `README.md` for what's here and `CONTRIBUTING.md` for slide rules (colour = meaning, `--fs-*` tokens only, no em dashes, short slides with deep notes).

## Hard rules

- **Nothing personal in the repo.** No mentee or mentor names, locations, schedules, programme-internal rules or anything outside teaching DeFi. Meeting notes can inform the course; they never get copied into it.
- **Facts carry a source and a date.** Re-check moving facts (protocol names, endpoints, versions, TVL) before changing them. Last full re-check: 14 Oct 2026 (see CHANGELOG).
- **Devnet only** in tasks. Never commit keypairs, `.env*`, or `PRESENTER_KEY`.

## Commands

```bash
npm run build          # all decks + landing page → dist/
npm run export         # PDFs and spreadsheets → downloads/ (commit them)
npm run check:type     # CI fails on raw font sizes
node scripts/outline.mjs                 # slide numbers and titles per deck
node scripts/shoot.mjs week-3 28 <dir>   # screenshot a built deck (serve dist first)
node scripts/sheet.mjs <dir> <prefix>    # contact sheets of those screenshots
npm run teach -- N [--online]            # live class from this laptop
cd builders/ts && npm test               # 20 tests, offline
cd builders/anchor && avm use 1.2.1 && anchor test   # 11 tests
```

## Deploy

Push to `main`. That deploys both Vercel production (https://solana-defi-course.vercel.app, project linked to this repo) and GitHub Pages (Actions). For a manual Vercel deploy, always pass the team: `vercel deploy --prod --scope tobysolutions-projects`, because the CLI's default team is a different one.

Before calling a change done: build, screenshot the slides you touched, check the contact sheet, and load the live URL in a browser after deploy. A green build is not a rendered slide.

## Gotchas

- In speaker notes and slide HTML, UnoCSS reads short class names like `b` as utilities (border). Use descriptive class names.
- Two Mermaid diagrams on one slide collide. Use the SVG components.
- Pages built with `file://` images in `page.setContent` render blank. Inline them as data URIs (the scripts already do).
- Slidev's own `--tunnel` downloads an x86 cloudflared that fails on Apple Silicon. `npm run teach -- N --online` uses the Homebrew binary instead.
- Pyth Hermes needs an API key since 26 Aug 2026. Use insights.pyth.network or the on-chain price account.
- Anchor 1.2.1's `anchor init` test template (LiteSVM 0.10) can't load sBPFv3 programs. `builders/anchor` uses LiteSVM 0.16 and Rust 1.95.
