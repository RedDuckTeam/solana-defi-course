---
theme: default
title: DeFi on Solana · Course map
info: |
  A six-week DeFi course on Solana for finance people and developers.
  Open source. Devnet only.
colorSchema: light
routerMode: hash
fonts:
  provider: none
transition: slide-left
mdc: true
layout: cover
class: ledger-paper
drawings:
  persist: false
---

<div class="cover">
  <p class="fs-md muted">Six weeks · finance people and developers · devnet only</p>
  <h1 class="title">DeFi<br>on Solana</h1>
  <p class="fs-md ink-2">From the bank ledger to the on-chain ledger.</p>
</div>

<style>
.cover { padding-left: 90px; }
.title { font-size: var(--fs-display) !important; font-stretch: 125% !important; font-weight: 900 !important; line-height: 0.92 !important; margin: 0.2em 0 0.3em !important; }
.title { background: linear-gradient(90deg, var(--ink) 0 55%, var(--chain) 70%); -webkit-background-clip: text; background-clip: text; color: transparent !important; }
</style>

<!--
Welcome. Say what this course is in one breath: six weeks, one topic per week, and every week you leave with something you did yourself and something you wrote.

The colour code runs through every deck. Navy ink is traditional finance: banks, brokers, the paper ledger. Violet is on-chain. Red is risk and loss. Green is gain. Point at it once now, then let them notice it.

Facts in this course were checked on 11 October 2026. Anything that moves weekly (TVL, supply, prices) is quoted with a date or not at all.
-->

---
clicks: 4
---

# One ledger, two ways to keep it

<LedgerCompare :step="$clicks" class="mt-2" />

<p v-click="4" class="fs-lg" style="margin-top:0.4rem"><strong>DeFi</strong> = financial services written as <span class="chain">programs anyone can call</span>.</p>

<!--
This is the whole course in one slide. In a bank, a company keeps the ledger and decides what goes into it. On a public chain, the ledger is copied across thousands of machines, and the rules for changing it are programs that anyone can call.

Ask the room: as accountants, what do you lose and what do you gain? Lose: someone to call when it goes wrong, reversals, consumer protection. Gain: you can audit the ledger yourself, settlement in under a second, access without a bank account.

Don't let anyone leave thinking "DeFi is always better". Week 5 is about everything that goes wrong.
-->

---
clicks: 6
---

# Six weeks, six entries

<CourseLedger :step="$clicks" class="mt-4" />

<!--
Each week builds on the one before. Week 2's token accounts are what week 3's pools hold. Week 3's prices are what week 4's lenders use as collateral values. Week 5 breaks all of it on purpose.

The right-hand column is what they ship. Every week also ends with one blog post. Six posts is a portfolio, and Superteam pays for writing like that (week 6).
-->

---

# Every week runs the same loop

<div class="loop mt-4">
  <div v-click class="step"><b>Teach</b><span>30 minutes, no more</span></div>
  <div v-click class="arrow">→</div>
  <div v-click class="step"><b>Do</b><span>the task, live, in class</span></div>
  <div v-click class="arrow">→</div>
  <div v-click class="step"><b>Write</b><span>one blog post</span></div>
  <div v-click class="arrow">→</div>
  <div v-click class="step"><b>Log</b><span>what broke, fixed next week</span></div>
</div>

<div v-click class="mt-10">
<Tracks>
<template #users>

Wallets, explorers, dashboards, spreadsheets. **No code needed.**

</template>
<template #builders>

Everything users do, **plus a code extension** each week.

</template>
</Tracks>
</div>

<style>
.loop { display: flex; align-items: center; gap: 0.8rem; }
.loop .step { flex: 1; border: 1.5px solid var(--ink); border-radius: var(--r-md); padding: 0.7rem 0.9rem; background: #fff; }
.loop .step b { display: block; font-size: var(--fs-lg); font-stretch: 118%; }
.loop .step span { font-size: var(--fs-sm); color: var(--ink-2); }
.loop .arrow { font-size: var(--fs-xl); color: var(--chain); font-weight: 800; }
</style>

<!--
Teaching is capped at 30 minutes. After that people stop listening and start nodding. The task is where they actually learn, and you unblock them while they do it.

The log: keep a running list of "things I got wrong" and fix them openly at the start of the next class. It builds trust.

Two tracks. Users do everything through wallets and spreadsheets. Builders do the same plus a code extension. Both write the same blog post, so nobody is left out of the conversation.
-->

---

# If you learned crypto on Ethereum

<p class="muted fs-sm" style="margin-top:-0.6rem">Click a card to translate it. Keep this open all six weeks.</p>

<EvmMap />

<!--
Most people who have touched crypto learned it on Ethereum. Every tutorial they find will assume Ethereum tools. This is the translation table.

The three that matter most:
1. ERC-20 vs mint + token accounts. On Ethereum each token is its own contract holding a balance table. On Solana there is one shared token program; each token is a "mint" account, and your balance lives in a separate token account you own. Week 2 is built on this.
2. Gas vs base fee + priority fee + rent. The base fee is 5,000 lamports per signature (0.000005 SOL). Rent is a refundable deposit for keeping data on chain.
3. Reentrancy vs missing account checks. On Solana, a program receives every account it touches as an input. The classic bug is trusting an account you never checked. Week 5's biggest hacks (Wormhole, Cashio) are exactly this.

Also: Polygon shut Mumbai down in 2024, so any old tutorial pointing there is already broken. Use devnet.
-->

---
layout: center
---

# Three rules for the whole course

<div class="rules">
  <div v-click><b class="loss">1</b><p><strong>Never share a seed phrase or private key.</strong> Not with support, not with me, not in a screenshot.</p></div>
  <div v-click><b class="chain">2</b><p><strong>Devnet and test tokens only.</strong> The one exception is an optional $5 in week 4, and we will say so loudly.</p></div>
  <div v-click><b class="gain">3</b><p><strong>Numbers carry dates.</strong> TVL, prices and supply change weekly. Say when you looked.</p></div>
</div>

<style>
.rules { display: grid; gap: 1rem; max-width: 720px; }
.rules > div { display: grid; grid-template-columns: 70px minmax(0, 1fr); align-items: center; }
.rules b { font-size: var(--fs-3xl); font-weight: 900; font-stretch: 62%; }
.rules p { margin: 0; font-size: var(--fs-md); }
</style>

<!--
Rule 1 is the one that loses people real money. Every "support agent" who asks for a seed phrase is a thief. Phantom and Solflare will never ask.

Rule 3 is the analyst habit. DefiLlama, Artemis and Dune often disagree, sometimes by 2x. Quote the source and the date out loud.
-->

---

# The toolkit

| Need | Use |
|---|---|
| Wallet | Phantom, Solflare or Backpack, set to **Devnet** |
| Devnet SOL | `faucet.solana.com` or `solana airdrop 2 --url devnet` |
| Devnet USDC | `faucet.circle.com` · mint `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU` |
| Explorer | Orb (`orb.helius.dev`), Solscan, `explorer.solana.com` + `?cluster=devnet` |
| Prices | Pyth Hermes (`hermes.pyth.network`) |
| Data | DefiLlama, Artemis, Dune |
| Builders | Anchor 1.x, LiteSVM, Surfpool, `@solana/kit` |

<Callout tone="warn" title="Faucets break in class" class="mt-4">
The SOL faucet limits by IP, so one shared Wi-Fi gets throttled. Pre-fund a teacher wallet and send SOL around.
</Callout>

<!--
Check every one of these the week before you need it.

Circle's devnet faucet limit is reportedly 20 USDC per 2 hours per address (third-party source, not confirmed by Circle). The SOL faucet rate-limits by IP, which hurts when a whole class shares one connection. Fallback: fund one teacher wallet beforehand and send each student 1 devnet SOL.

Builders: Anchor 1.2.1 was the latest on 6 October 2026. Solana is moving to sBPFv3 in Q4 2026; once SIMD-0500 activates, programs built on old toolchains cannot be deployed. Tutorials pinned to Anchor 0.29 will break. Supported minimums: Anchor 0.30.2, 0.31.2, 0.32.2 or 1.2.0+.
-->

---
layout: section
tone: chain
---

# Let's start.

Week 1: what DeFi is, and why so much of it runs on Solana.

<a class="btn mt-6 inline-block" href="../week-1/">Open week 1</a>
