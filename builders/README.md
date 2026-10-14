# Builders track starter code

Runnable, tested code for the Builders extension in every week of the course. Users-track students don't need any of this.

Devnet and local tests only. Never put a mainnet key in these scripts, and never share a recovery phrase or a keypair file.

## Setup

| Tool | Version used | Install |
|---|---|---|
| Node | 22 or newer | nodejs.org |
| Solana CLI | 3.1 (Agave) | `sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"` |
| Rust | 1.95.0 for tests (pinned in `anchor/rust-toolchain.toml`, installed by rustup on first run) | rustup.rs |
| Anchor | 1.2.1 | `cargo install --git https://github.com/solana-foundation/anchor avm && avm install 1.2.1 && avm use 1.2.1` |

Why Anchor 1.2.1: Solana is moving to sBPFv3 in Q4 2026. Once SIMD-0500 activates, programs built with older toolchains can't be deployed. Supported minimums are Anchor 0.30.2, 0.31.2, 0.32.2 or 1.2.0+. Anchor 1.2.1 builds sBPFv3 by default. Tutorials pinned to Anchor 0.29 will break.

```bash
cd builders/ts && npm install && npm test        # 20 offline tests, under a second
cd builders/anchor && anchor build && anchor test # 11 Rust tests on LiteSVM, no validator needed
```

Already have another Anchor version? `avm use 1.2.1` for this course, `avm use <old>` to switch back.

## Week 1: ask Jupiter for a quote

```bash
cd builders/ts
JUP_API_KEY=your-key npm run w1        # 1 SOL to USDC
JUP_API_KEY=your-key npm run w1 -- 250 # 250 SOL: watch the route split
```

Get a free key at portal.jup.ag. It calls `GET https://api.jup.ag/swap/v2/order` with no taker, so it's quote-only: nothing to sign, no funds. It prints the full JSON first, then the route. Field names change between API versions, so read the JSON before you trust the route printout.

**Exercise:** run it at 1, 100 and 10,000 SOL. Which venues appear only on the big trades, and why? (Week 3 answers it: price impact.)

## Week 2: your devnet wallet and a USDC send

```bash
solana-keygen new -o ~/devnet.json
npm run w2 -- ~/devnet.json                            # SOL and devnet USDC balances
npm run w2 -- ~/devnet.json <partner-address> 5        # send 5 devnet USDC
```

Get devnet SOL at faucet.solana.com and devnet USDC at faucet.circle.com (mint `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`). The send creates your partner's token account if they have none (idempotent), then does `transferChecked`. It prints an Orb link with `?cluster=devnet`.

Faucets throttled in class? Run a local validator and point the script at it:

```bash
solana-test-validator --reset            # in another terminal
spl-token create-token --decimals 6 --url localhost        # your own "USDC"
MINT=<that mint> RPC_URL=http://127.0.0.1:8899 npm run w2 -- ~/devnet.json <partner> 5
```

**Exercise:** send twice to the same person. Compare the two transactions' SOL balance changes. Where did the extra ~0.002 SOL go the first time?

The `spl-token` CLI task from the week 2 deck (create a token, mint 1,000, revoke mint authority) needs no code from here.

## Week 3: constant-product maths

```bash
npm run w3                       # 100/100 pool, sell 10, 0.3% fee, plus the impermanent loss table
npm run w3 -- 1000 1000 10 30    # deeper pool: same trade, much less price impact
```

`src/lib/amm.ts` has `swapOut`, `priceImpact`, `lpShare`, `impermanentLoss` and `holdVsLp`. Tests in `test/amm.test.ts` pin the deck's numbers: 9.0909 out with no fee, 9.066 with 0.3%, IL of −0.62%, −5.72%, −20% and −5.72% at 1.25x, 2x, 4x and 0.5x.

**Exercise:** add a fee-income column. How much daily volume does a $1,000 position need at 0.3% to cover the 2x loss in 30 days?

For the on-chain version, see `anchor/programs/cp-amm` (week 6).

## Week 4: lending, liquidation and a live price

```bash
npm run w4                       # 10 SOL at $150, borrow 900 USDC, walk the price down to liquidation
npm run w4 -- 10 105 900         # start from today's price
npm run w4:price                 # live SOL/USD from Pyth
```

The lending maths uses the deck's example market (max LTV 70%, liquidation at 80%, close factor 50%, bonus 5%). These are made-up numbers for teaching, not any protocol's. At $110 the health factor is 0.98, the liquidator repays 450 USDC and takes 4.295 SOL, and the borrower is left at health 1.12.

**Pyth changed on 26 Aug 2026:** Hermes now needs an API key (`Authorization: Bearer`), so the deck's "open the Hermes URL in a browser" step returns `401 unauthorized`. `w4:price` reads Pyth's SOL/USD price account on Solana mainnet instead (`7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE`, owned by the Pyth Receiver program), which needs no key. It also checks the account's owner before trusting it, the week 5 lesson in one line. Set `PYTH_API_KEY` (free trial at pythdata.app/signup) to also fetch the signed Hermes update.

**Exercise:** what liquidation price does your position have at today's price? How far is that, in percent?

## Week 5: audit a token, then break a program

```bash
npm run w5 -- EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v mainnet --issuer-checked   # USDC
npm run w5 -- 2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo mainnet                    # PYUSD, Token-2022
npm run w5 -- <your week 2 mint> devnet
```

It reads the mint (SPL Token or Token-2022): supply, decimals, mint and freeze authority, and every Token-2022 extension. Permanent delegate, transfer hook and transfer fee get flagged. `--issuer-checked` means you confirmed the issuer from their own docs, so active authorities read as "issuer-controlled" rather than "walk away".

Then the program:

```bash
cd builders/anchor
anchor build && anchor test
```

`programs/vault-bug` is Wormhole and Cashio in miniature. `withdraw_unsafe` never checks that the caller owns the vault or signed. `tests/exploit.rs` drains a victim's 5 SOL through it, then shows `withdraw` (a `Signer` plus `has_one = owner`) rejecting the same attack two ways.

**Exercise:** delete `has_one = owner` from `Withdraw` and run the tests. Which one fails, and what does the attacker gain?

## Week 6: the capstone AMM

`programs/cp-amm` is a minimal constant-product pool: `initialize_pool`, `deposit` (first deposit mints sqrt(a × b) LP tokens), `swap` (fee in basis points, `min_out` slippage guard) and `withdraw`. `tests/amm.rs` checks the deck's 9.066108 swap on chain, that k never falls over eight trades, that slippage and fake vaults are rejected, and a full withdraw.

It's a starter, not a product. Before it could hold real money it would need a minimum-liquidity lock against first-depositor attacks, refunds for off-ratio deposits, Token-2022 extension handling, admin controls and an audit.

**Capstone ideas:**
- Refund the excess on off-ratio deposits.
- Add a protocol fee that goes to a treasury.
- Read a Pyth price and refuse swaps that move the pool too far from it.

Deploy to devnet with `anchor deploy --provider.cluster devnet` once the tests pass. Never mainnet.

## Layout

```
builders/
  ts/
    src/lib/      pure logic: amm, lending, pyth, token-audit, jupiter
    src/w*.ts     one runnable script per week
    test/         node:test suites, offline
  anchor/
    programs/vault-bug   week 5
    programs/cp-amm      week 6
```
