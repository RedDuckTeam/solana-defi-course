# Week 4 · Lending, borrowing and stablecoins

Deck: `/week-4/` (27 slides). Slides 25 to 27 are teacher prep.

## 1. Outcomes

By the end of the week the mentee can:

- Explain why DeFi loans are over-collateralised.
- Calculate LTV, health factor and liquidation price for a position.
- Walk through a liquidation: what the liquidator repays, takes and earns.
- Explain how a pull oracle (Pyth) delivers a price, and why lending depends on it.
- Compare fiat-backed, crypto-backed and algorithmic stablecoins and what holds each peg.

## 2. Session plan

**Session 1: lending and the four numbers (slides 1 to 9, 60 to 90 min)**
- Slides 3 to 6: no banker, who pays whom, Solana's lenders.
- Slides 7 to 9: LTV, liquidation threshold, health factor, utilisation; the live position widget.
- Mentee does: drags SOL price on slide 9 until it reads "Liquidatable", and writes down that price.
- Teach-back: "Why can't I borrow $1,000 against $1,000 of SOL?" "What does a health factor of 1.33 mean?"

**Session 2: liquidation and rates (slides 10 to 14, 60 to 90 min)**
- Slides 10 to 13: the walkthrough, flash loans, the rate curve.
- Slide 14: quiz.
- Mentee does: fills the Price path and Liquidation tabs of `materials/week-4-lending-model.xlsx`.
- Teach-back: "Who gets paid when I'm liquidated, and why?" "Why do rates explode above 80% utilisation?"

**Session 3: oracles, stablecoins, task (slides 15 to 24, 60 to 120 min)**
- Slides 15 to 17: Pyth pull model, then the live price on insights.pyth.network (Builders: npm run w4:price).
- Slides 18 to 22: three ways to hold $1, what holds the peg, quiz.
- Slides 23 to 24: the task and blog prompt.
- Mentee does: gets the live SOL price from insights.pyth.network and starts the spreadsheet from it.
- Teach-back: "What happens to lenders if the oracle price is wrong?" "Why did UST fail but USDC recover in 2023?"

**Consolidation (30 to 45 min)**
- The mentee re-runs the liquidation walkthrough out loud with their own price.

## 3. Pre-reading

- Before Session 1: https://kamino.com/docs. How a Solana lending market works.
- Before Session 1: https://ethereum.org/en/defi/#lending. Over-collateralised lending, in general.
- Before Session 2: https://defillama.com/protocols/lending/Solana. Lenders on Solana and their size. Date it.
- Before Session 3: https://docs.pyth.network/price-feeds. Pull oracles. Note: Hermes needs an API key since 26 Aug 2026.
- Before Session 3: https://www.circle.com/usdc. How USDC is issued and redeemed.

## 4. Task checklist

No major Solana lender has a public devnet UI (checked 14 Oct 2026). Don't promise one.

**Users**
- [ ] Get the live SOL price from insights.pyth.network (Builders: `npm run w4:price`, price × 10^expo). Write the time.
- [ ] Fill `materials/week-4-lending-model.xlsx`: Inputs with your price, Price path, Liquidation.
- [ ] Look up one real market's liquidation threshold for SOL. Note where and when.
- [ ] Optional, real money: supply $5 USDC to a lender. Supply only. Never borrow.

**Builders**
- [ ] Run `builders/ts/w4-lending.ts` and tests; reproduce the deck walkthrough.
- [ ] Run `builders/ts/w4-pyth-price.ts` for a live SOL price.
- [ ] Stretch: Surfpool mainnet fork, or create a Kamino devnet market with klend-sdk.

## 5. Marking guide

**Task**

| Criterion | Weight | Strong | Adequate | Weak |
|---|---|---|---|---|
| Live price | 10 | Pyth price with time and date | Price, no date | Made up |
| Price path | 30 | LTV and HF correct at each step, liquidation row marked | Minor slips | Wrong formulas |
| Liquidation | 30 | Repay, seized SOL, profit, HF after all correct | Two of four | Missing |
| Real market check | 15 | Real threshold, source and date | Threshold without source | Example values only |
| Risk types | 15 | Names credit, market, liquidity, collateral, smart-contract risk correctly | Three of five | Missing |

**Blog post**

| Criterion | Weight | Strong | Adequate | Weak |
|---|---|---|---|---|
| Own words | 25 | Can explain every paragraph | Mostly | AI draft |
| Evidence | 25 | Liquidation walkthrough included | Described only | None |
| Accuracy | 25 | HF and liquidation right | One slip | "Liquidation takes everything" |
| Dated number | 10 | Price or supply with date | Undated | None |
| Stablecoin view | 15 | Which coin they'd trust and why | Opinion without reasons | None |

## 6. Model answer outline

Example market: max LTV 70%, liquidation threshold 80%, close factor 50%, bonus 5%.

- Deposit 10 SOL at $150 = $1,500. Borrow 900 USDC. LTV 60%. HF = 1,500 × 0.80 / 900 = 1.33. Liquidation price $112.50.
- SOL falls to $110: collateral $1,100, LTV 81.8%, HF 0.98. Liquidatable.
- Liquidator repays $450 (50%), receives $472.50 of SOL = 4.295 SOL, profit $22.50 before fees.
- Borrower after: 5.705 SOL ($627.55), owes $450, LTV 71.7%, HF about 1.12.
- Stablecoins: USDC is fiat-backed and recovered after the March 2023 SVB scare; UST was algorithmic and collapsed in May 2022.

## 7. Common mistakes

- "Liquidation takes all my collateral." Ask: how much SOL did the borrower keep in the walkthrough?
- Confusing max LTV with liquidation threshold. Ask: which one stops you borrowing, and which one lets others liquidate you?
- Thinking lenders earn the full borrow rate. Ask: what share of the pool is actually lent out?
- Trusting a price without asking where it comes from. Ask: what if this price were pushed up for one minute?
- "A stablecoin is like a bank deposit." Ask: who insures it?

## 8. If time is short

Skip slides 12 (flash loans, revisit in week 5), 13 (rate curve, use the spreadsheet tab) and 17 (live price, do it in the task). Keep slides 8, 9, 11 and 19.
