---
theme: default
title: DeFi on Solana · Week 1
info: Week 1. Intro to DeFi and the Solana map.
colorSchema: light
routerMode: hash
fonts:
  provider: none
transition: slide-left
mdc: true
layout: week
week: 1
heading: Intro to DeFi
task: Trace a real SOL → USDC route on Jupiter, then read a swap on Orb.
blog: "My introduction to Decentralized Finance on Solana."
---

<!--
Week 1 goal: by the end, every mentee can say in one sentence what DeFi is, name one Solana protocol in each category, and explain why Solana suits trading.

Timing: 30 minutes of teaching (slides up to "This week's task"), then the task live in class. Keep the history short. Most of the time goes to the Solana map.
-->

---

# Today

<div class="today">
  <div v-click><b>1</b><span>What DeFi is</span></div>
  <div v-click><b>2</b><span>How we got here</span></div>
  <div v-click><b>3</b><span>The Solana map</span></div>
  <div v-click><b>4</b><span>Why Solana</span></div>
  <div v-click class="task"><b>→</b><span>Trace a real swap</span></div>
</div>

<style>
.today { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.8rem; margin-top: 3rem; }
.today > div { border-top: 6px solid var(--ink); padding-top: 0.6rem; }
.today b { display: block; font-size: var(--fs-3xl); font-weight: 900; font-stretch: 62%; color: var(--chain); line-height: 1; }
.today span { font-size: var(--fs-md); font-weight: 700; font-stretch: 110%; }
.today .task { border-color: var(--gain); }
.today .task b { color: var(--gain); }
</style>

<!--
Four short parts, then the task. Tell them the task now so they listen with a purpose: by the end of class they will open Jupiter, ask for a quote, and read where their swap would go.
-->

---
layout: section
tone: ink
---

# What DeFi is

Start with the system you already know.

---

# What does a bank actually do for you?

<div class="jobs">
  <div class="h"><span></span><span class="ink">In a bank</span><span class="chain">On chain</span></div>
  <div v-click class="r"><b>Holds your money</b><span>Your account balance</span><span v-click>Your wallet. Only your key moves it.</span></div>
  <div v-click class="r"><b>Matches savers and borrowers</b><span>Loan officers, credit checks</span><span v-click>A lending program and a shared pool</span></div>
  <div v-click class="r"><b>Moves and settles payments</b><span>Clearing, days</span><span v-click>The chain itself, under a second</span></div>
  <div v-click class="r"><b>Checks who you are</b><span>KYC at the counter</span><span v-click class="warn">Usually nobody</span></div>
  <div v-click class="r"><b>Takes the hit when things go wrong</b><span>Deposit insurance, chargebacks</span><span v-click class="loss">Usually you</span></div>
</div>

<style>
.jobs { margin-top: 1rem; }
.jobs .h, .jobs .r { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr) minmax(0, 1.3fr); gap: 1rem; padding: 0.5rem 0; }
.jobs .h { font-weight: 800; font-size: var(--fs-sm); border-bottom: 2px solid var(--ink); }
.jobs .r { border-bottom: 1px solid var(--rule); align-items: baseline; }
.jobs .r b { font-size: var(--fs-base); }
.jobs .r span { font-size: var(--fs-sm); color: var(--ink-2); }
.jobs .r span:last-child { color: var(--chain); font-weight: 650; }
.jobs .r span.warn { color: var(--warn); } .jobs .r span.loss { color: var(--loss); }
</style>

<!--
They studied this. Use it. Financial intermediaries exist to solve five problems: safekeeping, matching people with surplus money to people who need it, moving and settling payments, checking identity and credit, and absorbing losses.

Reveal the left column first and let them name the bank's version. Then reveal the on-chain version one row at a time.

The last two rows are the honest ones. On chain there is usually no identity check and no one to absorb losses. That is both the feature (anyone can use it, no permission needed) and the risk (nobody gives you your money back). Week 5 is built on that last row.
-->

---
clicks: 3
---

# Buying a share vs swapping a token

<MiddlemenFlow :step="$clicks" class="mt-10" />

<!--
Click 1: buying a share in the traditional system. Your order goes through a broker, to an exchange that finds a seller, to a clearing house that guarantees both sides, to a custodian that holds the share. Each one takes a fee and some time.

Click 2: a token swap on Solana. You sign one transaction. A swap program checks it, swaps the tokens and records the result.

Click 3: settlement. US stocks moved from T+2 to T+1 on 28 May 2024, so a trade settles one business day later. A Solana transaction lands in a slot of roughly 400 milliseconds, and the swap either fully happens or fully fails. Nothing half-settles.

The finance word for "fully happens or fully fails" is atomic settlement. Ask them why a clearing house exists at all (to manage the risk that one side fails to deliver during the settlement gap). On chain that gap is close to zero, so that job mostly disappears.
-->

---

# DeFi in one line

<p class="fs-xl wide" style="font-weight:800; max-width: 22ch; margin-top: 1.5rem">Financial services written as <span class="chain">open programs anyone can call</span>.</p>

<div class="props mt-10">
  <div v-click><b class="chain">Non-custodial</b><span>You keep your keys. The program never needs your permission to exist, and you never need its.</span></div>
  <div v-click><b class="chain">Permissionless</b><span>No account to open. A wallet is enough.</span></div>
  <div v-click><b class="chain">Composable</b><span>Programs call each other like building blocks.</span></div>
</div>

<style>
.props { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.2rem; }
.props b { display: block; font-size: var(--fs-lg); font-stretch: 115%; margin-bottom: 0.3rem; }
.props span { font-size: var(--fs-sm); color: var(--ink-2); }
</style>

<!--
Three words they will hear constantly.

Non-custodial: the user signs every movement of their own funds. Compare a centralised exchange like Binance, where you hand over custody and they keep an internal ledger of what they owe you.

Permissionless: there is no sign-up. If you have a wallet, you can call the program.

Composable: one program can call another inside the same transaction. A lending program's deposit receipt can be used as collateral somewhere else. People call this "money legos". It is powerful, and it means one failure can spread (week 5).
-->

---

# Is it actually decentralised?

<p class="muted fs-sm" style="margin-top:-0.6rem">Tick what's true for a protocol. "DeFi" on the label proves nothing.</p>

<DecentralizationDial />

<!--
This is the analyst habit for the whole course: don't trust the label.

Walk through each switch:
- Non-custodial: do users sign their own transactions, or does the app hold the keys?
- Open source and verified: can anyone check the deployed program matches the published code?
- Upgrade authority: on Solana, most programs can be upgraded by whoever holds the upgrade authority key. If a team multisig holds it, the team can change the rules tomorrow. Explorers show this on the program's page.
- Admin powers: can someone pause the protocol or freeze tokens?
- Oracle: one price source is a single point of failure.
- Front end: if the company's website goes down, can you still use the protocol?

Most real protocols land in the middle. That is fine, as long as you know who holds which key. Drift's 2026 hack (week 5) came through exactly this: admin powers held by a multisig whose signers were tricked.
-->

---

# CeFi vs DeFi

<table class="cmp">
  <thead><tr><th></th><th class="ink">CeFi (bank, Binance)</th><th class="chain">DeFi (Kamino, Orca)</th></tr></thead>
  <tbody>
    <tr v-click><td>Who holds the money</td><td>The company</td><td>You, or a program</td></tr>
    <tr v-click><td>To get started</td><td>ID check, approval</td><td>A wallet</td></tr>
    <tr v-click><td>Opening hours</td><td>Business days</td><td>Always on</td></tr>
    <tr v-click><td>Can you see the books?</td><td>Audits, sometimes</td><td>Every transaction is public</td></tr>
    <tr v-click><td>If you make a mistake</td><td>Call support, maybe reverse</td><td class="loss">Final</td></tr>
    <tr v-click><td>If it gets hacked</td><td>Company and regulator step in</td><td class="loss">Depends on the team, often nobody</td></tr>
    <tr v-click><td>Rules enforced by</td><td>Law and contracts</td><td>Code, plus law around it</td></tr>
  </tbody>
</table>

<style>
.cmp td:first-child { font-weight: 700; color: var(--ink); }
.cmp td { font-size: var(--fs-sm); }
.cmp th.ink { color: var(--ink); } .cmp th.chain { color: var(--chain); }
</style>

<!--
Avoid "DeFi good, CeFi bad". Each row cuts both ways.

Always-on means you can trade at 3am on a Sunday. It also means a crash at 3am on a Sunday liquidates you while you sleep.

Public books mean you can audit reserves yourself. They also mean your entire transaction history is visible to anyone who knows your address.

"Final" is great for the merchant and terrible for the person who sent money to the wrong address.

Ask: which column is FTX in? CeFi. It was a company holding customer money. That matters in two slides.
-->

---

<Quiz
  q="You deposit 100 USDC into a DeFi lending program. Where is it now?"
  :options="['In the protocol company\'s bank account', 'In an account controlled by the program\'s code', 'Still in your wallet, just locked', 'With whoever borrowed it, directly']"
  :answer="1"
  why="It sits in a vault account that the lending program controls. No person can move it, only the program's rules. You get a receipt token that proves your share."
/>

<!--
Common wrong answer: C. The money really leaves your wallet. What you hold afterwards is a receipt (Kamino calls these kTokens, others use different names) that you redeem later for your deposit plus interest.

Common wrong answer: D. Borrowers draw from the shared pool, not from you personally. You never know who borrowed "your" dollars. Week 4 goes deep on this.
-->

---
layout: section
tone: ink
---

# How we got here

Seven stops, fifteen years.

---
clicks: 7
---

# From Bitcoin to Solana DeFi

<FinanceTimeline :step="$clicks" class="mt-6" />

<!--
Click through one stop at a time. One sentence each.

2008: The Bitcoin paper (31 October 2008) described money that moves between people without a bank in the middle. It solved double spending without a central ledger keeper.
2015: Ethereum launched (30 July 2015). The ledger can now run programs, not just record payments. Every DeFi app since depends on this idea.
2017: MakerDAO's DAI. A dollar-pegged token backed by crypto locked in a program. The first big DeFi building block.
2018: Uniswap (November 2018) made swaps without an order book. Compound made lending pools. Both are the templates for what Solana runs today.
2020: "DeFi Summer". Compound started paying its COMP token to users in June 2020, and money poured in chasing rewards. The same year, Solana's mainnet beta launched (March 2020).
2022: Terra's UST stablecoin collapsed in May and took roughly $40B of value with it. FTX collapsed in November. FTX and its trading arm Alameda were big backers of Solana projects, so SOL fell hard.
2023 onward: Solana DeFi rebuilt around Jupiter, Jito, Kamino and others. Stablecoin supply on Solana reached a reported record of $17.3B on 25 September 2026, mostly USDC (Solana Compass). Say the date when you quote it.
-->

---

# 2022: two collapses, two different lessons

<div class="grid grid-cols-2 gap-10 mt-8">
<div v-click>
  <p class="fs-sm muted">May 2022</p>
  <h2 class="loss">Terra / UST</h2>
  <p>A stablecoin held up by an <span v-mark.red="3">algorithm, not reserves</span>. Confidence broke, the peg broke.</p>
  <p class="fs-sm chain"><strong>DeFi design failure</strong></p>
</div>
<div v-click>
  <p class="fs-sm muted">November 2022</p>
  <h2 class="loss">FTX</h2>
  <p>An exchange <span v-mark.red="4">used customer deposits</span> for its own bets. It couldn't pay withdrawals.</p>
  <p class="fs-sm ink"><strong>CeFi trust failure</strong></p>
</div>
</div>

<!--
This slide fixes a common confusion. People say "crypto collapsed in 2022" as one event. They were two very different failures.

Terra was a DeFi failure. UST was supposed to hold $1 through an arbitrage mechanism with its sister token LUNA, with no real reserves behind it. When people rushed to exit, the mechanism printed more and more LUNA, which crashed, which made people exit faster. That is a design flaw in the economics. Week 4 covers stablecoin types.

FTX was a CeFi failure. A centralised company held customer money and misused it. Sam Bankman-Fried was convicted of fraud in November 2023. A DeFi protocol cannot secretly lend out your deposits, because every movement is on a public ledger. But a company can.

Lesson: "decentralised" and "trustworthy" are not the same word, and "centralised" isn't automatically safer.
-->

---
layout: section
tone: chain
---

# The Solana map

Who does what, today.

---
clicks: 7
---

# Solana DeFi, by job

<SolanaDefiMap :step="$clicks" class="mt-2" />

<!--
Build it up one click at a time.

1. The middle: Solana is one shared ledger. Its money layer is mostly fiat-backed stablecoins: USDC (Circle), USDT (Tether), PYUSD (PayPal, issued by Paxos), USDG (Paxos Singapore). Solana doesn't have a big native crypto-backed stablecoin like DAI on Ethereum.
2. Swaps: Raydium, Orca and Meteora run pools. HumidiFi is a "prop AMM": a professional market maker quoting its own prices on chain. HumidiFi led Solana spot DEX volume in late 2025 (roughly 30 to 47%), then BisonFi, another prop AMM, passed it in January 2026.
3. Jupiter sits on top. Most people never touch a DEX directly. They swap on Jupiter, which checks every pool and routes the trade. Jupiter also runs lending (Jupiter Lend, launched August 2025), perps and the JLP pool.
4. Lending: Kamino Lend, Jupiter Lend, Save (formerly Solend), Project 0 (formerly marginfi). Same idea as Aave or Compound: deposit, borrow against collateral, get liquidated if it falls too far.
5. Perps: Drift and Jupiter Perps. Perpetual futures, leverage without an expiry date.
6. Liquid staking: Jito (JitoSOL), Sanctum, Marinade, JupSOL. Stake SOL and get a token that earns staking rewards and can still be used elsewhere.
7. Oracles: Pyth and Switchboard feed prices to lenders and perps. If the price is wrong, the lender liquidates the wrong people. Week 4 and week 5.

Prep tip: open the DefiLlama Solana chain page before class and read off the top 10 by TVL, with today's date.
-->

---

# Sort them

<p class="muted fs-sm" style="margin-top:-0.6rem">Click a protocol, then the job it does. Call out answers as a class.</p>

<ProtocolSorter />

<!--
Run this as a room game. Let mentees shout the bucket before you click.

The ones that trip people up:
- Jupiter: aggregator, even though it also does lending and perps now. Its core job is routing swaps.
- Jito: liquid staking (JitoSOL). Jito also builds MEV infrastructure, which comes up in week 3 when we talk about where JitoSOL's extra yield comes from.
- HumidiFi: a DEX, but a prop AMM, not a pool anyone can deposit into.
- Pyth: oracle. Not a DEX, even though it publishes prices.
-->

---
layout: section
tone: chain
---

# Why Solana

What makes it suited to trading.

---

# Three numbers

<div class="nums">
  <div v-click><b class="chain">~0.4s</b><span>per slot. A new block of transactions roughly every 400 milliseconds.</span></div>
  <div v-click><b class="chain">0.000005</b><span>SOL base fee per signature. A fraction of a cent.</span></div>
  <div v-click><b class="chain">1</b><span>shared state. Every app sees the same ledger, no bridging between layers.</span></div>
</div>

<style>
.nums { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2rem; margin-top: 3rem; }
.nums b { display: block; font-size: var(--fs-3xl); font-weight: 900; font-stretch: 75%; line-height: 1; margin-bottom: 0.6rem; }
.nums span { font-size: var(--fs-base); color: var(--ink-2); }
</style>

<!--
Base fee: 5,000 lamports per signature. A lamport is one billionth of a SOL, so that is 0.000005 SOL. Even at a few hundred dollars per SOL it is a fraction of a cent. Apps can add a priority fee to get ahead when the network is busy; week 2 breaks fees down properly.

Slot: about 400ms. This is when a leader validator produces a block. Confirmation and finality take a bit longer; week 2 covers the lifecycle.

One shared state: on Ethereum, much activity now happens on separate layer-2 networks, and moving funds between them needs a bridge. On Solana, every DeFi app reads and writes the same global ledger. That is why Jupiter can route across every pool in one transaction.
-->

---

# Running transactions side by side

<ParallelLanes />

<!--
Press Run. The top lane is how a chain that runs one transaction at a time works. The bottom is Solana's runtime, called Sealevel.

The trick: every Solana transaction lists the accounts it will read and write before it runs. So the runtime can see that "Ada pays Bola" and "Dayo mints a token" touch different accounts and run them at the same time.

The orange ones all swap in the same SOL/USDC pool, so they all write to the same pool account. They can't run in parallel; they queue. That pool is called a "hot account". This is also why Solana has local fee markets: you pay a higher priority fee to get ahead in the queue for that one busy account, without raising fees for everyone else.

Builders: this is why Solana programs must declare accounts up front, and why the classic Solana bug is trusting an account you were handed without checking it (week 5).
-->

---

# Why that matters for DeFi

<div class="grid grid-cols-2 gap-10 mt-8">
<div v-click>
  <h3>Cheap, fast updates</h3>
  <p>Market makers can re-quote prices many times a second. That's how <span class="chain">on-chain order books</span> and <span class="chain">prop AMMs</span> work.</p>
</div>
<div v-click>
  <h3>One place for liquidity</h3>
  <p>Every pool lives on the same ledger, so <span class="chain">Jupiter</span> can split one swap across all of them in one transaction.</p>
</div>
</div>

<Callout v-click tone="loss" title="The honest costs" class="mt-8">
Solana has had full outages (about 17 hours in September 2021, about 5 hours in February 2024). Running a validator needs expensive hardware.
</Callout>

<!--
The one-liner to remember: one global state, parallel execution, ~400ms slots and tiny fees make on-chain order books and fast-quoting market makers practical.

On Ethereum mainnet, updating a quote costs real gas each time, so passive pools (where the price only moves when someone trades) made more sense. On Solana, a market maker can update its own price constantly. That is what a prop AMM like HumidiFi does.

Be fair about the trade-offs. Solana halted for about 17 hours in September 2021 and for about 5 hours on 6 February 2024. Validators need high-end machines, which concentrates who can run one. Ask: is a faster chain that occasionally stops better or worse for a lending protocol than a slower one that never stops? There is no single right answer.
-->

---

<Quiz
  q="Why can Solana run two unrelated transactions at the same time?"
  :options="['Validators are faster computers', 'Each transaction lists the accounts it will touch up front', 'Solana skips checking signatures', 'Transactions are sent to different chains']"
  :answer="1"
  why="The runtime can see which transactions touch different accounts, so it runs those in parallel. Two swaps in the same pool still wait for each other."
/>

---
layout: section
tone: gain
---

# This week's task

Trace a real swap.

---

# What Jupiter does with your swap

<JupiterRoute />

<!--
Drag the slider. A small trade goes through one venue. A big one gets split, because pushing a big trade through one pool moves the price against you (that is called price impact, week 3). Sometimes the cheapest path even goes through a third token, here USDT, in two hops.

The numbers on this slide are illustrative. The real route changes every few seconds. That is exactly what the task asks them to observe.
-->

---

# The task

<Tracks>
<template #users>

1. Open **jup.ag**. No funds needed.
2. Ask for a quote: **SOL → USDC**.
3. Open the route. Which DEXs does it touch?
4. On **Orb**, find any real swap. Press **Explain with AI**.
5. Compare the explanation with the raw instructions.

</template>
<template #builders>

Everything on the left, plus:

1. Get a free API key at **portal.jup.ag**.
2. Call `GET https://api.jup.ag/swap/v2/order` with **no taker**. That returns a quote only, nothing to sign.
3. Print the route.

</template>
</Tracks>

<Callout tone="warn" class="mt-5">Old tutorials using <code>quote-api.jup.ag/v6</code> will break: it is being shut down. Use <code>api.jup.ag</code> with a free key.</Callout>

<!--
Users: they do not need any money. Jupiter shows a quote before you connect anything. The route view shows which venues the trade would go through and in what proportions.

Orb is Helius's explorer (orb.helius.dev). Any transaction page has an "Explain with AI" button. The point of comparing it to the raw instructions is to catch the AI being vague or wrong. Make them write down one thing the AI said that they could confirm in the raw data.

Builders: no taker means no wallet address, so the API returns a quote without building a transaction to sign. Safe to run.
-->

---

# Builders: the quote in ten lines

````md magic-move {lines: true}
```ts
// 1. Ask for a quote: 1 SOL to USDC
const SOL = 'So11111111111111111111111111111111111111112'
const USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
const url = `https://api.jup.ag/swap/v2/order?inputMint=${SOL}&outputMint=${USDC}&amount=1000000000`

const res = await fetch(url, { headers: { 'x-api-key': process.env.JUP_API_KEY! } })
console.log(JSON.stringify(await res.json(), null, 2))
```
```ts
// 2. Print the whole response first, then pick out the route
const SOL = 'So11111111111111111111111111111111111111112'
const USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
const url = `https://api.jup.ag/swap/v2/order?inputMint=${SOL}&outputMint=${USDC}&amount=1000000000`

const res = await fetch(url, { headers: { 'x-api-key': process.env.JUP_API_KEY! } })
const order = await res.json()
for (const leg of order.routePlan ?? []) {
  console.log(leg.swapInfo?.label, `${leg.percent}%`)
}
```
````

<Callout tone="warn" class="mt-3">Check field names against the live response. API shapes change; print the full JSON first.</Callout>

<!--
amount is in the smallest unit of the input token. SOL has 9 decimals, so 1 SOL = 1,000,000,000 lamports. USDC has 6 decimals; 1 USDC = 1,000,000.

The two mint addresses are mainnet SOL (wrapped SOL) and mainnet USDC. They are safe to put in a quote request: nothing is signed or sent.

Checked 14 Oct 2026 against Jupiter's API reference: without a taker the response is a quote and `transaction` is null. `routePlan` is an array of legs, each with `swapInfo`, `percent` and `bps`; a separate `router` field names the engine that won (metis, jupiterz, dflow or okx). The header is x-api-key. Still print the full JSON first: APIs change.
-->

---
layout: center
---

# Blog post

<p class="fs-xl wide" style="font-weight:800; max-width: 24ch">"My introduction to Decentralized Finance on Solana."</p>

<div class="mt-6 fs-md">

Include **one route you traced** and **one question you still have**.

</div>

<!--
Short is fine. 500 words is plenty. The two required parts force them to show real work (the route) and honest uncertainty (the open question). Collect the open questions; they make good warm-ups for week 2.
-->

---
layout: section
tone: ink
---

# Teacher prep

For the mentor. Skip in class.

---

# You, before class

<v-clicks>

- Open the **DefiLlama Solana page**. Click into the top 10 protocols and sort them: DEX, aggregator, lending, perps, liquid staking, oracle. Write the date next to every TVL figure.
- Learn the one-liner: **one global state, parallel execution, ~400ms slots and tiny fees** make on-chain order books and fast-quoting market makers practical.
- Read the **Solana core docs on the account model**. Week 2 depends on it.
- Do the task yourself on a fresh browser. Screenshot every snag.

</v-clicks>

<!--
The weekly loop for the mentor:
Monday and Tuesday: read, then write a one-page cheat sheet in your own words. If it doesn't fit on one page, you are not ready to teach it.
48 hours before class: do the mentees' task yourself, end to end. The snags you hit are your class notes.
Write your own blog post first. It becomes the model answer.
In class: 30 minutes of teaching, then the task live.
After class: keep a "things I got wrong" log and fix them openly next session.
-->

---

# Words from week 1

<div class="gloss">
  <div><b>DeFi</b><span>Financial services run by open programs on a public chain.</span></div>
  <div><b>CeFi</b><span>Crypto services run by a company that holds your funds.</span></div>
  <div><b>Non-custodial</b><span>You hold the keys; nobody else can move your funds.</span></div>
  <div><b>Permissionless</b><span>Anyone with a wallet can use it. No sign-up.</span></div>
  <div><b>Composable</b><span>Programs can call each other inside one transaction.</span></div>
  <div><b>DEX</b><span>An exchange that runs as a program.</span></div>
  <div><b>Aggregator</b><span>Splits your swap across many DEXs for the best price.</span></div>
  <div><b>Liquid staking</b><span>Staked SOL as a token you can still use.</span></div>
  <div><b>Oracle</b><span>Brings outside prices onto the chain.</span></div>
  <div><b>TVL</b><span>Total value locked: assets deposited in a protocol.</span></div>
  <div><b>Slot</b><span>Solana's ~400ms window for a leader to produce a block.</span></div>
  <div><b>Upgrade authority</b><span>The key that can change a program's code.</span></div>
</div>

<style>
.gloss { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.3rem 2rem; margin-top: 0.5rem; }
.gloss div { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 0.6rem; border-bottom: 1px solid var(--rule); padding: 0.28rem 0; }
.gloss b { font-size: var(--fs-sm); color: var(--chain); }
.gloss span { font-size: var(--fs-sm); color: var(--ink-2); }
</style>

<!--
Mentees should build their own glossary of at least 25 terms across the course, in their own words. Share this list as a starting point, not the answer.
-->
