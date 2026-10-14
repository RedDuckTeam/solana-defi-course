# DeFi on Solana

A free six-week course on decentralised finance, taught on Solana. It's built for small online groups that mix finance graduates and developers. Each week has an interactive [Slidev](https://sli.dev) deck, a teacher guide, a one-page cheat sheet, a task file and tested starter code.

**Live:** https://solana-defi-course.vercel.app (mirror: https://tobysolutions.github.io/solana-defi-course/)

| Week | Topic | Students ship |
|---|---|---|
| 0 | [Course map](slides.md): how it runs, EVM to Solana translation, toolkit | |
| 1 | [Intro to DeFi](week-1.md): banks vs programs, history, the Solana map, why Solana | A traced Jupiter route |
| 2 | [Wallets & devnet](week-2.md): keys, accounts, tokens, transactions, fees | A devnet USDC send, read on Orb |
| 3 | [Liquidity & AMMs](week-3.md): x · y = k, price impact, impermanent loss, yield | A liquidity-pool model |
| 4 | [Lending & stablecoins](week-4.md): LTV, health factor, liquidation, oracles, pegs | A liquidation model |
| 5 | [Risk & security](week-5.md): Solana's hacks by root cause, token red flags, due diligence | A post-mortem and a token audit |
| 6 | [Capstone & careers](week-6.md): tiers, demo day, where to go next | Demo day |

## What's in the repo

| Folder | What it is |
|---|---|
| `*.md`, `components/` | The decks. 66 Vue components: click-stepped diagrams, live simulators, incident replays |
| `teacher/` | A guide per week: three-session plan with slide numbers, teach-back prompts, pre-reading, marking guide, model answers |
| `handouts/` | One-page student cheat sheets (also as PDFs in `downloads/`) |
| `materials/` | Spreadsheets for the week 3 pool task and the week 4 lending task, with live formulas |
| `builders/` | Tested starter code for the Builders track: TypeScript scripts (`@solana/kit`) and an Anchor 1.2.1 workspace |
| `downloads/` | Slides, speaker scripts (thumbnail beside notes) and cheat sheets as PDFs |

## Teach it live

**Hosted (Vercel):** send mentees the week's link, for example `/week-3/`. Open `/week-3/?key=<PRESENTER_KEY>#/presenter/1` yourself. When you move a slide or step an animation in speaker view, every mentee's screen follows. Mentees can flip back on their own and snap to you on your next click. Only a link with the presenter key can move the class.

**From your laptop:**

```bash
npm run teach -- 3            # week 3, mentees on the same Wi-Fi follow you
npm run teach -- 3 --online   # plus a public link for online mentees (needs: brew install cloudflared)
```

It prints a private speaker-view link for you and a follow link for mentees. Every run makes a new password.

In any deck: **P** speaker view, **O** all slides, **F** fullscreen, arrow keys step through animations.

## Run and build

```bash
npm install
npx slidev week-1.md       # edit with live reload
npm run build              # every deck plus the landing page into dist/
npm run export             # regenerate the PDFs in downloads/
npm run check:type         # fails on any raw font size
cd builders/ts && npm test # Builders track tests (offline)
```

Everything runs offline once installed: fonts are bundled.

## Accuracy

Facts were checked on 11 October 2026 and re-checked on 14 October 2026 against primary sources: protocol docs, GitHub releases, post-mortems and court records. Anything that moves weekly (TVL, supply, prices) carries a date. Slides marked "verify before class" list what to re-check. Pyth's Hermes service has needed an API key since 26 August 2026, so the course reads prices from Pyth's public pages or the on-chain price account instead.

## Safety

Devnet and test tokens only. The one exception is an optional, clearly flagged $5 supply in week 4. Never share a recovery phrase. Nothing here is financial advice.

## Contributing

Corrections and new widgets are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) first: colour meanings, the type scale (CI rejects raw font sizes), and the "short slide, deep notes" rule.

MIT licensed.
