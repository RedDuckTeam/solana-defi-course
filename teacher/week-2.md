# Week 2 · Wallets and on-chain basics

Deck: `/week-2/` (30 slides). Slides 28 to 30 are teacher prep.

## 1. Outcomes

By the end of the week the mentee can:

- Explain why a wallet holds keys, not coins, and what a recovery phrase can do.
- Describe an account's four fields and say who owns a wallet, a mint, a token account and a program.
- Draw wallet → token account → mint, and send devnet USDC to someone.
- Find the fee, the token instruction and the new token account on an explorer.
- Explain why the first USDC send to someone costs more (rent deposit).

## 2. Session plan

**Session 1: keys (slides 1 to 8, 60 to 90 min)**
- Slides 3 to 7: keyring not purse, 12 words to every address, sign something live, custodial vs non-custodial.
- Slide 8: the "Phantom Support" quiz.
- Mentee does: generates a keypair on slide 6, signs, edits the message, watches verification fail.
- Teach-back: "If my phone breaks, is my money gone?" "What does a signature prove, and what doesn't it?"

**Session 2: accounts and tokens (slides 9 to 17, 60 to 90 min)**
- Slides 9 to 11: account anatomy, rent as a deposit.
- Slides 12 to 17: the token tree, which USDC is real, SPL vs Token-2022, find any token account, quiz.
- Mentee does: clicks through all four account types. Picks the real Circle USDC on slide 14, then finds a wallet's USDC token account on slide 16 and flips it to Token-2022.
- Teach-back: "Where does my USDC balance live?" "Two tokens are both called USDC. How do I tell which is real?"

**Session 3: transactions and the task (slides 18 to 27, 60 to 120 min)**
- Slides 18 to 23: transaction anatomy, lifecycle, fees, quiz, explorer tour.
- Slides 24 to 27: the task, the Builders CLI, the blog prompt.
- Mentee does: the task live. Wallet on devnet, faucets, send USDC to the mentor, read it on Orb.
- Teach-back: "Why did this transaction fail but still cost a fee?" "What does 'finalized' mean?"

**Consolidation (30 to 45 min)**
- The mentee draws wallet → token account → mint from memory, then annotates their own transaction.

## 3. Pre-reading

- Before Session 1: https://solana.com/docs/intro/wallets. What a wallet is and isn't.
- Before Session 2: https://solana.com/docs/core/accounts. The four account fields.
- Before Session 2: https://solana.com/docs/tokens. Mints, token accounts, associated token accounts.
- Before Session 3: https://solana.com/docs/core/transactions. Instructions, signatures, blockhash.
- Before Session 3: https://solana.com/docs/core/fees. Base fee, priority fee, rent.
- Before Session 3: https://developers.circle.com/stablecoins/quickstart-transfer-10-usdc-on-solana. Circle's devnet USDC and faucet.

## 4. Task checklist

**Users**
- [ ] Install Phantom, Solflare or Backpack. Turn on testnet mode and pick Solana Devnet.
- [ ] Get devnet SOL from faucet.solana.com. If rate-limited, ask the mentor.
- [ ] Get devnet USDC from faucet.circle.com (20 USDC every 2 hours per address). Mint `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`.
- [ ] Send USDC to a partner or the mentor.
- [ ] Open the transaction on Orb with `?cluster=devnet`. Find the fee, the token instruction, and the token account it created.

**Builders**
- [ ] All of the above.
- [ ] `spl-token create-token`, `create-account`, `mint 1000`, then `authorize <MINT> mint --disable`. Display the mint again.
- [ ] Run `builders/ts/w2-devnet-usdc.ts` with your devnet keypair to show balances and, optionally, send USDC.

## 5. Marking guide

**Task**

| Criterion | Weight | Strong | Adequate | Weak |
|---|---|---|---|---|
| Devnet setup | 15 | Devnet wallet with SOL and Circle USDC | Wallet set up, one faucet failed | Not set up |
| Transfer done | 25 | Devnet tx link, success | Tx exists but failed, cause explained | No tx |
| Explorer annotation | 35 | Fee, transferChecked, created ATA, rent all labelled | Two of the four | One or none |
| Observed vs interpreted | 15 | Clearly separates the two | Mixed | No distinction |
| Builders: own token | 10 | Mint authority shows "not set" | Token made, authority not revoked | Not done |

**Blog post**

| Criterion | Weight | Strong | Adequate | Weak |
|---|---|---|---|---|
| Own words | 25 | Can explain every paragraph | Mostly own words | AI draft |
| Evidence | 25 | Tx link plus annotated screenshot | One of the two | Neither |
| Accuracy | 25 | Keys, accounts and tokens right | One slip | Wallet "holds coins" |
| Dated number | 10 | Fee or balance with date | No date | None |
| Open question | 15 | Specific question | Generic | None |

## 6. Model answer outline

- A devnet transaction link that sends USDC to a new recipient.
- Annotations: one signature, base fee 0.000005 SOL; instruction 1 creates the recipient's associated token account; instruction 2 is a Token Program transferChecked.
- SOL balance change: about −0.00204428 SOL (0.000005 fee + 0.00203928 rent deposit for the new token account).
- One line on why: the recipient had no USDC account, so the sender paid its refundable deposit.
- Confirmation that the mint is Circle's devnet USDC, `4zMMC9…cDU`.

## 7. Common mistakes

- "My coins are in Phantom." Ask: if Phantom disappears tomorrow, what do you need to get them back?
- Mixing up the wallet address and the token account address. Ask them to point at each on Orb.
- Thinking rent is a recurring charge. Ask: what happens when the account closes?
- Using Orca's devUSDC and Circle's USDC as if they were the same. Ask: what's the mint address?
- Confusing confirmed with finalized. Ask them to walk the lifecycle slide.

## 8. If time is short

Skip slides 7 (custodial vs non-custodial), 15 (Token-2022 extensions, cover in week 5) and 26 (Builders CLI, for Users-only groups). Keep slides 4, 6, 13 and 23.
