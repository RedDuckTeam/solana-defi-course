---
theme: default
title: DeFi on Solana · Week 3
info: |
  Week 3: liquidity, AMMs and yield. Devnet only.
colorSchema: light
routerMode: hash
fonts:
  provider: none
transition: slide-left
mdc: true
layout: week
week: 3
heading: Liquidity, AMMs & yield
task: Provide liquidity on devnet, or to a pool the class builds
blog: "Learning DeFi: my experience with liquidity pools and yield on Solana"
drawings:
  persist: false
---

<!--
Week 3 is where the finance background pays off. Market-making, inventory risk, return measurement: they already know the vocabulary. Today we show what those look like when a formula replaces the market maker.

The original curriculum asked for Uniswap testnet or SushiSwap on Mumbai. Mumbai is gone (Polygon shut it in 2024). We use Orca or Raydium on devnet, or a pool the builders deploy.

Plan: 30 minutes of teaching (four parts), then the task live.
-->

---

# Today

<div class="today">
  <div v-click><b>1</b><span>How a market sets a price</span></div>
  <div v-click><b>2</b><span>x · y = k, by hand</span></div>
  <div v-click><b class="loss">3</b><span>Impermanent loss</span></div>
  <div v-click><b>4</b><span>Smarter curves and routing</span></div>
  <div v-click><b class="gain">5</b><span>Where yield really comes from</span></div>
</div>

<style>
.today { display: grid; gap: 0.6rem; margin-top: 1rem; }
.today > div { display: grid; grid-template-columns: 64px minmax(0, 1fr); align-items: baseline; border-bottom: 1px solid var(--rule); padding-bottom: 0.4rem; }
.today b { font-size: var(--fs-2xl); font-weight: 900; font-stretch: 62%; color: var(--chain); }
.today b.loss { color: var(--loss); } .today b.gain { color: var(--gain); }
.today span { font-size: var(--fs-lg); font-weight: 650; font-stretch: 110%; }
</style>

<!--
Five stops. The first two are mechanics, the third is the risk every LP takes, the fourth is how Solana DEXs improve on the basic pool, and the fifth is the habit we want them to leave with: every time you see a yield number, ask who is paying it.
-->

---
layout: section
tone: ink
---

# How a market sets a price

Two designs. One needs a counterparty. One doesn't.

---
clicks: 4
---

# Order book vs pool

<OrderBookVsAmm :step="$clicks" class="mt-2" />

<!--
Click 1: the order book. This is what they know from stock exchanges. Makers post bids (green, people willing to buy) and asks (red, people willing to sell). The gap between best bid and best ask is the spread.

Click 2: a market buy for 90 SOL. It eats the cheapest asks first: 30 at 150.2, then 60 at 150.5. Their average price is worse than the best ask. That is price impact in an order book.

Click 3: the pool. No makers posting prices. Liquidity providers (LPs) deposit both tokens into two "tanks", and a formula sets the price from the ratio of the tanks.

Click 4: the same buy. USDC goes in, SOL comes out, and the formula moves the price. There is no one on the other side waiting; the pool always quotes.

Why AMMs exist: on early blockchains, posting and cancelling thousands of orders was too slow and too expensive. A pool needs no active market maker. On Solana, fast slots and tiny fees made on-chain order books (Phoenix, OpenBook) and "prop AMMs" practical too, which is why the map in part 4 is wider than Ethereum's.

Finance link: an LP is a passive market maker. They earn the spread (as fees) and carry inventory risk (as impermanent loss). Ask the room where the analogy breaks: a real market maker can pull quotes and hedge; a passive LP cannot react.
-->

---
layout: section
tone: chain
---

# x · y = k

One line of maths runs billions in volume.

---
clicks: 4
---

# The whole rule

<div class="rule">
  <div class="eq"><span v-mark.circle.chain="1">x</span> · <span v-mark.circle.chain="2">y</span> = <span v-mark.box.loss="3">k</span></div>
  <div class="legend">
    <p v-click="1"><b class="chain">x</b> tokens of SOL in the pool</p>
    <p v-click="2"><b class="chain">y</b> tokens of USDC in the pool</p>
    <p v-click="3"><b class="loss">k</b> must never go down after a trade</p>
  </div>
  <div v-click="4" class="price">Price of SOL = <b>y ÷ x</b> = 15,000 ÷ 100 = <b class="chain">150 USDC</b></div>
</div>

<style>
.rule { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); align-items: center; gap: 2rem; margin-top: 2rem; }
.rule .eq { font-size: var(--fs-display); font-weight: 900; font-stretch: 118%; color: var(--ink); white-space: nowrap; }
.rule .legend p { font-size: var(--fs-md); margin: 0.6rem 0; }
.rule .legend b { font-size: var(--fs-xl); margin-right: 0.4rem; }
.rule .price { grid-column: 1 / -1; font-size: var(--fs-xl); font-stretch: 110%; border-top: 2px solid var(--ink); padding-top: 1rem; }
</style>

<!--
Click 1 and 2: x and y are just the two balances.

Click 4 (after k): the pool's price is the ratio. A pool with 100 SOL and 15,000 USDC prices SOL at 15,000 / 100 = 150 USDC. Nobody typed that price in; it falls out of the balances.

Click 3: k is the product. A swap can add one token and remove the other, but the product afterwards must be at least k. That one constraint does three jobs at once:
1. It quotes a price for any size of trade.
2. It makes bigger trades more expensive (the pool can never be fully drained, because x or y would hit zero and k would collapse).
3. With a fee, k grows over time, and that growth belongs to the LPs.

Raydium's CPMM pools use exactly this rule. The concentrated and bin designs in part 4 are refinements of it.
-->

---
clicks: 8
---

# One swap, worked by hand

<SwapMath :step="$clicks" class="mt-2" />

<!--
This is the exact example from the teacher prep. Do it on the board too.

No fee (clicks 1 to 4):
- Pool holds 100 X and 100 Y. k = 10,000. Spot price is 1 Y per X.
- Trader adds 10 X. x becomes 110.
- k must stay 10,000, so y = 10,000 / 110 = 90.909.
- Trader receives 100 − 90.909 = 9.09 Y.
They paid 10 X and got 9.09 Y, so their average price was 0.909 Y per X, about 9% worse than the spot price of 1. That gap is price impact. It is not a fee: nobody earned it. It is the curve.

With a 0.3% fee (clicks 5 to 8):
- The pool keeps 0.3% aside: only 9.97 X counts for pricing.
- y = 10,000 / 109.97 = 90.934.
- Trader receives 9.066 Y (slightly less than 9.09).
- But all 10 X went into the pool. New k = 110 × 90.934 = 10,002.7. k grew by 2.7. That growth is the LPs' fee income, shared in proportion to their pool share.

Ask: what happens if the trade is 50 X instead of 10? (y = 10,000 / 150 = 66.67, they get 33.33 Y, average 0.667: a 33% worse price.) Then go to the next slide and let them drag it.
-->

---

# Drag it

<AmmCurve :start="30" />

<p class="fs-sm muted mt-2">Bigger trade, steeper slide down the curve, worse price. Tick the fee and watch k grow.</p>

<!--
Live widget. Things to show:
1. It opens at 30 X so the legs are visible. Slide to 10: you get 9.09 Y, impact 9.09%. Matches the board.
2. Slide to 100: you get 50 Y for 100 X. Average price 0.5. The pool price after is 0.25 (y/x = 50/200). Impact 50%. Nobody sane does this; it shows why depth matters.
3. Tick the 0.3% fee: "You get" drops slightly, and k after goes above 10,000. That green number is the LPs' income.

Price impact vs slippage (students mix these up):
- Price impact: how much YOUR trade moves the price, known before you sign.
- Slippage: how much the price moves between your quote and your execution, because of OTHER trades landing first. Wallets and Jupiter let you set a slippage tolerance (say 0.5%). If the final amount out would be below "quoted × (1 − tolerance)", the transaction fails instead of filling badly. A failed transaction still pays its small network fee.
-->

---
clicks: 4
---

# Being the pool

<LpLifecycle :step="$clicks" class="mt-4" />

<!--
Click 1: Deposit. You must add both tokens at the pool's current ratio. If SOL is 150 USDC, $300 in means 1 SOL plus 150 USDC.

Click 2: Receipt. A constant-product pool gives you fungible LP tokens representing your share of the pool. A concentrated pool (Orca Whirlpools, Raydium CLMM) gives you a position NFT instead, because every position has its own price range and is not interchangeable.

Click 3: Earn. Every swap leaves its fee in the pool, so the tanks grow. Your share of the tanks grows with them.

Click 4: Withdraw. Burn the receipt and take your share of BOTH tokens, at whatever ratio the pool holds now. That last part is the setup for impermanent loss: you don't get back what you put in, you get back a share of what the pool ended up holding.

Finance link: the LP token is like a unit in a fund. NAV per unit rises with fees and moves with prices.
-->

---
layout: section
tone: loss
---

# Impermanent loss

The price of being the pool everyone trades against.

---
clicks: 4
---

# Why it happens

<div class="arb">
  <div class="box ext" v-click="1"><b>Elsewhere</b><span>SOL jumps to <strong>$200</strong></span></div>
  <div class="box pool"><b>Your pool</b><span>still says <strong>$100</strong></span></div>
  <div class="who" v-click="2">Arbitrageurs buy cheap SOL from the pool until it says $200</div>
  <div class="result" v-click="3">
    <div><span>Pool had</span><b>5 SOL + 500 USDC</b></div>
    <div><span>Pool now has</span><b>3.54 SOL + 707 USDC</b></div>
  </div>
  <div class="worth" v-click="4">At $200: holding = <b>$1,500</b> · your pool share = <b class="chain">$1,414</b> · gap <b class="loss">−5.72%</b></div>
</div>

<style>
.arb { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem 2rem; margin-top: 1.4rem; }
.arb .box { border: 2px solid var(--ink); border-radius: var(--r-md); padding: 0.8rem 1rem; background: #fff; }
.arb .box b { display: block; font-size: var(--fs-sm); color: var(--muted); font-weight: 600; }
.arb .box span { font-size: var(--fs-lg); }
.arb .ext strong { color: var(--gain); }
.arb .pool { border-color: var(--chain); }
.arb .who { grid-column: 1 / -1; font-size: var(--fs-md); font-weight: 650; color: var(--loss); text-align: center; padding: 0.4rem; border-top: 2px dashed var(--loss); border-bottom: 2px dashed var(--loss); }
.arb .result { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2rem; }
.arb .result span { display: block; font-size: var(--fs-sm); color: var(--muted); }
.arb .result b { font-size: var(--fs-xl); font-stretch: 112%; }
.arb .worth { grid-column: 1 / -1; font-size: var(--fs-md); border-top: 2px solid var(--ink); padding-top: 0.6rem; }
</style>

<!--
Set-up: you deposit $1,000 as 5 SOL at $100 plus 500 USDC. k = 5 × 500 = 2,500.

Click 1: SOL's price jumps to $200 on every other market.

Click 2: the pool doesn't know. It still prices SOL at $100. Arbitrageurs buy SOL from your pool (cheap) and sell elsewhere (expensive) until the pool's price is $200 too. They are the ones who keep pool prices honest, and they profit from it.

Click 3 and 4: where the pool ends up, and what it's worth. Price = y/x = 200 and x·y = 2,500, so x = √(2,500/200) = 3.54 SOL and y = 707 USDC.
- Pool value now: 3.54 × 200 + 707 = $1,414.
- If you had just held: 5 × 200 + 500 = $1,500.
- Gap: $86, or 5.72%. That gap is impermanent loss.

Key insight: the pool sold your SOL on the way up. It always sells the asset that is rising and buys the one that is falling. Finance students will recognise this: it's a short volatility position, like being short an option. Fees are the premium you collect for it.

"Impermanent" because if the price returns to $100, the gap closes. It becomes permanent the moment you withdraw at a different price. Many people say "divergence loss" instead, which is more honest.
-->

---
clicks: 4
---

# The table to memorise

<IlSteps :step="$clicks" class="mt-4" />

<p v-click="4" class="fs-sm muted mt-3">Same loss for 2× and 0.5×. Direction doesn't matter, only distance.</p>

<!--
$1,000 deposit, 5 SOL at $100 + 500 USDC, no fees.

- 1.25×: hold $1,125, LP $1,118, IL −0.62%. Small moves barely hurt.
- 2×: hold $1,500, LP $1,414, IL −5.72%. The example from the previous slide.
- 4×: hold $2,500, LP $2,000, IL −20%. Big moves hurt a lot.
- 0.5×: hold $750, LP $707, IL −5.72%. A halving costs the same as a doubling.

Formula, where r is the price ratio (new price ÷ old price):
IL = 2√r ÷ (1 + r) − 1

Students build this table in a spreadsheet in the task. Let them check each row against the formula.

Note the LP is still UP in dollars in the 2× and 4× cases. IL is measured against holding, not against your starting money. That trips people up in their blog posts.
-->

---

# Can fees win it back?

<ImpermanentLoss />

<!--
Live widget. Same $1,000 deposit.

Try:
1. Click 2×, fee APR 20%, 90 days: fees are about $49, IL gap is $86. Holding wins.
2. Push days to 365: fees about $200. LP wins.
3. Click 4×: gap is $500. Even a year of 20% fees doesn't cover it.
4. Click 1.25×: gap is $7. Fees win almost immediately.

The lesson: LPing is a bet that fees will outrun how far prices drift apart. Stable pairs (USDC/USDT) have almost no IL, so lower fees are enough. Volatile pairs need high fees and high volume to be worth it.

Simplifications in this widget (say them out loud): fee APR is assumed constant and applied to the starting $1,000; real fee income depends on daily volume and your share of the pool, and it compounds into the position. The point is the shape, not the exact dollars.

Do not let anyone conclude "positive fees means positive returns". That is the exact sentence the curriculum warns about.
-->

---

<Quiz
  q="SOL doubles. You were an LP in a SOL/USDC pool with no fees. Compared with just holding, you have:"
  :options="['More dollars', 'The same', 'About 5.7% fewer dollars', 'You lost everything']"
  :answer="2"
  why="Arbitrageurs bought your SOL on the way up. At 2×, LP value is 2√2 ÷ 3 ≈ 0.943 of holding."
/>

<!--
Most will get this now. If someone picks A, ask them whether their LP value went up in dollars (yes, from $1,000 to $1,414) and whether it went up as much as holding ($1,500). Then they see the distinction.
-->

---
layout: section
tone: chain
---

# Beyond x · y = k

How Solana's DEXs put liquidity where trades happen.

---
clicks: 4
---

# Four ways to hold liquidity

<CurveFamilies :step="$clicks" class="mt-4" />

<!--
Each mini chart: x axis is price, height is how much liquidity sits at that price, red dashed line is the current price.

Click 1, constant product (Raydium CPMM): liquidity is spread evenly from zero to infinity. Most of it sits at prices that will never trade. Simple, permissionless, but capital-inefficient.

Click 2, concentrated liquidity (Orca Whirlpools, Raydium CLMM): each LP chooses a price range. Depth piles up near the current price, so trades get much less price impact for the same total dollars. The catch is on the next slide.

Click 3, bins (Meteora DLMM, "dynamic liquidity market maker"): liquidity sits in discrete price buckets. Inside one bin, the price is fixed, so a trade that fits inside the active bin (green) has zero slippage. Meteora also uses dynamic fees that rise with volatility.

Click 4, prop AMMs: no passive curve at all. A professional market maker runs its own program and updates its quotes on-chain, often every slot (~400ms). HumidiFi led Solana spot DEX volume in late 2025 (roughly 30 to 47%), then BisonFi, another prop AMM, passed it in January 2026. This only works because Solana is fast and cheap enough to update quotes constantly. Ask: is that still "decentralized"? It is permissionless to trade against, but one firm sets the price. Good blog-post material.

For the teacher: be ready to explain that LPs in Whirlpools and CLMM get position NFTs, not LP tokens.
-->

---

# Concentrated: deeper, until it isn't

<ConcentratedRange />

<!--
Live widget. Default: SOL at $150, range $120 to $185.

1. In range: the violet block is much taller than the grey full-range bar. That height multiple is how much deeper your dollars are than a full-range LP's (about 9.7× here). You earn roughly that multiple more fees per dollar.
2. Narrow the range (move low to 140, high to 160): depth jumps to about 30× (the bar is capped so it stays on screen). More fees, but...
3. Drag SOL price to 100: out of range. You now hold 100% SOL (the asset that fell), and you earn nothing until price comes back. Drag to 220: 100% USDC, you sold all your SOL on the way up and missed the rest of the rally.

That is the trade-off in one line: concentrated liquidity means more fees per dollar AND more impermanent loss when price leaves your range. Active LPs rebalance their ranges; Kamino's vaults automate exactly that (back in part 5).

Formula used for depth (Uniswap v3 maths, same as Whirlpools): for a range [a, b] at price p, the multiple vs full range is 2√p ÷ (2√p − p/√b − √a).
-->

---
clicks: 3
---

# Why Jupiter splits your order

<RouteSplitMath :step="$clicks" class="mt-4" />

<!--
Made-up pool sizes, real constant-product maths.

Click 1: send all 100 SOL through the deepest pool (1,000 SOL deep). Impact = 100 ÷ 1,100 = 9.1%.

Click 2: an aggregator splits the order in proportion to depth: 50 / 30 / 20.

Click 3: each pool now moves only 50 ÷ 1,050 = 30 ÷ 630 = 20 ÷ 420 = 4.8%. Same total, about half the impact.

This is what Jupiter does on every quote, across Raydium, Orca, Meteora, prop AMMs and others. Most Solana users never touch a DEX directly; they swap through Jupiter. Week 1's task already had them read a Jupiter route. Remind them of the route they traced.

Builders: the Swap API (GET https://api.jup.ag/swap/v2/order, free key from portal.jup.ag) returns the route plan. quote-api.jup.ag/v6 is being shut down. lite-api.jup.ag still works for now (its retirement was postponed with no new date), but teach api.jup.ag with a key.
-->

---
layout: section
tone: gain
---

# Where yield comes from

Every yield has a payer. Find them.

---
clicks: 5
---

# Who pays you?

<YieldSources :step="$clicks" class="mt-2" />

<!--
The analyst habit for this whole course: for every yield number, ask who pays it, what activity generates it, and what makes it stop.

Click 1, LP fees: paid by traders. Real and sustainable as long as volume lasts. Minus impermanent loss.

Click 2, staking: SOL stakers earn network issuance (inflation rewards) plus a share of MEV tips. Liquid staking tokens like JitoSOL pass both through and stay tradeable; JitoSOL is the one known for adding MEV tips on top of staking. Others: JupSOL, mSOL (Marinade), Sanctum's family. Risk: the LST can trade below its SOL value in a panic, and there is smart-contract risk.

Click 3, lending interest: paid by borrowers. Next week in detail.

Click 4, token emissions: the protocol prints its own token and hands it out to attract deposits. This is the "yield farming" of DeFi Summer 2020. Paid by dilution of everyone holding the token. It ends when the budget runs out, and the token's price often falls as farmers sell. Red, deliberately.

Click 5, vaults (Kamino): no new source of money. A vault automates one of the strategies above (for example, rebalancing a concentrated LP range) and takes a fee. You add a strategy layer and another contract to trust.

Finance link: separate protocol revenue (real fees from real users) from incentives (subsidies). The curriculum asks for this distinction explicitly in the week 3 report.
-->

---

# The APY trap

<AprApy />

<!--
Live widget. $1,000 of a farm token, rewards paid in the same token, one year.

1. APR vs APY: APR is simple interest. APY includes compounding: (1 + APR/n)^n − 1. At 40% APR compounded daily, APY is 49.2%. Protocols love quoting APY because it's the bigger number. Set it to Yearly: they match.
2. The trap: drag token price to −50%. You end the year with 1,492 tokens worth $746. A "49% APY" farm lost you 25% in dollars.
3. Drag APR to 200% and token price to −70%: still a loss. This is exactly how many 2020 to 2022 farms played out.

Questions to ask the room:
- Is the yield denominated in the token you care about?
- Is the APY a historical average or the last 24 hours annualised?
- Is it gross or net of fees and IL?

The curriculum's line: a high advertised yield does not necessarily mean a good investment. This widget is the proof.
-->

---

<Quiz
  q="A farm advertises 300% APY, paid in its own new token. What is the first question to ask?"
  :options="['Is it audited?', 'Who is paying this, and in what?', 'Daily or weekly compounding?', 'What is the TVL?']"
  :answer="1"
  why="300% paid in a freshly printed token is usually dilution. If the token falls faster than it pays, you lose money."
/>

<!--
All four are reasonable questions, and B comes first. Audits and TVL come back in week 5 due diligence.
-->

---
clicks: 4
---

# Before the task: two "USDC"s

<DevUsdcMismatch :step="$clicks" class="mt-6" />

<p v-click="4" class="fs-lg mt-10">On mainnet, anyone can mint a token called "USDC". <b class="chain">Check the mint address.</b></p>

<!--
Teaching moment from the handbook, and the best possible proof of week 2's rule "the mint address is the identity".

Click 1: in week 2 everyone got devnet USDC from Circle's faucet, mint 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU.

Click 2: Orca's devnet examples use their own devUSDC, mint BRjpCHtyQLNCo8gqRUr8jtdAj5AjPYQaoqbvcZiHok1k.

Click 3: both are called USDC in a wallet. They are completely different assets. A pool built for one will not accept the other. A program never looks at a token's name; it looks at the mint.

Mainnet lesson: scammers mint tokens named USDC all the time. Always check the mint address against the issuer's official one.
-->

---

# Task: be a liquidity provider

<Tracks>
<template #users>

Pick the route your class can run:

- **A** Raydium devnet UI: swap, add liquidity
- **C** Add liquidity to the class pool with your two week-2 tokens

Then build the impermanent-loss table: 1.25×, 2×, 4×.

</template>
<template #builders>

- **B** Orca SDK on devnet: `setWhirlpoolsConfig('solanaDevnet')`, open a position in the SOL/devUSDC Whirlpool
- **C** Deploy the constant-product pool from `program-examples/tokens/token-swap` or Blueshift's Pinocchio AMM

</template>
</Tracks>

<Callout tone="warn" class="mt-3" title="Test the route yourself first">
Raydium: devnet setting on raydium.io, program IDs from docs.raydium.io only. Orca pool: <code>3KBZiL…z1HvPt</code>
</Callout>

<!--
Three routes from the handbook. Pick the one that works in your class, after testing it yourself 48 hours before.

A. Raydium devnet. Raydium announced a working devnet UI through its infra account (@0xINFRA) on 15 July 2025: swap, create pools, test tokens. It is a devnet setting inside raydium.io, not a separate site; find the toggle yourself before class. Use the devnet program IDs from docs.raydium.io/reference/program-addresses: CPMM DRaycpLY18LhpbydsBWbVJtxpNv9oXPgjRSfpF2bWpYb, CLMM DRayAUgENGQBKVaX8owNhgzkEDyoHTGVEGHVJT1E9pfH, AMM v4 DRaya7Kj3aMWQSy19kSjvmuwq9docCHofyP9kanQGaav. The raydium-cpi-example README lists a different CPMM ID (CPMDW...) that does not match the UI; that issue (#16) was still open on 14 Oct 2026. Devnet APIs: api-v3-devnet.raydium.io and transaction-v1-devnet.raydium.io.

B. Orca SDK on devnet. Orca's docs use an existing SOL/devUSDC Whirlpool on devnet and setWhirlpoolsConfig('solanaDevnet'). Whirlpools program: whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc. Pool: 3KBZiL2g8C7tiJ32hTv5v3KM7aK9htpqTw4cTXz1HvPt. Package: @orca-so/whirlpools. Remember it needs Orca's devUSDC, not Circle's.

C. Build the pool. Builders deploy the constant-product example from solana-developers/program-examples/tokens/token-swap (Anchor; create pool, deposit, withdraw, swap; fee in basis points) or do Blueshift's Pinocchio AMM challenge. Users then provide liquidity to it with two tokens minted in week 2. This is the most reliable route because you control every piece.

Everyone: the impermanent-loss spreadsheet with at least three price scenarios, and a comparison of four yield sources.
-->

---
layout: center
---

# Blog post

<div class="fs-2xl wide" style="font-weight:800; max-width: 26ch; line-height: 1.1">"Learning DeFi: my experience with liquidity pools and yield on Solana"</div>

<div v-click class="fs-md mt-4">
Include your impermanent-loss table, and one yield you found and who pays it.
</div>

<!--
Required: the impermanent-loss table. Encourage one honest paragraph on whether they would LP with real money, and why.

The curriculum's week 3 report also asks for: order book vs AMM comparison, a worked AMM trade, an LP return model with at least three scenarios, four sources of yield compared, an assessment of one real Solana exchange, and why advertised yield is not a guaranteed return. The blog post can be the short version.
-->

---
layout: section
tone: ink
---

# Teacher prep

For you, before class. Skip this live.

---

# You, before class

<div class="prep">

1. **Work the swap by hand.** 100 / 100 pool, swap 10 X in: 9.09 Y out. Redo with 0.3% fee: 9.066.
2. **Build the IL spreadsheet.** 1.25×, 2×, 4×: LP vs holding. Reuse it in class.
3. **Learn three curve families.** CPMM, concentrated (Whirlpools, CLMM), bins (DLMM). Then how a prop AMM differs.
4. **Skim Blueshift's Pinocchio AMM** (deposit, swap) so you can point builders to it.
5. **Run your chosen task route** on a fresh wallet, 48 hours before.

</div>

<style>
.prep ol li { font-size: var(--fs-base); margin: 0.5rem 0; }
</style>

<!--
Straight from the handbook's "You, before class" lane for week 3.

The swap: k = 10,000. Swap 10 X in: y = 10,000 / 110 ≈ 90.91, trader gets ≈ 9.09 Y. With a 0.3% fee: 9.97 X counts, y = 10,000 / 109.97 ≈ 90.934, trader gets ≈ 9.066 Y, k rises to ≈ 10,002.7.

The IL sheet: columns for price ratio r, hold value, LP value (= starting value × √r for a 50/50 pool), IL = 2√r/(1+r) − 1. Values: 1.25× → −0.62%, 2× → −5.72%, 4× → −20.0%.

Curve families: constant product (Raydium CPMM), concentrated liquidity (Orca Whirlpools, Raydium CLMM), bins (Meteora DLMM). A prop AMM is a market maker quoting its own prices on-chain instead of a passive curve.

Blueshift: learn.blueshift.gg, Pinocchio AMM challenge (constant-product implementation with deposit and swap).
-->

---

# Addresses and checks

| What | Value |
|---|---|
| Orca Whirlpools program (devnet) | `whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc` |
| Orca SOL/devUSDC pool | `3KBZiL2g8C7tiJ32hTv5v3KM7aK9htpqTw4cTXz1HvPt` |
| Orca devUSDC mint | `BRjpCHtyQLNCo8gqRUr8jtdAj5AjPYQaoqbvcZiHok1k` |
| Circle devnet USDC mint | `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU` |
| Raydium devnet APIs | `api-v3-devnet.raydium.io`, `transaction-v1-devnet.raydium.io` |
| Pool example | `solana-developers/program-examples/tokens/token-swap` |

<Callout tone="warn" class="mt-3" title="Verify before class">
Raydium's devnet is a setting on raydium.io (announced 15 Jul 2025). Use program IDs from docs.raydium.io, not the cpi-example README (CPMM mismatch, issue #16, still open).
</Callout>

<!--
All values from the course handbook, checked 11 October 2026. Re-check the Raydium route the week you teach. If it fails, fall back to route C (the class pool), which only depends on devnet itself.
-->
