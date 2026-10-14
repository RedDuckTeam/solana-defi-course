# DeFi on Solana

A free six-week course on decentralised finance, taught on Solana. It's built for a room that mixes finance graduates and developers. Each week is one interactive [Slidev](https://sli.dev) deck: short slides, live diagrams, and the full teaching script in the speaker notes.

**Live decks:** https://tobysolutions.github.io/solana-defi-course/

| Week | Topic | What students ship |
|---|---|---|
| 0 | [Course map](slides.md): how the course runs, EVM to Solana translation, toolkit | |
| 1 | [Intro to DeFi](week-1.md): banks vs programs, history, the Solana map, why Solana | Trace a real Jupiter route |
| 2 | [Wallets & devnet](week-2.md): keys, accounts, tokens, transactions, fees | Send devnet USDC and read it on Orb |
| 3 | [Liquidity & AMMs](week-3.md): x · y = k, price impact, impermanent loss, yield | Provide liquidity on devnet |
| 4 | [Lending & stablecoins](week-4.md): LTV, health factor, liquidation, oracles, pegs | A liquidation model |
| 5 | [Risk & security](week-5.md): Solana's hacks by root cause, token red flags, due diligence | A post-mortem and a token audit |
| 6 | [Capstone & careers](week-6.md): tiers, demo day, where to go next | Demo day |

## What's interactive

Every teaching slide has a diagram that steps on the presenter's click, or a widget students can use themselves. A few:

- a real Ed25519 keypair you sign with, then tamper with
- a transaction you can take apart field by field, and a fee calculator
- the constant-product curve with a trade you drag along it
- impermanent loss against holding, with fees switched on and off
- a lending position you crash until it liquidates
- step-by-step replays of Wormhole, Cashio, Mango and Drift
- a token red-flag checker and a due-diligence scorecard

## Run it

```bash
npm install
npx slidev slides.md      # course map
npx slidev week-3.md      # any week
npm run build             # every deck into dist/, plus the landing page
```

In a deck: **P** opens presenter mode with notes, **O** shows all slides, arrow keys step through animations, **D** toggles dark drawing tools.

## Teaching it

- 30 minutes of slides, then the task live in class. The "Teacher prep" section at the end of each deck is for the mentor.
- Two tracks every week. **Users** work through wallets, explorers and spreadsheets. **Builders** do the same plus a code extension.
- Devnet and test tokens only. The one exception is an optional, clearly flagged $5 supply in week 4.
- Facts were checked on 11 October 2026. TVL, supply and prices move weekly; quote them with a date.

## Contributing

Corrections and new widgets are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) first: it covers the colour meanings, the type scale (CI rejects raw font sizes), and the "short slide, deep notes" rule.

## Licence

MIT. Nothing here is financial advice.
