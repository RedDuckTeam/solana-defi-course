---
theme: default
title: DeFi on Solana · Week 6
info: Week 6. Capstone, demo day and careers.
colorSchema: light
routerMode: hash
fonts:
  provider: none
transition: slide-left
mdc: true
layout: week
week: 6
heading: Capstone, demo & careers
task: Ship a capstone in your tier and present it on demo day.
blog: "My 6-week journey in Solana DeFi and my next steps into Web3."
---

<!--
Week 6 goal: everyone leaves with a finished piece of work they can show a stranger, and a concrete next step.

Timing: this week is less teaching and more coaching. 20 minutes on the capstone and careers, then work time, then demo day (in the same session or the next one, depending on your schedule).

Pick the demo day presenter by the clearest explanation, not the fanciest build.
-->

---

# Today

<div class="today">
  <div v-click><b>1</b><span>Pick a capstone tier</span></div>
  <div v-click><b>2</b><span>Ask a question evidence can answer</span></div>
  <div v-click><b>3</b><span>Where this leads</span></div>
  <div v-click><b>4</b><span>Demo day</span></div>
  <div v-click class="task"><b>→</b><span>Ship and present</span></div>
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
The capstone pulls together weeks 1 to 5. Every tier asks for the same thing: a clear question, real evidence, an honest list of risks, and a five-minute explanation a non-specialist can follow.
-->

---
layout: section
tone: chain
---

# The capstone

Same rigour. Pick your tools.

---
clicks: 3
---

# Three tiers

<CapstoneTiers :step="$clicks" />

<!--
All three are equally valid. The tier is about tools, not about how serious the work is.

No code: a Solana stablecoin report or dashboard. Supply by coin, growth, who uses them. DefiLlama, Artemis or Dune. The bar: a date and a source on every number. For context, Solana stablecoin supply hit a reported record of $17.3B on 25 Sep 2026, mostly USDC (handbook figure). They should pull their own number on the day they write.

Light code: a TypeScript tool with @solana/kit. Live SOL price from Pyth (the on-chain price account, as in builders/ts w4-pyth-price.ts), a Jupiter quote, and a "best route" readout. Or a wallet health checker for a lending position (week 4's spreadsheet, as a script).

On-chain: an Anchor (or Quasar) program. Constant-product AMM (week 3), escrow, or a mini lending market that reads a Pyth price (week 4). Tested with LiteSVM or Surfpool and deployed to devnet.

The curriculum's four capstone options (investment and risk analysis, ecosystem research comparing three protocols, a financial model in a spreadsheet, a beginner developer investigation) all fit inside these tiers. A finance graduate who builds an excellent lending model in a spreadsheet has a stronger portfolio piece than a copied AMM.

More on-chain ideas that fit six weeks: a time-locked escrow (maker deposits, taker completes, refund after a deadline), a bounty or contest pool priced in USD through an oracle and paid in SOL, or sponsored transactions so participants need no SOL. Each one reuses a week of this course: escrow is accounts and PDAs (week 2), USD pricing is oracles (week 4), and the security review is week 5.
-->

---
clicks: 3
---

# Narrow it until data can answer it

<QuestionFunnel :step="$clicks" />

<!--
Most weak capstones fail here, before any research starts.

Walk the funnel:
1. "Is DeFi good?" is an opinion. No dataset settles it.
2. "Is Solana lending safe?" Which lender? Which asset? Safe from what: hacks, liquidations, depegs?
3. "How does a Solana lender protect lenders when SOL falls fast?" One mechanism. Better. Still needs a specific lender and a test.
4. The answerable version names a protocol, an asset, a measurement and a date. It can be answered with the protocol's docs, on-chain data and a spreadsheet.

Other good questions from the curriculum: How does a decentralized exchange generate revenue? How sustainable are the returns of a particular pool? What risks arise when several protocols depend on the same stablecoin?

The example uses Kamino because it is a major Solana lender. Students should pick their own protocol.
-->

---

# Four lenses on any protocol

<div class="lenses">
  <div v-click class="l ink"><b>Financial</b><span>Who pays, who earns, and is it sustainable?</span></div>
  <div v-click class="l chain"><b>Technical</b><span>Which accounts, programs and transactions?</span></div>
  <div v-click class="l loss"><b>Risk</b><span>How could users lose money? What stops it?</span></div>
  <div v-click class="l gain"><b>Strategic</b><span>Who uses it, and what could change that?</span></div>
</div>

<div v-click class="evidence">
  <span class="tag">Primary</span> docs, explorer data, audits, the code
  <span class="tag sec">Secondary</span> dashboards, articles, threads
</div>

<style>
.lenses { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.9rem; margin-top: 0.6rem; }
.lenses .l { border-left: 8px solid; padding: 0.5rem 0.9rem; background: #fff; border-radius: 0 var(--r-md) var(--r-md) 0; }
.lenses .l b { display: block; font-size: var(--fs-lg); font-stretch: 115%; }
.lenses .l span { font-size: var(--fs-sm); color: var(--ink-2); }
.lenses .ink { border-color: var(--ink); } .lenses .chain { border-color: var(--chain); } .lenses .loss { border-color: var(--loss); } .lenses .gain { border-color: var(--gain); }
.evidence { margin-top: 1.4rem; font-size: var(--fs-sm); display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
.evidence .tag { font-weight: 800; background: var(--chain); color: #fff; padding: 0.1rem 0.5rem; border-radius: var(--r-sm); }
.evidence .tag.sec { background: var(--muted); margin-left: 1rem; }
</style>

<!--
Curriculum chapter 6.1, research area C. Every capstone covers all four lenses, even if one dominates.

Evidence: prefer primary sources (the protocol's documentation, the explorer, the audit report, the code itself). Use secondary sources to find leads, then confirm in primary data. Record access dates for anything that changes.

The habit from week 5 carries over: separate what you observed from what you think it means. A report that says "I could not verify X" is stronger than one that hides the gap.
-->

---

# Builders: will it still deploy?

<ToolchainCheck />

<Callout tone="warn" class="mt-4" title="Check the Anchor releases page before you start">
Versions as of 6 Oct 2026. Solana moves to sBPFv3 in Q4 2026; after SIMD-0500 activates, older builds cannot deploy.
</Callout>

<!--
Two traps found while building builders/anchor (checked 14 Oct 2026). First, `anchor` runs whatever version avm has selected, not the one in Anchor.toml: run `avm install 1.2.1 && avm use 1.2.1` first. Second, a project scaffolded by Anchor 1.2.1 builds sBPFv3 programs, but its generated LiteSVM 0.10 tests cannot load them (InvalidAccountData). Use LiteSVM 0.16 and Rust 1.95, as builders/anchor does, or start from that workspace instead of `anchor init`. On Anchor 0.32.x, plain `anchor build` may still produce old-format programs: use `cargo build-sbf --arch v3`. SIMD-0500 is expected on mainnet with Agave 4.4 in Nov 2026; existing programs keep running, but new deploys and upgrades need sBPFv3.

From the handbook, checked 11 Oct 2026:
- Start on the latest Anchor 1.x: 1.2.1 as of 6 October 2026.
- Solana is moving to sBPFv3 in Q4 2026. Once SIMD-0500 activates, programs not built for sBPFv3 cannot be deployed.
- Supported minimums: Anchor 0.30.2, 0.31.2, 0.32.2 or 1.2.0+; Pinocchio 0.10; Quasar 0.1.0.
- Old tutorials pinned to Anchor 0.29 will break. If a student follows a 2023 tutorial, this is why it fails.

Anchor 1.0 (April 2026) made Surfpool the default test validator.

Click a few versions live, starting with 0.29.0, the version most old tutorials use.
-->

---
clicks: 7
---

# The on-chain capstone, end to end

<BuildPipeline :step="$clicks" class="mt-6" />

<!--
The order matters. Students who deploy first and test later spend demo day debugging.

1. Start from a reference: solana-developers/program-examples (tokens/token-swap is a constant-product AMM in Anchor), Blueshift's challenges (Anchor escrow, Pinocchio AMM), Cyfrin Updraft's Solana course.
2. Write the happy-path test first in LiteSVM: fast, in-process, no validator.
3. Then write at least one attack test from week 5: wrong signer, fake account, stale price. It must fail.
4. If the program reads real mainnet state (a Pyth feed, a Kamino market), use Surfpool: surfpool start forks mainnet accounts lazily as you touch them, with cheatcodes to fund wallets and move time.
5. Deploy to devnet.
6. For the demo, show one real devnet transaction on Orb with ?cluster=devnet. Reading it out loud proves it is real.
-->

---
layout: section
tone: gain
---

# Where this leads

Your finance background is the advantage.

---

# Pick a direction

<CareerPaths />

<!--
Click each role. The plot is a rough map, not a ranking: roles on the left need more finance, roles on the right more engineering.

Important for this group: most mentees come from accounting and finance. The left half of this map is where they already have an edge. A DeFi research analyst who understands credit risk, collateral and revenue quality is rare. Developers who can also read a balance sheet are rarer.

The "prove it with" line maps each role to work they have already done in this course. The six blog posts are a portfolio.

Career research task (curriculum chapter 6.2): pick two roles. List the skills they share, the skills that differ, and one project that would show readiness for each.
-->

---

# Where to go next

<div class="next">
  <div v-click><b>Superteam Earn</b><span>Bounties, projects, grants. Nigeria-only writing and video bounties run often.</span><code>superteam.fun/earn</code></div>
  <div v-click><b>Turbin3</b><span>Free 6-week builders programme. Selective: under 30% get in.</span></div>
  <div v-click><b>Blueshift</b><span>Free challenges with on-chain certificates.</span></div>
  <div v-click><b>Cyfrin Updraft</b><span>Free Solana course, including security.</span></div>
  <div v-click><b>Colosseum</b><span>Runs the main Solana hackathons. Check the schedule.</span></div>
</div>

<style>
.next { display: grid; gap: 0.5rem; margin-top: 0.5rem; }
.next > div { display: grid; grid-template-columns: 13em minmax(0, 1fr) auto; gap: 1rem; align-items: baseline; border-bottom: 1px solid var(--rule); padding: 0.4rem 0; }
.next b { font-size: var(--fs-lg); font-stretch: 112%; color: var(--chain); }
.next span { font-size: var(--fs-base); }
.next code { font-size: var(--fs-xs); }
</style>

<!--
Superteam Earn is the most direct path to getting paid. The blog posts from this course are exactly what writing bounties ask for. Superteam Nigeria often runs Nigeria-only bounties.

Turbin3 is the natural next step for builders: free, six weeks, selective (under 30% of applicants make it through).

Blueshift: free, open-source challenges with immediate feedback and on-chain certificates. Good for steady practice.

Cyfrin Updraft: free Solana course with an AMM module and security sections.

Colosseum runs the main Solana hackathons. Hackathons are where many people get hired; check the current schedule.
-->

---
layout: center
---

# How I got here

<p class="fs-lg ink-2" style="max-width: 32ch">Five minutes, your own story. From Turbin3 to working in the ecosystem.</p>

<!--
This is the most useful career content you can give them. Tell it straight:
- Where you started.
- The first thing you built or wrote that someone noticed.
- What Turbin3 was like and what it led to.
- One thing you would do differently.
- What you look for when someone new asks for help.

Keep it to five minutes and take questions.
-->

---
layout: section
tone: chain
---

# Demo day

Five minutes. One question. Evidence.

---

# Five minutes, five parts

<div class="demo">
  <div v-click class="p" style="flex: 1"><b>0:30</b><span>The question</span></div>
  <div v-click class="p" style="flex: 3"><b>1:30</b><span>How it works</span></div>
  <div v-click class="p" style="flex: 3"><b>1:30</b><span>The evidence</span></div>
  <div v-click class="p loss" style="flex: 2"><b>1:00</b><span>The risks</span></div>
  <div v-click class="p gain" style="flex: 1"><b>0:30</b><span>Next</span></div>
</div>

<p v-click class="fs-md mt-8">Show one real thing: a transaction, a chart with a date, a passing test.</p>

<style>
.demo { display: flex; gap: 4px; margin-top: 2rem; }
.demo .p { background: var(--chain); color: #fff; padding: 0.7rem 0.7rem; border-radius: var(--r-sm); min-width: 0; }
.demo .p.loss { background: var(--loss); } .demo .p.gain { background: var(--gain); }
.demo b { display: block; font-size: var(--fs-xl); font-stretch: 112%; }
.demo span { font-size: var(--fs-sm); }
</style>

<!--
Bar widths match the time. Most students overrun "how it works" and skip the risks; the structure stops that.

The question: one sentence, the narrowed one from the funnel.
How it works: the mechanism, with one diagram.
The evidence: the data, the model, or the running code.
The risks: what could go wrong and what they could not verify.
Next: one thing they will learn or build next.

Rule: show one real artefact. A devnet transaction on Orb, a chart with a date on it, a test run. Screenshots of other people's dashboards do not count.
-->

---

# Score yourself before you present

<DemoRubric />

<!--
Weights from the curriculum's week 6 assessment: research and sources 20%, DeFi mechanics 20%, financial or technical analysis 25%, risk and critical thinking 20%, communication 15%. These are proposed self-assessment weights, not official WIBA grading criteria. Say so.

Use it two ways: each student scores themselves before presenting, then peers score them after. The gap between the two is the feedback.
-->

---

<Quiz
  q="Which capstone question is best?"
  :options="['Is Solana better than Ethereum?', 'How much would SOL need to fall before typical borrowers on one lender hit liquidation, as of a stated date?', 'What is the future of DeFi?', 'Is staking good?']"
  :answer="1"
  why="It names a protocol, a measurement and a date. Docs, on-chain data and a spreadsheet can answer it."
/>

<!--
The others are opinions or too broad. Ask a student to narrow one of the wrong answers live, using the funnel.
-->

---
layout: center
---

# Final blog post

<p class="fs-xl wide" style="font-weight:800; max-width: 26ch">"My 6-week journey in Solana DeFi and my next steps into Web3."</p>

<div class="mt-6 fs-md">

Link your **five earlier posts** and your **capstone**. Name **one role** you are aiming for and **one next project**.

</div>

<!--
This post is the cover letter for their portfolio. Linking the earlier posts turns six separate pieces into one story. Naming a role and a next project makes it actionable, and gives you something to follow up on.
-->

---
clicks: 7
---

# Closing the books

<ClosingLedger :step="$clicks" class="mt-4" />

<!--
Click through the six weeks as ledger entries, then the balance carried forward. It is a ledger because that is where this course started: from the bank's private book to a public one anyone can read.

Thank them. Tell them where to find you, and that the decks are open source on GitHub if they want to teach this themselves.
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

- Prepare **your own career story**: five minutes, honest, with one thing you would do differently.
- Check **Anchor's releases page** and the **sBPFv3 / SIMD-0500** status. Update the version slide if it moved.
- Check **Superteam Earn** for live bounties, especially Superteam Nigeria writing ones. Show real listings.
- Check **Turbin3's** next cohort dates and **Colosseum's** hackathon schedule.
- Agree the **demo day format**: time per student, who scores, how the presenter is picked.

</v-clicks>

<!--
The careers half of this week lands much better with live, current links: an open bounty they could apply for tonight, a cohort with a real deadline.

Demo day logistics: with more than 10 students, split into two rooms or two sessions. Five minutes each plus two for questions adds up fast.
-->

---

# Verify before class

<Callout tone="warn" title="Toolchain versions move">
Anchor 1.2.1 and the sBPFv3 timeline were current on 6 to 11 Oct 2026. Re-check before telling builders which version to use.
</Callout>

<Callout tone="warn" title="Programme details change" class="mt-3">
Turbin3 acceptance rate, Superteam bounty types and hackathon dates come from handbook research. Confirm them on the day.
</Callout>

<Callout tone="warn" title="Rubric weights are a suggestion" class="mt-3">
The 20/20/25/20/15 weights are proposed self-assessment weights, not official programme grading. Use the programme's rules where they differ.
</Callout>

<!--
Anything in this deck that names a version, a date or a programme detail should get a fresh look the week you teach it.
-->
