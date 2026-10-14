# Week 6 · Capstone, demo and careers

Deck: `/week-6/` (21 slides). Slides 19 to 21 are teacher prep.

## 1. Outcomes

By the end of the week the mentee can:

- Turn a broad topic into a research question data can answer.
- Analyse one protocol or mechanism through four lenses: financial, technical, risk, strategic.
- Deliver a five-minute demo with one real artefact.
- Name a target role and the next project that proves they're ready for it.

## 2. Session plan

**Session 1: the capstone (slides 1 to 8, 60 to 120 min)**
- Slides 3 to 6: three tiers, narrowing the question, four lenses.
- Slides 7 to 8 (Builders): toolchain check, the on-chain capstone pipeline.
- Mentee does: picks a tier and narrows their question with the mentor.
- Teach-back: "Why is your question answerable with the data you have?"

**Session 2: careers and working time (slides 9 to 12, 60 to 120 min)**
- Slides 9 to 12: pick a direction, where to go next, the mentor's own story.
- Most of this session is capstone working time, with the mentor unblocking.
- Teach-back: "Which role suits you, and what would you need to show to get it?"

**Session 3: demo prep (slides 13 to 18, 60 to 120 min)**
- Slides 13 to 15: five minutes, five parts; self-score with the rubric.
- Slides 16 to 18: quiz, final blog prompt, closing.
- Mentee does: a full dry run of the demo, timed.
- Teach-back: none. The dry run is the teach-back.

**Consolidation: demo day (30 to 60 min)**
- Each mentee presents for five minutes. Score with the rubric below.

## 3. Pre-reading

- Before Session 1: https://defillama.com/chain/Solana. Pick a protocol and a dated number.
- Before Session 1: https://solana.com/docs. Builders: the docs index for programs and testing.
- Before Session 2: https://earn.superteam.fun. Bounties and roles that match their tier.
- Before Session 3: https://solana.com/developers. Where Solana developer resources and hackathons are listed.

## 4. Task checklist

**Users (no code or light code)**
- [ ] A clear research question, narrowed.
- [ ] A report or dashboard with a date and a source on every number.
- [ ] Optional: reuse `materials/week-3-liquidity-model.xlsx` or `materials/week-4-lending-model.xlsx` as the model.

**Builders (on-chain)**
- [ ] Start from `builders/anchor` `cp-amm`, or another small program.
- [ ] Happy-path test and one attack test (week 5).
- [ ] Deploy to devnet. Show one real transaction on Orb.
- [ ] Use an Anchor version that will still deploy after sBPFv3 (0.32.2+ or 1.2.0+).

**Everyone**
- [ ] Five-minute demo, one real artefact.
- [ ] Final blog post linking the five earlier posts.

## 5. Marking guide

**Capstone** (the course's capstone weights)

| Criterion | Weight | Strong | Adequate | Weak |
|---|---|---|---|---|
| Research and sources | 20 | Primary sources, dated, cited | Mostly secondary | Unsourced |
| Understanding of DeFi mechanics | 20 | Mechanism explained correctly | Minor gaps | Wrong mechanism |
| Financial or technical analysis | 25 | Model or code works and is explained | Works, thin explanation | Doesn't work |
| Risk and critical thinking | 20 | Risks and limits named honestly | Risks listed generically | No risks |
| Communication | 15 | Five minutes, one artefact, clear | Overruns or no artefact | Unclear |

**Final blog post**

| Criterion | Weight | Strong | Adequate | Weak |
|---|---|---|---|---|
| Own words | 25 | Can explain every paragraph | Mostly | AI draft |
| Evidence | 25 | Links five posts and the capstone | Some links | None |
| Accuracy | 20 | Claims match their work | One slip | Overclaims |
| Next step | 20 | One named role and one next project | Vague plans | None |
| Dated number | 10 | Any moving number dated | Undated | None |

## 6. Model answer outline

- One-sentence question, for example: "How does a Solana lending market protect lenders when SOL falls 25% in a day?"
- Evidence: the week 4 model with a real market's settings, dated, and one real liquidation found on an explorer.
- Four lenses: how the market earns, which programs and accounts are involved, what could break (oracle, liquidity), who competes.
- Demo timing: question 0:30, how it works 1:30, evidence 1:30, risks 1:00, next 0:30.
- Final post: links to the five earlier posts and the capstone, a target role, one next project.

## 7. Common mistakes

- A question too broad to answer ("Is DeFi the future?"). Ask: what data would settle it?
- Screenshots of someone else's dashboard as the evidence. Ask: what did you produce yourself?
- Skipping risks to save time. Use the five-part timing.
- Builders pinned to old Anchor tutorials. Ask: which Anchor version, and will it deploy after sBPFv3?

## 8. If time is short

Skip slides 7 (toolchain, Users-only groups), 12 (mentor's story, move to the closing) and 16 (quiz). Keep slides 4, 5, 14 and 15.
