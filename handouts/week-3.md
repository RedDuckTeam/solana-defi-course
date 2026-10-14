# Week 3 · Liquidity, AMMs and yield

## The idea in one line

A pool sets the price by keeping x · y constant. Liquidity providers earn fees and take on impermanent loss.

## Key terms

| Term | Meaning |
|---|---|
| AMM | A program that trades against a pool, not an order book |
| Liquidity provider (LP) | Deposits both tokens and earns swap fees |
| Price impact | How much worse your price gets as your trade grows |
| Slippage | The price moving between quote and execution |
| Impermanent loss | LP value vs just holding, after prices move |
| Concentrated liquidity | Liquidity placed in a price range (Orca, Raydium CLMM) |
| APR / APY | Simple yearly rate / rate with compounding |
| Emissions | Rewards paid in a protocol's own token |

## Three things to remember

1. x · y = k. Pool 100 / 100, sell 10 X: you get 9.09 Y (9.066 with a 0.3% fee).
2. Impermanent loss = 2√r / (1 + r) − 1, where r is the price change. 2x: −5.72%. 4x: −20%.
3. Ask of every yield: who pays it, and in what token?

## Do and don't

- Don't assume fees mean profit. Compare fees with impermanent loss.
- Check the mint: Orca's devUSDC is not Circle's devnet USDC.
- Date every APY you quote.

## This week's task

Provide liquidity on devnet (route chosen by your mentor).
Fill materials/week-3-liquidity-model.xlsx: swap check, LP vs hold for three price moves, two pools compared.
Blog: "Learning DeFi: my experience with liquidity pools and yield on Solana." Include your IL table.

Deck: /week-3/
