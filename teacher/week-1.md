# Week 1 · Intro to DeFi

Deck: `/week-1/` (28 slides). Slides 26 to 28 are teacher prep: read them before the week. They are not for the sessions.

## 1. Outcomes

By the end of the week the mentee can:

- Explain DeFi in one sentence: financial services as open programs anyone can call.
- Name the five jobs a bank does and say who does each one on chain.
- Name one Solana protocol for swaps, aggregation, lending, perps, liquid staking and oracles.
- Explain why Solana suits trading: parallel execution, ~400ms slots, tiny fees.
- Read a Jupiter quote and say which venues the route used.

## 2. Session plan

**Session 1: what DeFi is (slides 1 to 9, 60 to 90 min)**
- Slides 1 to 2: the week, the task.
- Slides 3 to 8: bank jobs, share vs token swap, the one-line definition, the decentralisation dial, CeFi vs DeFi.
- Slide 9: quiz.
- Mentee does: runs the decentralisation dial on a protocol they pick.
- Teach-back: "Explain to me, a bank customer, what changes when a program holds my money." "Is FTX DeFi or CeFi, and why?"

**Session 2: history and the map (slides 10 to 15, 60 to 90 min)**
- Slides 10 to 12: seven stops from Bitcoin to Solana DeFi, then Terra vs FTX.
- Slides 13 to 15: the Solana map, then the sorting game.
- Mentee does: plays the sorting game out loud, explaining each choice.
- Teach-back: "Why were Terra and FTX different failures?" "What does Jupiter do that a DEX doesn't?"

**Session 3: why Solana, and the task (slides 16 to 25, 60 to 120 min)**
- Slides 16 to 20: three numbers, the parallel lanes simulation, why it matters, quiz.
- Slides 21 to 25: Jupiter route, the task, the Builders code, the blog prompt.
- Mentee does: starts the task live. Gets a SOL to USDC quote on jup.ag and reads the route.
- Teach-back: "Why can two unrelated transactions run at once?" "What is a hot account?"

**Consolidation (30 to 45 min)**
- The mentee re-teaches slides 4, 14 and 18 from memory.
- Review their route notes. Answer their open question for the blog.

## 3. Pre-reading

- Before Session 1: https://solana.com/learn/what-is-solana. Short, plain intro.
- Before Session 1: https://ethereum.org/en/defi/. The general DeFi idea and the main categories.
- Before Session 2: https://defillama.com/chain/Solana. Look at the top protocols and their categories. Note the date.
- Before Session 3: https://solana.com/docs/core/accounts. The account model, needed for week 2 and for "why Solana".
- Before Session 3: https://developers.jup.ag/docs/api-reference. What Jupiter's swap API returns.

## 4. Task checklist

**Users**
- [ ] Open jup.ag. Get a SOL to USDC quote. No wallet or funds needed.
- [ ] Write down which venues the route touched, and the split.
- [ ] Open any real swap on Orb (orb.helius.dev). Press "Explain with AI".
- [ ] Compare the explanation with the raw instructions. Note one thing you confirmed and one thing that was vague.

**Builders**
- [ ] All of the above.
- [ ] Get a free API key at portal.jup.ag.
- [ ] Run `builders/ts/w1-jupiter-quote.ts` with `JUP_API_KEY` set. Print the route.

## 5. Marking guide

**Task**

| Criterion | Weight | Strong | Adequate | Weak |
|---|---|---|---|---|
| Route traced | 30 | Venues and percentages listed, with time and date | Venues listed, no split | No route |
| Explorer reading | 25 | Fee, signer, programs called, all from raw data | Some fields from the AI summary only | Nothing from the explorer |
| AI vs raw comparison | 20 | One confirmed point, one vague or wrong point | Restates the AI | Missing |
| Correct terms | 15 | DEX, aggregator, slot, fee used correctly | Minor slips | Terms misused |
| Builders: code runs | 10 | Script prints routePlan from live API | Runs, prints raw JSON only | Doesn't run |

**Blog post**

| Criterion | Weight | Strong | Adequate | Weak |
|---|---|---|---|---|
| Own words | 25 | Mentee can explain every paragraph out loud | Mostly own words | Reads like an AI draft |
| Evidence | 25 | The traced route, with a screenshot or link | Mentions a route vaguely | No evidence |
| Accuracy | 25 | No wrong claims about DeFi or Solana | One minor error | Several errors |
| Dated number | 10 | Any moving number has a date | Number without date | No numbers |
| Open question | 15 | One real question they still have | Generic question | None |

## 6. Model answer outline

- One-line definition of DeFi, then the bank comparison: who holds the money, who settles, who checks identity, who takes the loss.
- A route like: "1 SOL to USDC, 14 Oct 2026, 10:05, split across two venues, 70% and 30%." The exact venues change minute to minute.
- One sentence on why the route split: big trades move a single pool's price.
- One sentence on Solana: parallel execution, ~400ms slots, base fee 5,000 lamports per signature.
- One honest cost: the full outages of September 2021 (~17 hours) and February 2024 (~5 hours).
- An open question, such as "Who pays if a DeFi app gets hacked?"

## 7. Common mistakes

- "DeFi is always safer than banks." Ask: who refunds you if you send to the wrong address?
- Calling FTX a DeFi failure. Ask: who held the customers' money?
- Thinking Jupiter holds liquidity. Ask: where does the USDC actually come from?
- "Solana is fast because of faster computers." Ask them to explain the parallel lanes slide.
- Trusting the AI explainer completely. Ask them to point at the raw instruction that proves its claim.

## 8. If time is short

Skip slides 7 (decentralisation dial), 12 (2022 collapses) and 24 (Builders code, for Users-only groups). Keep slides 4, 14, 18 and 22.
