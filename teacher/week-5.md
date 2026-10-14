# Week 5 · Risk and security

Deck: `/week-5/` (34 slides). Slides 31 to 34 are teacher prep, including the case library and "verify before class".

## 1. Outcomes

By the end of the week the mentee can:

- Sort a DeFi incident into one of four root-cause buckets: unchecked accounts, oracles and pricing, keys and signers, supply chain.
- Explain how Wormhole, Cashio, Mango and Drift happened, in plain words.
- Check a token's mint authority, freeze authority and Token-2022 extensions before trusting it.
- Explain why TVL alone says little about a protocol.
- Write a short post-mortem that separates facts from estimates.

## 2. Session plan

**Session 1: patterns and unchecked accounts (slides 1 to 10, 60 to 120 min)**
- Slides 3 to 5: incidents 2022 to 2026, sort them by cause.
- Slides 6 to 10: the caller hands you every account, Wormhole, Cashio, the Anchor fix.
- Mentee does: places each incident in a bucket out loud before the reveal.
- Teach-back: "Why is 'did you check this account is real?' the core Solana security question?"

**Session 2: oracles, keys, supply chain (slides 11 to 20, 60 to 120 min)**
- Slides 11 to 14: Mango, "is code law?", the oracle-attack calculator.
- Slides 15 to 18: durable nonces, Drift, Slope.
- Slides 19 to 20: the web3.js npm compromise.
- Mentee does: runs the oracle-attack calculator with and without a time-averaged price.
- Teach-back: "How did Drift lose ~$285M without a code bug?" "Why did a fake price let Mango's attacker borrow real money?"

**Session 3: risk without an attacker, due diligence, task (slides 21 to 30, 60 to 120 min)**
- Slides 21 to 26: the risk matrix, reading a token page, TVL, the scorecard, responsible research.
- Slides 27 to 28: quizzes.
- Slides 29 to 30: the task and blog prompt.
- Mentee does: audits one real token on Orb during the session.
- Teach-back: "TVL rose 40% this month. What do you check first?"

**Consolidation (30 to 45 min)**
- The mentee presents their post-mortem's root cause in one sentence, then defends it.

## 3. Pre-reading

- Before Session 1: https://solana.com/docs/core/accounts. Ownership and why it matters for security.
- Before Session 1: https://www.anchor-lang.com/docs. Account constraints such as `has_one`, `address` and `owner`.
- Before Session 2: https://docs.pyth.network/price-feeds. Confidence intervals and why prices can be pushed.
- Before Session 2: https://solana.com/docs/core/transactions. Recent blockhash and durable nonces.
- Before Session 3: https://defillama.com/hacks. A dated list of incidents.

## 4. Task checklist

**Users**
- [ ] Pick one incident. Write a post-mortem: what happened, which bucket, who lost money, what would have prevented it.
- [ ] Cite at least one primary source (the protocol's post-mortem or a security firm's analysis).
- [ ] Open one real token on Orb. Record mint authority, freeze authority and any Token-2022 extensions.

**Builders**
- [ ] Use `builders/anchor` `vault-bug`: run the exploit test against the unsafe path, then against the fixed path.
- [ ] Explain in two sentences which check stops the attack.
- [ ] Run `builders/ts/w5-token-audit.ts` on a mainnet and a devnet mint.

## 5. Marking guide

**Task**

| Criterion | Weight | Strong | Adequate | Weak |
|---|---|---|---|---|
| Root cause | 30 | Right bucket, one-sentence cause, mechanism explained | Right bucket, vague mechanism | Wrong or missing |
| Evidence | 20 | Primary source cited, dates on figures | Secondary sources only | No sources |
| Facts vs estimates | 15 | Loss marked "reported", disputes noted | Some hedging | Estimates as facts |
| Prevention | 15 | Specific control (check, timelock, TWAP) | Generic "audit it" | Missing |
| Token audit | 20 | Authorities and extensions with a verdict | Partial | Missing |

**Blog post**

| Criterion | Weight | Strong | Adequate | Weak |
|---|---|---|---|---|
| Own words | 25 | Can explain every paragraph | Mostly | AI draft |
| Evidence | 25 | Primary source link, tx or report | News article only | None |
| Accuracy | 25 | Bucket named for every incident | One slip | Mixes up incidents |
| Dated number | 10 | Every loss dated and "reported" | Some undated | None |
| Open question | 15 | Specific | Generic | None |

## 6. Model answer outline

Strong posts go deep on one incident. Example, Drift (1 April 2026):

- Admin powers sat behind a 2-of-5 Security Council multisig with no timelock.
- Signers were socially engineered into pre-signing durable-nonce transactions that hid admin actions.
- The attacker whitelisted a fake token (CVT) with an inflated price as collateral and withdrew real assets in about 12 minutes.
- Reported loss: about $285M (estimates range from $270M to $286M). Attribution: Drift named a DPRK-linked group on 5 April 2026. Mark it as attribution, not proven fact.
- Bucket: keys, signers and operations. No code bug.
- Prevention: timelocks on admin actions, simulating every transaction before signing, more signers.

Other cases to cite accurately: Wormhole (2 Feb 2022, ~$320M, fake sysvar account), Cashio (23 Mar 2022, ~$48 to 52M, unchecked collateral), Mango (11 Oct 2022, ~$110 to 116M, oracle manipulation), Aquifer (31 Aug 2026, ~$2.5M, cause not confirmed by the team).

## 7. Common mistakes

- Listing ten hacks with no depth. Ask: pick one and explain the mechanism.
- Calling every loss a "smart contract bug". Ask: was any code wrong in Drift?
- Quoting loss figures as exact. Ask: who estimated that, and when?
- "An audit means it's safe." Ask: was Wormhole audited?
- Treating mint authority as always bad. Ask: why does Circle keep it for USDC?

## 8. If time is short

Skip slides 13 (is code law?), 18 (Slope) and 26 (responsible research). Keep slides 7, 8, 17, 23 and 24.
