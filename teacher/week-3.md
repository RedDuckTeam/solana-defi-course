# Week 3 · Liquidity, AMMs and yield

Deck: `/week-3/` (28 slides). Slides 26 to 28 are teacher prep.

## 1. Outcomes

By the end of the week the mentee can:

- Explain how a pool sets a price with x · y = k, and work a swap by hand.
- Explain price impact and why Jupiter splits big orders.
- Calculate impermanent loss for a price move and say when fees can win it back.
- Compare four ways to hold liquidity: CPMM, concentrated, bins, prop AMM.
- Ask "who pays this yield?" of any advertised APY.

## 2. Session plan

**Session 1: how a pool prices (slides 1 to 9, 60 to 90 min)**
- Slides 3 to 4: order book vs pool.
- Slides 5 to 9: the rule, the worked swap, the draggable curve, the LP lifecycle.
- Mentee does: works the 100/100 swap on paper, then checks it on slide 8 and in the Swap tab of `materials/week-3-liquidity-model.xlsx`.
- Teach-back: "Why does a bigger trade get a worse price?" "Where does the 0.3% fee go?"

**Session 2: impermanent loss (slides 10 to 14, 60 to 90 min)**
- Slides 10 to 13: why it happens, the table, can fees win it back.
- Slide 14: quiz.
- Mentee does: fills the LP vs Hold tab with their own price moves.
- Teach-back: "SOL doubles. Why do I have less than if I'd just held?" "Why are 2x and 0.5x the same loss?"

**Session 3: beyond x · y = k, yield, task (slides 15 to 25, 60 to 120 min)**
- Slides 15 to 18: four curve families, concentrated liquidity, why Jupiter splits.
- Slides 19 to 22: who pays you, the APY trap, quiz.
- Slides 23 to 25: two USDCs, the task, the blog prompt.
- Mentee does: starts the task route the mentor tested.
- Teach-back: "A farm pays 300% APY in its own token. What's your first question?"

**Consolidation (30 to 45 min)**
- The mentee presents their IL table and the Two pools comparison.

## 3. Pre-reading

- Before Session 1: https://ethereum.org/en/defi/#dexs. Order books vs pools, in general terms.
- Before Session 1: https://docs.raydium.io/. How Raydium's pools work.
- Before Session 2: https://docs.orca.so/. Concentrated liquidity and Whirlpools.
- Before Session 3: https://developers.jup.ag/docs/api-reference. How routing works.
- Before Session 3: https://defillama.com/yields?chain=Solana. Real advertised yields. Note the date and ask who pays each one.

## 4. Task checklist

Test the route yourself first. Raydium's devnet is a setting on raydium.io; use program IDs from docs.raydium.io only. Orca's devnet examples use Orca's own devUSDC, not Circle's.

**Users**
- [ ] Provide liquidity on devnet (Raydium devnet, or the class pool with week 2 tokens).
- [ ] Fill `materials/week-3-liquidity-model.xlsx`: Swap tab check, LP vs Hold with at least three price moves, Two pools comparison.
- [ ] Compare four sources of yield and who pays each.

**Builders**
- [ ] Orca SDK on devnet (`setWhirlpoolsConfig('solanaDevnet')`), or deploy the token-swap example.
- [ ] Run `builders/ts/w3-amm.ts` and its tests. Change the fee and pool size and explain the output.
- [ ] Optional: start from `builders/anchor` `cp-amm`.

## 5. Marking guide

**Task**

| Criterion | Weight | Strong | Adequate | Weak |
|---|---|---|---|---|
| Worked swap | 20 | Hand calculation matches 9.0909 / 9.0661 | Right method, arithmetic slip | Missing |
| IL table | 30 | Three or more moves, hold vs LP, fees, assumptions stated | Table without assumptions | Missing or wrong formula |
| Pool comparison | 20 | Picks a pool and says what would flip the answer | Picks without reasons | Missing |
| Yield sources | 20 | Four sources, each with who pays | Lists sources only | Missing |
| Devnet evidence | 10 | LP tx link or position screenshot | Attempted, documented blocker | Nothing |

**Blog post**

| Criterion | Weight | Strong | Adequate | Weak |
|---|---|---|---|---|
| Own words | 25 | Can explain every paragraph | Mostly | AI draft |
| Evidence | 25 | IL table included | Mentioned, not shown | None |
| Accuracy | 25 | IL and fees explained correctly | One slip | "Fees mean profit" |
| Dated number | 10 | Any APY or volume dated | Undated | None |
| Open question | 15 | Specific | Generic | None |

## 6. Model answer outline

- Swap: pool 100 X / 100 Y, k = 10,000. Sell 10 X: y = 10,000 / 110 = 90.91, trader gets 9.09 Y. With 0.3% fee: 9.97 X counts, trader gets 9.066 Y, k grows to about 10,002.7.
- IL table from a 5 SOL + 500 USDC deposit at $100:

| SOL moves | Hold | LP | IL |
|---|---|---|---|
| 1.25x | $1,125 | $1,118 | −0.62% |
| 2x | $1,500 | $1,414 | −5.72% |
| 4x | $2,500 | $2,000 | −20.00% |
| 0.5x | $750 | $707 | −5.72% |

- Fees vs IL example: at 2x with 20% fee APR, 90 days of fees (~$49) don't cover the $86 gap; a full year (~$200) does.
- A clear sentence: positive fees don't guarantee a positive return.

## 7. Common mistakes

- "Impermanent means it always comes back." Ask: what if you withdraw at 2x?
- Treating APY in a new token as dollars. Ask: what happens to that APY if the token halves?
- Forgetting the fee stays in the pool. Ask: why did k go up?
- Mixing Orca devUSDC and Circle USDC. Ask for the mint address.
- Thinking concentrated liquidity is free money. Ask: what happens when the price leaves your range?

## 8. If time is short

Skip slides 16 (four families, summarise verbally), 18 (route splitting, covered in week 1) and 23 (two USDCs, covered in week 2). Keep slides 7, 8, 12 and 20.
