# Week 2 · Wallets and on-chain basics

## The idea in one line

Your wallet holds keys, not coins. Balances live on the ledger, in accounts.

## Key terms

| Term | Meaning |
|---|---|
| Keypair | A secret key and the public key made from it |
| Address | A public key written in base58 |
| Recovery phrase | 12 or 24 words that rebuild every key |
| Account | lamports, data, owner, executable |
| Lamport | One billionth of a SOL |
| Rent | A refundable deposit for an account's storage |
| Mint | The account that defines a token |
| Token account (ATA) | Holds one wallet's balance of one token |
| Instruction | One call to one program inside a transaction |
| Devnet | Solana's free test network for apps |

## Three things to remember

1. Wallet → token account → mint. Each token you hold has its own token account.
2. The mint address is a token's identity. Names and logos can be copied.
3. A new token account costs a deposit of 0.00203928 SOL, returned when it closes.

## Do and don't

- Never share your recovery phrase, or any part of it, with anyone.
- Use devnet and test tokens only.
- Read every signing popup before you approve.
- A failed transaction still pays its fee.

## This week's task

Set up a devnet wallet. Get SOL (faucet.solana.com) and USDC (faucet.circle.com).
Send USDC to a partner. On Orb with ?cluster=devnet, find the fee, the token instruction and the new token account.
Blog: "How I interacted with my first Solana dApp."

Circle devnet USDC mint: 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU

Deck: /week-2/
