# Week 4 · Lending, borrowing and stablecoins

## The idea in one line

With no credit score, DeFi loans are backed by more collateral than the debt, and bots liquidate positions that slip.

## Key terms

| Term | Meaning |
|---|---|
| Collateral | What you lock to borrow |
| LTV | Debt ÷ collateral value |
| Liquidation threshold | The LTV at which others can liquidate you |
| Health factor | Below 1.00, you can be liquidated |
| Liquidator | A bot that repays part of your debt and takes collateral plus a bonus |
| Utilisation | Borrowed ÷ supplied in a pool |
| Oracle | Supplies the price used to value collateral (Pyth) |
| Peg | A stablecoin's target price, usually $1 |

## Three things to remember

1. Health factor = collateral value × liquidation threshold ÷ debt.
2. Example: 10 SOL at $150, borrow 900 USDC. HF 1.33. At $110, HF 0.98: liquidatable.
3. Pyth price = price × 10^expo. Live: insights.pyth.network.

## Do and don't

- Don't borrow real money for this course.
- The optional $5 supply is real money. Supply only. Never borrow.
- Check where a lending market gets its prices.
- A stablecoin is not an insured bank deposit.

## This week's task

Get the live SOL price from insights.pyth.network and write down the time.
Fill materials/week-4-lending-model.xlsx: price path, liquidation price, liquidator profit.
Blog: "Understanding lending and borrowing in DeFi." Say which stablecoin you'd trust, and why.

Deck: /week-4/
