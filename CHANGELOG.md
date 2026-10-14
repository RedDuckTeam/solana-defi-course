# Changelog

What changed, when, and how it was checked. Newest first.

## 2026-10-14 · Close the gaps (ace0a44)

**Added**
- Live class mode: in speaker view, every mentee's screen follows your slide and animation step.
  - Hosted: `api/sync.ts` (Vercel Function, Upstash Redis, `PRESENTER_KEY`) plus `setup/main.ts`. Mentees open `/week-N/`; the presenter opens `/week-N/?key=…#/presenter/1`.
  - Local: `npm run teach -- N`, or `--online` for a public Cloudflare quick tunnel (needs `brew install cloudflared`). `vite.config.ts` allows `.trycloudflare.com` hosts.
- `teacher/`: per week, a three-session plan with slide numbers, teach-back prompts, pre-reading, a task checklist, marking guides, model answers, common mistakes and what to skip.
- `handouts/`: one-page cheat sheets.
- `materials/`: `week-3-liquidity-model.xlsx` and `week-4-lending-model.xlsx`.
- `builders/`: TypeScript scripts on `@solana/kit` for weeks 1 to 5, plus an Anchor 1.2.1 workspace with `vault-bug` (exploit and fix) and `cp-amm`.
- `downloads/`, made by `npm run export`: slides PDF, speaker script (thumbnail beside notes) and cheat sheet per week, plus the spreadsheets.
- Landing page: "Teach it live" and "Downloads" sections. Vercel production at https://solana-defi-course.vercel.app.
- CI: a `builders-ts` test job.

**Corrected after a fact re-check against primary sources**
- marginfi relaunched as Project 0 (announced Sep 2025); the old app shut down in mid-2026. Use app.0.xyz.
- Aquifer (31 Aug 2026, about $2.5M): the team has not confirmed the cause.
- Raydium devnet program IDs now come from docs.raydium.io. The cpi-example README lists a different CPMM ID (issue #16, still open).
- Alpenglow: approved 2 Sep 2025; live on testnet and devnet since late Sep 2026; mainnet scheduled for about 21 Oct 2026.
- HumidiFi led spot DEX volume in late 2025, and BisonFi passed it in Jan 2026.
- Jupiter: `quote-api` v6 is being shut down. `lite-api`'s retirement was postponed.
- Lending on devnet: no public UI exists. Use your own Kamino devnet market or a Surfpool fork.
- Drift: added detail (2-of-5 council, zero timelock, CVT, 31 withdrawals in about 12 minutes, attribution).
- Pyth Hermes has needed an API key since 26 Aug 2026. Week 4 now uses insights.pyth.network, and Builders read the on-chain account `7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE`.
- Circle faucet limit confirmed: 20 USDC per 2 hours, per address.

**Verified**
- Builders: `npm test` passes 20 of 20 and `anchor test` (1.2.1) passes 11 of 11.
- Spreadsheets: 213 formulas evaluate with no errors and match the decks.
- Every PDF regenerated. Each cheat sheet is one page.
- On production, every deck, PDF and spreadsheet returned 200 in Chromium, with no page errors.
- Mentee follow was checked locally and over a public tunnel.

**Known open**
- Hosted live sync needs the Upstash integration on the Vercel project. Until then `/api/sync` returns 500 and decks work without following.
- No one has taught from the decks yet.

## 2026-10-14 · Offline fonts (b2c1fc4)
- Archivo and JetBrains Mono are self-hosted. With every outside request blocked, all decks load with the right fonts.

## 2026-10-14 · First release (6fdc22b)
- Course map plus weeks 1 to 6 as Slidev decks: 66 components, speaker notes, a type-scale CI check, and GitHub Pages.
