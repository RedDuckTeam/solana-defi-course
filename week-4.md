---
theme: default
title: DeFi on Solana · Week 4
info: |
  Week 4: lending, borrowing and stablecoins. Devnet and spreadsheets.
colorSchema: light
routerMode: hash
fonts:
  provider: none
transition: slide-left
mdc: true
layout: week
week: 4
heading: Lending, borrowing & stablecoins
task: Model a loan to liquidation in a spreadsheet, with a live Pyth price
blog: "Understanding lending and borrowing in DeFi"
drawings:
  persist: false
---

<!--
Week 4 is credit. Accountants know secured lending, LTV and margin calls already. Today: what changes when the lender is a program, the borrower is anonymous, and the margin call is a bot.

Honest note for the class: this is the one task from the original curriculum that doesn't port cleanly. The original said "borrow and lend on Aave or Compound testnet". No Solana lender had a reliably working devnet market when this course was checked (11 October 2026). So everyone models it in a spreadsheet with a live price, builders can use a mainnet fork (Surfpool), and there is one optional real-money step, clearly flagged.
-->

---

# Today

<div class="today">
  <div v-click><b>1</b><span>A bank with no banker</span></div>
  <div v-click><b>2</b><span>The four numbers</span></div>
  <div v-click><b class="loss">3</b><span>Liquidation, step by step</span></div>
  <div v-click><b>4</b><span>Where prices come from</span></div>
  <div v-click><b class="gain">5</b><span>Stablecoins: the dollars of DeFi</span></div>
</div>

<style>
.today { display: grid; gap: 0.6rem; margin-top: 1rem; }
.today > div { display: grid; grid-template-columns: 64px minmax(0, 1fr); align-items: baseline; border-bottom: 1px solid var(--rule); padding-bottom: 0.4rem; }
.today b { font-size: var(--fs-2xl); font-weight: 900; font-stretch: 62%; color: var(--chain); }
.today b.loss { color: var(--loss); } .today b.gain { color: var(--gain); }
.today span { font-size: var(--fs-lg); font-weight: 650; font-stretch: 110%; }
</style>

<!--
Five stops. Part 3 is the centrepiece: the liquidation walkthrough is what they'll model in the task. Part 4 links to week 5 (oracle manipulation is the Mango hack). Part 5 matters for Nigeria in particular.
-->

---
layout: section
tone: ink
---

# A bank with no banker

Lenders, borrowers, and a program in the middle.

---

# No name, no credit score, no court

<div class="nocredit">
  <div v-click class="bank">
    <b class="ink">A bank lends on</b>
    <ul><li>who you are</li><li>your income and history</li><li>the right to sue you</li></ul>
  </div>
  <div v-click class="chainbox">
    <b class="chain">A lending program knows</b>
    <ul><li>an address</li><li>what that address locked up</li></ul>
  </div>
  <div v-click class="rule">So every loan is <b>worth less than its collateral</b>.<br><span class="big">$150 in → borrow at most $105</span></div>
</div>

<style>
.nocredit { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.2rem 2rem; margin-top: 1rem; }
.nocredit .bank, .nocredit .chainbox { border-top: 6px solid var(--ink); padding-top: 0.5rem; }
.nocredit .chainbox { border-color: var(--chain); }
.nocredit b { font-size: var(--fs-lg); }
.nocredit li { font-size: var(--fs-md); }
.nocredit .rule { grid-column: 1 / -1; font-size: var(--fs-lg); border: 2px solid var(--ink); border-radius: var(--r-md); padding: 0.8rem 1rem; background: #fff; }
.nocredit .rule .big { font-size: var(--fs-xl); font-weight: 800; font-stretch: 112%; color: var(--chain); }
</style>

<!--
Why DeFi lending is over-collateralised.

A bank can lend unsecured because it knows who you are, can check your income, and can take you to court. A lending program on Solana knows only an address and what that address has locked up. If you walk away, there is no one to chase.

So the only protection is collateral worth more than the loan, plus a way to sell it before it drops below the loan's value. With a 70% maximum loan-to-value (example market), $150 of SOL lets you borrow at most $105.

Ask the room: why would anyone borrow less than they own? Answers: to get dollars without selling SOL (no taxable sale, keep the upside), to go leveraged long (borrow USDC, buy more SOL), to short (borrow SOL, sell it), or to farm a yield higher than the borrow rate.

Finance link: this is a secured margin loan with automated margin calls, closer to a broker's margin account than to a bank loan.
-->

---
clicks: 6
---

# Who pays whom

<LendingFlow :step="$clicks" class="mt-2" />

<!--
Click 1: lenders supply USDC into a shared pool and get a receipt token (like a deposit certificate) that grows in value as interest accrues.

Click 2: a borrower deposits SOL as collateral. It is locked by the program, not handed to a person.

Click 3: the borrower takes USDC out of the pool, up to the max LTV.

Click 4: the borrower pays interest, continuously, into the pool. Lenders' receipts grow.

Click 5: the protocol keeps a slice of the interest (the reserve factor) as revenue and as a buffer against bad debt. Week 5 due diligence asks: where does the protocol's revenue come from? Here.

Click 6: liquidator bots watch every position on the chain, all the time. They are not employees; anyone can run one. They profit when a position becomes unsafe (part 3).

Difference from a bank: lenders here can see every loan and every piece of collateral. They cannot see who the borrower is. And there's no maturity date: loans stay open until repaid or liquidated.
-->

---

# Solana's lenders

<div class="lenders">
  <div v-click class="col">
    <h3>Shared pool</h3>
    <div class="pool"><span>SOL</span><span>USDC</span><span>JitoSOL</span><span>BONK</span></div>
    <p>Every asset backs every loan. One bad asset can hurt everyone.</p>
  </div>
  <div v-click class="col">
    <h3>Isolated markets</h3>
    <div class="iso"><div><span>SOL</span><span>USDC</span></div><div><span>JitoSOL</span><span>SOL</span></div><div class="bad"><span>BONK</span><span>USDC</span></div></div>
    <p>Each market stands alone. A bad asset only hurts its own market.</p>
  </div>
</div>

<p v-click class="fs-md mt-4"><b class="chain">Kamino Lend · Jupiter Lend · Save · marginfi</b></p>

<style>
.lenders { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2rem; margin-top: 0.6rem; }
.lenders h3 { margin: 0 0 0.5rem !important; }
.lenders p { font-size: var(--fs-sm); color: var(--ink-2); }
.lenders .pool, .lenders .iso > div { display: flex; flex-wrap: wrap; gap: 0.4rem; border: 2px solid var(--chain); border-radius: var(--r-md); padding: 0.6rem; background: var(--chain-soft); }
.lenders .iso { display: grid; gap: 0.4rem; }
.lenders .iso .bad { border-color: var(--loss); background: var(--loss-soft); }
.lenders span { background: #fff; border: 1.5px solid var(--ink); border-radius: var(--r-sm); padding: 0.1rem 0.6rem; font-weight: 700; font-size: var(--fs-sm); }
</style>

<!--
The main Solana lenders as of October 2026: Kamino Lend, Jupiter Lend (launched August 2025), Save (formerly Solend), and marginfi. Same mechanics as Aave and Compound on Ethereum: collateral, LTV, liquidation.

Two designs:
- Shared pool: all assets sit in one pool and every deposit backs every loan. Efficient, but a bad or manipulated asset can create bad debt that the whole pool absorbs. This is exactly what the Mango Markets attack exploited (week 5).
- Isolated markets: each market is its own pair or small group. A failure in the BONK/USDC market cannot touch the SOL/USDC market. Safer, more fragmented.

Most modern lenders mix the two. Kamino, for example, runs a main market and separate isolated ones.

marginfi went through ownership changes in 2026: check its current name and app URL before you mention it in class.

TVL rankings move weekly. If you quote one, open DefiLlama and say the date.
-->

---
layout: section
tone: chain
---

# The four numbers

LTV, liquidation threshold, health factor, utilization.

---
clicks: 5
---

# One position, one bar

<LtvBar :step="$clicks" class="mt-6" />

<!--
Example market (not a real one): max LTV 70%, liquidation threshold 80%. Real markets set these per asset; always look them up.

Click 1: collateral. 10 SOL at $150 = $1,500.

Click 2: debt. You borrowed 900 USDC. LTV = debt ÷ collateral = 900 ÷ 1,500 = 60%.

Click 3: max LTV, 70%. The program won't let you borrow beyond $1,050 against this collateral. That's the "how much can I borrow" number.

Click 4: liquidation threshold, 80%. If your LTV ever reaches 80% (because SOL falls or interest piles up), liquidators may repay part of your debt and take your collateral at a discount. The gap between 70% and 80% is your safety buffer.

Click 5: health factor. HF = collateral × liquidation threshold ÷ debt = 1,500 × 0.8 ÷ 900 = 1.33. Above 1 is safe. At 1.00 exactly, you are on the line. Below 1, liquidatable. Kamino, Save and others show some version of this number in the app.

Students mix up max LTV and liquidation threshold constantly. One is a ceiling for borrowing, the other a trigger for selling. Draw this bar on the board.
-->

---

# Your position, live

<HealthFactor />

<!--
Live widget, same example market (70% / 80%), 10 SOL collateral.

Do these in order:
1. Start: $150, $900 borrowed. HF 1.33, liquidation price $112.50.
   Liquidation price = debt ÷ (SOL amount × threshold) = 900 ÷ (10 × 0.8) = $112.50. This is the single most useful number for a borrower.
2. Drag price to $130: HF 1.16, "one bad candle away".
3. Drag to $110: HF 0.98. Liquidatable. This is the handbook's walkthrough; the next slide replays it.
4. Reset to $150, push the loan to $1,050: you're at max LTV. Notice "can still borrow" hits $0.
5. Push it to $1,200: the program wouldn't allow this, but the widget does, so they can see HF drop below 1 instantly.

Interest is not modelled here. In reality debt grows every slot, so an untouched position drifts towards liquidation even if prices stay flat.
-->

---
layout: section
tone: loss
---

# Liquidation

What happens at a health factor below 1.

---
clicks: 7
---

# The walkthrough

<LiquidationReplay :step="$clicks" class="mt-2" />

<!--
This is the handbook's example. Example market: liquidation threshold 80%, close factor 50%, liquidation bonus 5%. Real numbers vary per protocol and asset.

Click 1: deposit 10 SOL at $150 ($1,500). Borrow 900 USDC. LTV 60%, HF 1.33.

Click 2: SOL falls to $130. Collateral $1,300. LTV 69.2%, HF 1.16.

Click 3: SOL at $112.50. LTV exactly 80%. HF 1.00. On the line.

Click 4: SOL at $110. Collateral $1,100. LTV = 900 ÷ 1,100 ≈ 82%. HF 0.98. The bot's alarm goes off.

Click 5: the liquidator repays 450 USDC of the borrower's debt (the close factor caps it at 50% per liquidation in this example).

Click 6: in return, the program gives the liquidator $450 of SOL plus a 5% bonus: $472.50 of SOL, which at $110 is 4.295 SOL. Their profit is $22.50, minus transaction fees and any slippage when they sell the SOL. Bots compete for this, so it happens within seconds.

Click 7: the borrower now has 5.705 SOL ($627.55) against $450 debt. HF = 627.55 × 0.8 ÷ 450 = 1.12. Safe again, but they paid a $22.50 penalty and lost almost half their SOL.

Why this is good for lenders: the debt is repaid while the collateral is still worth more than it. If prices crash too fast for liquidators (or the oracle lags), collateral can end up worth less than the debt. That's bad debt, and lenders absorb it.

Ask the teacher-prep question out loud: compare 82% to a real market's liquidation threshold for SOL on Kamino or Jupiter Lend. Look it up live.
-->

---
clicks: 4
---

# Flash loans: a million, for one transaction

<FlashLoan :step="$clicks" class="mt-4" />

<!--
Liquidators often don't have 450 USDC lying around. Flash loans solve that.

Click 1: borrow any amount the pool has, with no collateral.
Click 2: use it. Typical uses: repay someone's debt in a liquidation and receive their discounted collateral; arbitrage between two pools; refinance a position from one lender to another.
Click 3: repay the loan plus a small fee, in the same transaction. If you do, it lands, and you keep the profit.
Click 4: the other ending. If the loan isn't repaid by the end of the transaction, the program refuses to finish, and the whole transaction is undone, as if nothing happened. The only cost is the network fee.

On Solana the "same transaction" rule is enforced by instructions inside one transaction (the lender checks that a repay instruction comes later in the same transaction).

The dark side, for week 5: flash loans also let an attacker borrow huge sums for a few hundred milliseconds to manipulate a thin market's price. The loan isn't the bug; the bug is a protocol trusting a price that one transaction can move.
-->

---

# What borrowing costs

<UtilizationKink />

<!--
Live widget. Example parameters (not a real market): borrow rate rises from 0% to 4% as utilization goes to 80% (the kink), then from 4% to 64% between 80% and 100%. Reserve factor 10%.

Utilization = borrowed ÷ supplied. It's the share of the pool's cash that's lent out.

1. At 60%: borrowers pay 3%, lenders earn 1.6%. Lenders earn less than borrowers pay because (a) only 60% of their money is lent out, and (b) the protocol keeps 10%. Lender rate = borrow rate × utilization × (1 − reserve factor).
2. Drag to 80%: the kink. 4% borrow, about 2.9% supply.
3. Drag to 95%: borrowing jumps to about 49%. Why so steep? At 100% utilization there is no cash left, so lenders cannot withdraw. The steep slope pulls in new deposits and pushes borrowers to repay, defending withdrawals.

Finance link: this is a money market with an administered rate curve instead of a central bank. Ask: what happens in a panic, when everyone wants to withdraw at once? (Utilization spikes, rates explode, and some lenders wait. Liquidity risk, not credit risk.)
-->

---

<Quiz
  q="10 SOL collateral, 900 USDC debt, liquidation threshold 80%. At what SOL price can you be liquidated?"
  :options="['$90.00', '$112.50', '$128.57', '$150.00']"
  :answer="1"
  why="Liquidation price = debt ÷ (SOL × threshold) = 900 ÷ (10 × 0.8) = $112.50."
/>

<!--
C ($128.57) is the max LTV price (900 ÷ (10 × 0.7)): the point where you can't borrow more, not where you get liquidated. A good wrong answer to discuss.
-->

---
layout: section
tone: chain
---

# Where prices come from

A lender is only as safe as its price feed.

---
clicks: 7
---

# How Pyth delivers a price

<PythPull :step="$clicks" class="mt-2" />

<!--
A Solana program cannot look at Binance. It only sees accounts passed into its transaction. So prices must be brought on-chain by an oracle. Pyth is the main one on Solana (Switchboard is the other).

Click 1: publishers. Exchanges, market makers and trading firms publish their own prices for SOL/USD.
Click 2: Pythnet, Pyth's own appchain, aggregates them into one price plus a confidence interval, continuously.
Click 3: Hermes is Pyth's web service. It serves the latest price update, signed so that the Pyth program on Solana can verify it.
Click 4: your app (the lending UI) fetches the latest update from Hermes.
Click 5: this is the "pull" part. The app puts two instructions in one transaction: first post the signed price update, then borrow. The price arrives with the user's action, so it's fresh.
Click 6: the lending program checks the update is genuine (signature), is the right feed (SOL/USD, not some other account), and isn't too old. Then it values your collateral.
Click 7: decoding. Prices come as an integer plus an exponent. 15234000000 × 10^−8 = $152.34. The confidence interval is encoded the same way.

Compare with Chainlink on Ethereum, which is mostly "push": the oracle writes prices on a schedule and contracts read the last value.

Why it matters for week 5: check 6 is everything. A program that accepts a price account without verifying what it is, or that trusts a price from a thin market, can be drained. Mango (2022) and Loopscale (2025) were pricing failures.

SOL/USD feed id: ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d
-->

---

# Try it in your browser

<div class="hermes">
  <p class="fs-md">Paste this, then the SOL/USD feed id:</p>
  <code class="url">hermes.pyth.network/v2/updates/price/latest?ids[]=</code>
  <code class="id">ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d</code>
  <div v-click class="read">
    <div><small>Find</small><b class="mono">"price"</b> and <b class="mono">"expo"</b> in <b class="mono">parsed</b></div>
    <div><small>Compute</small><b class="mono">price × 10^expo</b></div>
    <div><small>Write down</small><b>the time you looked</b></div>
  </div>
</div>

<style>
.hermes { display: grid; gap: 0.6rem; margin-top: 1rem; }
.hermes code { display: block; font-size: var(--fs-md) !important; padding: 0.5rem 0.8rem !important; word-break: break-all; }
.hermes .id { font-size: var(--fs-sm) !important; }
.hermes .read { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin-top: 0.8rem; }
.hermes .read > div { border-top: 3px solid var(--chain); padding-top: 0.4rem; }
.hermes small { display: block; font-size: var(--fs-xs); color: var(--muted); }
.hermes .read b { font-size: var(--fs-base); }
</style>

<!--
Do this live. Open https://hermes.pyth.network/v2/updates/price/latest?ids[]=ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d in a browser.

The JSON has a "binary" part (the signed update, what the app would post on-chain) and a "parsed" part. In parsed[0].price you'll find "price", "conf", "expo" and "publish_time". Price in dollars = price × 10^expo. Confidence the same way.

This is the live price they'll use in the spreadsheet task. publish_time is a Unix timestamp; have them convert it, and note the time they looked (course rule 3).
-->

---
layout: section
tone: gain
---

# Stablecoins

The dollars of DeFi.

---
clicks: 3
---

# Three ways to hold $1

<StablecoinTypes :step="$clicks" class="mt-2" />

<!--
The bars show what backs one coin. Dashed line = $1 of backing.

Click 1, fiat-backed: a company holds cash and short-term government bills, and redeems 1 coin for $1 (for verified customers). USDC (Circle), USDT (Tether), PYUSD (issued by Paxos for PayPal), USDG (Paxos, from Singapore). This is almost all of Solana's stablecoin supply. Risks: the issuer, its banks, the quality of reserves, and the issuer's power to freeze coins (they can, on Solana too).

Click 2, crypto-backed: DAI from MakerDAO (rebranded to Sky; the new coin is USDS). Users lock more than $1 of crypto per coin minted (the bar goes above the line), and vaults are liquidated if they slip, exactly like today's lending. Teach it as history and contrast: Solana has no big native coin of this kind.

Click 3, algorithmic: UST on Terra. Backed by nothing but the market value of a sister token (LUNA): you could always burn $1 of LUNA to mint 1 UST. When confidence broke in May 2022, people redeemed UST for LUNA, LUNA's price collapsed, which made UST less credible, and both spiralled to near zero. Tens of billions of dollars of value disappeared within days. The bar is below the line on purpose.

Solana numbers: stablecoin supply on Solana hit a reported record of $17.3B on 25 September 2026, mostly USDC (Solana Compass). Quote with the date.
-->

---

# What holds the peg

<PegArbitrage />

<!--
Live widget, for fiat-backed coins.

1. Price $0.97: arbitrageurs buy at 97 cents and redeem with the issuer for $1. Buying lifts the market price; redeeming removes coins. The green arrow is that pull.
2. Drag above $1: mint new coins at $1 from the issuer and sell at $1.02. Selling pushes the price down.
3. Untick "issuer is redeeming". The pull disappears. Nothing forces the price back except belief.

Real example: in March 2023 Circle said about $3.3 billion of USDC reserves were stuck at Silicon Valley Bank, which failed on a Friday. Banks were closed for the weekend, redemptions couldn't settle, and USDC traded down to roughly 87 to 88 cents. It came back to $1 once US authorities said SVB depositors would be made whole. Peg mechanisms depend on the plumbing behind them.

The curriculum's line: don't assume a stablecoin is the same as insured bank money just because it targets $1. Compare: who owes you, can you redeem, is there deposit insurance (no), can it be frozen (yes).
-->

---

# Why it matters here

<div class="ngn">
  <div v-click class="c"><b>Payments</b><p>Settles in under a second for a fraction of a cent, any day of the week.</p></div>
  <div v-click class="c"><b>Savings</b><p>A dollar balance without a dollar bank account.</p></div>
  <div v-click class="c"><b>Remittance</b><p>Wallet to wallet across borders, no correspondent bank.</p></div>
  <div v-click class="c warn"><b>The catch</b><p>Off-ramps, local rules, issuer freezes, and scams.</p></div>
</div>

<style>
.ngn { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem 1.6rem; margin-top: 1rem; }
.ngn .c { border-left: 6px solid var(--gain); padding: 0.4rem 0 0.4rem 0.9rem; }
.ngn .c.warn { border-color: var(--warn); }
.ngn b { font-size: var(--fs-lg); font-stretch: 112%; }
.ngn p { font-size: var(--fs-base); color: var(--ink-2); margin: 0.2rem 0 0; }
</style>

<!--
Bring it home. The handbook asks: why did PayPal and Paxos choose Solana, and what does this mean for payments in Nigeria?

- Payments: Solana fees are fractions of a cent and blocks come every ~400ms, so a stablecoin transfer is cheap enough for small everyday payments. That's the pitch PayPal (PYUSD) and Paxos (USDG) bought into.
- Savings: for people facing a weak local currency, a dollar stablecoin is a way to hold dollars without a domiciliary account.
- Remittance: send from a wallet abroad to a wallet at home, without correspondent banks.
- The catch: you still need an off-ramp to naira, local regulation applies (cover SEC Nigeria's current stance on digital assets in week 5), issuers can freeze coins, and "send me USDT first" scams are everywhere.

Don't quote adoption statistics without a dated source. Ask students who has used USDT or USDC already, and for what. Their answers are better than any statistic.
-->

---

<Quiz
  q="USDC trades at $0.96 and Circle is redeeming normally. What pulls it back to $1?"
  :options="['Circle prints more USDC', 'Traders buy at $0.96 and redeem for $1', 'A Solana validator vote', 'Nothing, it stays there']"
  :answer="1"
  why="Buying cheap and redeeming at $1 is free money, so traders do it until the gap closes."
/>

<!--
D is correct if redemption stops (the SVB weekend). That's the follow-up question.
-->

---

# Task: take a loan to liquidation

<Tracks>
<template #users>

**Simulate it** (recommended)

1. Get the live SOL price from Hermes
2. Spreadsheet: deposit, borrow, then drop the price in steps
3. Each row: LTV, health factor
4. Mark the liquidation price and the liquidator's profit

</template>
<template #builders>

**Mainnet fork**

1. `surfpool start`: real Kamino and Jupiter Lend accounts, locally
2. Fund a wallet with cheatcodes
3. Deposit and borrow through the SDK
4. Move time and price, watch health

</template>
</Tracks>

<Callout tone="loss" class="mt-3" title="Optional, real money">
Already hold USDC? Supply $5 to a lender and watch interest accrue. Supply only. Never borrow.
</Callout>

<!--
From the handbook. No Solana lending app had a reliably working devnet market in 2026. Save's docs mention a devnet deployment with self-minted "USDC", but those docs are about 3.5 years old. No source confirmed a working Kamino or marginfi devnet market. Don't promise a devnet lending UI until you've tested one yourself.

Everyone, simulate (recommended): spreadsheet with columns price, collateral value, debt, LTV, HF, status. Start at the live Pyth price (price × 10^expo), borrow at 60% LTV, then step the price down 5% per row until HF < 1. Then add the liquidation row: repay 50%, seize debt × 1.05 of collateral. Use the real liquidation threshold for SOL from Kamino or Jupiter Lend's UI (look it up, write down where and when).

Builders, mainnet fork: `surfpool start` runs a local validator on port 8899 that fetches real mainnet accounts as you touch them, so Kamino and Jupiter Lend behave as they do live. Use cheatcodes to fund a wallet and move time, then deposit and borrow through the SDK. Reference repo: adpthegreat/bypassing-kamino-restrictions.

Optional real money: mentees who already hold USDC can supply $5 to a lender and watch interest accrue. Supply only, no borrowing. Say clearly, out loud, that it is real money and optional. Nobody should buy crypto for this.
-->

---
layout: center
---

# Blog post

<div class="fs-2xl wide" style="font-weight:800; max-width: 24ch; line-height: 1.1">"Understanding lending and borrowing in DeFi"</div>

<div v-click class="fs-md mt-4">
Include your liquidation walkthrough, and one paragraph on which stablecoin you'd trust, and why.
</div>

<!--
The curriculum's week 4 report also asks for: a hypothetical lending calculation, a comparison of stablecoin designs, a case study of a documented incident (USDC and SVB, or UST, work well), and the difference between credit risk, market risk, liquidity risk, collateral risk and smart-contract risk. The blog post can be the short version.
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

1. **Learn the four numbers.** LTV, liquidation threshold, health factor, utilization. Then the kinked rate curve.
2. **Walk one liquidation by hand.** 10 SOL at $150, borrow 900 (60%). SOL to $110: LTV ≈ 82%.
3. **Look up SOL's real liquidation threshold** on Kamino or Jupiter Lend. Who gets liquidated, and how does the liquidator profit?
4. **Read Pyth's Solana pull-integration guide.** Week 5 depends on it.
5. **Know the stablecoin types,** and which have real depth on Solana.

</div>

<style>
.prep ol li { font-size: var(--fs-base); margin: 0.5rem 0; }
</style>

<!--
From the handbook's "You, before class" lane for week 4.

The liquidation by hand: deposit 10 SOL at $150 ($1,500), borrow 900 USDC (60% LTV). SOL drops to $110, so LTV is 900 / 1,100 ≈ 82%. Compare that to the market's real liquidation threshold for SOL. The slides use an example 80% threshold, 50% close factor and 5% bonus; replace them with the real market's parameters if you have them.

Stablecoin types: fiat-backed (USDC, USDT, PYUSD, USDG from Paxos Singapore), crypto-backed (DAI, now Sky), synthetic and yield-bearing. Know which ones actually have depth on Solana (USDC dominates).

Pyth: read the Solana pull-integration guide, and the Pyth + Anchor devnet tutorial if you have builders.
-->

---

# Verify before class

<div class="checks">

<Callout tone="warn" title="Any devnet lending market">
Save's devnet docs are about 3.5 years old. No working Kamino or marginfi devnet market was confirmed. Test one or don't promise it.
</Callout>

<Callout tone="warn" title="marginfi's name and URL">
Ownership changed in 2026. Check the current app before naming it.
</Callout>

<Callout tone="warn" title="Numbers with dates">
Stablecoin supply ($17.3B, 25 Sep 2026) and TVL move weekly. Re-check on DefiLlama the day you teach.
</Callout>

<Callout tone="ink" title="Builders' fork">
<code>surfpool start</code> · port 8899 · cheatcodes for balances and time
</Callout>

</div>

<style>
.checks { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.8rem; margin-top: 0.6rem; }
</style>

<!--
All from the handbook's verify list, checked 11 October 2026. Trackers disagree, sometimes by 2x. Use DefiLlama directly on the day and say the date out loud.
-->
