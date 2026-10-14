---
theme: default
title: DeFi on Solana · Week 2
info: Week 2. Wallets, accounts, tokens and transactions on devnet.
colorSchema: light
routerMode: hash
fonts:
  provider: none
transition: slide-left
mdc: true
layout: week
week: 2
heading: Wallets & on-chain basics
task: Get devnet SOL and USDC, send USDC to a partner, read the transaction on Orb.
blog: "How I interacted with my first Solana dApp."
---

<!--
Week 2 goal: every mentee leaves with a devnet wallet, has sent a token, and can point at three things in an explorer: the fee, the token instruction, and the token account it created.

Everything in weeks 3 and 4 builds on one picture: wallet → token account → mint. If they leave with only one thing, make it that.

Faucets are the number one thing that breaks in class. Pre-fund a teacher wallet with devnet SOL and USDC before class.
-->

---

# Today

<div class="today">
  <div v-click><b>1</b><span>Keys</span></div>
  <div v-click><b>2</b><span>Accounts</span></div>
  <div v-click><b>3</b><span>Tokens</span></div>
  <div v-click><b>4</b><span>Transactions</span></div>
  <div v-click class="task"><b>→</b><span>Send devnet USDC</span></div>
</div>

<style>
.today { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.8rem; margin-top: 3rem; }
.today > div { border-top: 6px solid var(--ink); padding-top: 0.6rem; }
.today b { display: block; font-size: var(--fs-3xl); font-weight: 900; font-stretch: 62%; color: var(--chain); line-height: 1; }
.today span { font-size: var(--fs-md); font-weight: 700; font-stretch: 110%; }
.today .task { border-color: var(--gain); }
.today .task b { color: var(--gain); }
</style>

---
layout: section
tone: chain
---

# Keys

Your wallet doesn't hold coins.

---

# A wallet is a keyring, not a purse

<div class="kr mt-10">
  <div v-click class="box ink"><b>Wallet app</b><span>Phantom, Solflare, Backpack</span><em>stores your secret key</em></div>
  <div v-click class="arr">signs →</div>
  <div v-click class="box chain"><b>Transaction</b><span>"move 5 USDC to Bola"</span><em>proof it was you</em></div>
  <div v-click class="arr">→</div>
  <div v-click class="box ledger"><b>The ledger</b><span>where the balance lives</span><em>on thousands of computers</em></div>
</div>

<p v-click class="fs-lg mt-10">Lose the phone, keep the phrase: <span class="gain">your money is fine</span>.<br>Lose the phrase: <span class="loss">nobody can help you</span>.</p>

<style>
.kr { display: flex; align-items: center; gap: 0.8rem; }
.kr .box { flex: 1; border: 2px solid; border-radius: var(--r-md); padding: 0.7rem 0.9rem; background: #fff; }
.kr .box.ink { border-color: var(--ink); } .kr .box.chain { border-color: var(--chain); }
.kr .box.ledger { border-color: var(--ink); background: var(--ink); color: #fff; }
.kr .box b { display: block; font-size: var(--fs-md); }
.kr .box span { display: block; font-size: var(--fs-sm); opacity: 0.85; }
.kr .box em { display: block; font-size: var(--fs-xs); font-style: normal; opacity: 0.65; margin-top: 0.2rem; }
.kr .arr { font-weight: 800; color: var(--chain); font-size: var(--fs-base); white-space: nowrap; }
</style>

<!--
The single most important mental model this week. Coins are not "in" the wallet app. They are entries on the ledger next to your address. The wallet app holds the key that lets you change those entries.

Consequences:
- If your phone breaks, install Phantom on a new phone, type your recovery phrase, and everything is there. Nothing was lost because nothing was on the phone.
- If someone gets your phrase, they can do the same thing on their phone. They don't need your device.

Compare a bank: your money is in the bank's ledger, and the bank decides who gets access. Here, the key decides.
-->

---
clicks: 6
---

# Twelve words, every address

<SeedToAddress :step="$clicks" class="mt-8" />

<!--
Click through slowly.

1. The recovery phrase (also called seed phrase): 12 or 24 common words from a fixed list of 2,048 (the BIP-39 list). The example on screen is made up. Never show a real one.
2. The words are turned into a long number called the seed. This is one-way: you can't get the words back from the seed or anything after it.
3. A derivation path picks one keypair out of that seed. Solana wallets like Phantom use m/44'/501'/0'/0'. 501 is Solana's registered coin number.
4. Out comes a keypair: a secret key and a public key.
5. The public key, written in base58, is your address. That's what you share.
6. Change one number in the path and you get a completely different address from the same 12 words. That's how one phrase restores "Account 1", "Account 2" and so on in Phantom.

Your address is the same on mainnet, devnet and testnet. Balances are separate on each.
-->

---

# Sign something

<p class="muted fs-sm" style="margin-top:-0.6rem">A real keypair, made in this browser. Sign, then edit the message.</p>

<KeyPairLab />

<!--
This is real Ed25519, the same signature scheme Solana uses. The key is generated in the browser and never leaves it.

Demo:
1. Generate. Point out the address looks like a Solana address (base58).
2. Click the blurred secret key to reveal it, then say: this is the one thing you never show anyone. Hide it again.
3. Sign "Pay Bola 5 USDC". Valid.
4. Change it to "Pay Bola 500 USDC" without re-signing. Invalid.

That is what a signature proves: this exact message was approved by whoever holds the secret key for this address. It does not prove who that person is in real life, and it doesn't prove the message is a good idea. A phishing site can get you to sign a perfectly valid transaction that drains you.

Signing a message (like "log in to this site") is different from signing a transaction (which moves funds). Wallets show which one you're doing. Read the popup.
-->

---

# Who holds the key?

<div class="grid grid-cols-2 gap-8 mt-6">
<div v-click>

### <span class="ink">Custodial</span>

An exchange holds it for you.
<p class="fs-sm muted">Easy recovery. They can freeze you. If they fail, you queue with everyone else (FTX).</p>

</div>
<div v-click>

### <span class="chain">Non-custodial</span>

You hold it. Phantom, Solflare, Backpack.
<p class="fs-sm muted">Full control. No password reset. Hardware wallets keep the key off your laptop.</p>

</div>
</div>

<Callout v-click tone="loss" title="The one rule" class="mt-8">
Nobody legitimate will ever ask for your recovery phrase. Not support, not a mentor, not a "wallet validator" site.
</Callout>

<!--
Wallet types to name quickly:
- Hot wallet: key on an internet-connected device (browser extension, phone app). Convenient, exposed.
- Hardware wallet (Ledger and others): the key stays on the device and signs there. Your laptop never sees it. Still vulnerable if you approve a bad transaction.
- Multisig: several keys must sign. Teams use this for treasuries and admin keys (Squads is the main one on Solana). Week 5's Drift hack shows a multisig can still be tricked.

Security checklist for mentees: write the phrase on paper, never in a photo or cloud note. Use a separate wallet for testing. Check the URL before connecting. Read every signing popup. Revoke or close wallets you don't use.
-->

---

<Quiz
  q="'Phantom Support' DMs you: there's a sync bug, enter your recovery phrase at their link to fix it. What do you do?"
  :options="['Enter it, support needs it to fix things', 'Send only the first 6 words', 'Ignore and block. It\'s a theft attempt', 'Move funds first, then enter it']"
  :answer="2"
  why="The phrase is the money. Anyone with it can rebuild your wallet on their own device. Real support never asks."
/>

<!--
Option B is a real thing scammers ask for. Six words out of twelve cuts the guessing problem down enormously. Never share any part of it.
-->

---
layout: section
tone: chain
---

# Accounts

Everything on Solana is one.

---

# One shape for everything

<AccountAnatomy />

<!--
Click through the four tabs. Same fields every time; only the values differ.

- lamports: the SOL balance. 1 SOL = 1,000,000,000 lamports.
- data: raw bytes. Only meaningful to the program that owns the account.
- owner: the program allowed to change this account's data and take its lamports. This is the single most important field for security. A token account owned by anything other than the Token Program is fake.
- executable: true means the account is a program.

Key idea for builders and analysts: programs don't store data inside themselves. They store it in separate accounts they own. A swap pool is an account owned by the DEX program. Your USDC balance is an account owned by the Token Program.

The numbers in the deposit rows are the real rent-exempt minimums: 1,461,600 lamports for an 82-byte mint, 2,039,280 lamports for a 165-byte token account.
-->

---

# Rent is a deposit, not a fee

<div class="rent mt-8">
  <div v-click class="step"><b>Create an account</b><span>Lock a small SOL deposit for the space it uses.</span><em class="chain">token account: 0.00203928 SOL</em></div>
  <div v-click class="step"><b>Use it</b><span>The deposit sits there. Nothing is charged over time.</span></div>
  <div v-click class="step"><b>Close it</b><span>The deposit comes back to you.</span><em class="gain">+0.00203928 SOL</em></div>
</div>

<p v-click class="fs-md mt-8">That's why your <strong>first</strong> USDC send to someone costs more than the second.</p>

<style>
.rent { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.rent .step { border-left: 5px solid var(--chain); padding-left: 0.8rem; }
.rent .step b { display: block; font-size: var(--fs-md); }
.rent .step span { display: block; font-size: var(--fs-sm); color: var(--ink-2); }
.rent .step em { display: block; font-style: normal; font-family: var(--mono); font-size: var(--fs-sm); margin-top: 0.4rem; }
</style>

<!--
The name "rent" is historical. Today every account must hold a minimum balance proportional to its size ("rent-exempt"), and that balance comes back when the account is closed.

The first time you send USDC to someone who has never held it, your transaction creates their USDC account, so you pay its deposit (about 0.002 SOL). Second time, the account exists, so you pay only the tiny fee.

Wallets like Phantom let you close empty token accounts and reclaim the SOL. Some "claim your free SOL" sites do exactly this, legitimately or as bait. Check what a site asks you to sign.
-->

---
layout: section
tone: chain
---

# Tokens

One program, many mints.

---
clicks: 5
---

# Wallet → token account → mint

<TokenAccountTree :step="$clicks" class="mt-2" />

<!--
The diagram that weeks 3 and 4 depend on. Draw it on a whiteboard too.

1. Your wallet: a System Program account holding SOL.
2. The USDC mint: one account that defines USDC. Decimals (6), total supply, and who is allowed to mint more (Circle) or freeze accounts.
3. Your USDC token account: holds your USDC balance. Its address is derived from your wallet address plus the mint, so anyone can work out where your USDC lives. That's the Associated Token Account, or ATA.
4. Another token, another token account. One per token you hold.
5. Sending to Bola moves USDC from your token account to Bola's token account. Your wallet signs, but the balance change happens in the token accounts.

Ethereum comparison: an ERC-20 is a contract with a table of balances inside it. On Solana, the code (Token Program) is shared by every token, the definition is the mint account, and each holder's balance is its own account.
-->

---

# Which one is USDC?

<MintIsIdentity />

<!--
Teaching moment straight from the handbook. Orca's devnet examples use their own devUSDC mint (BRjpCH…k1k). Circle's devnet USDC from faucet.circle.com is a different mint (4zMMC9…cDU). Both are "USDC" on devnet. You cannot swap one for the other 1:1, because they are different tokens.

The third card is made up for this slide, which is the point: anyone can create a token with any name and logo. Scam tokens copy names and logos all the time.

Rule: the mint address is the identity. Check it against the issuer's own documentation. On mainnet, Circle's USDC is EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v.
-->

---

# Two token programs

<div class="grid grid-cols-2 gap-10 mt-6">
<div v-click>

### SPL Token

The original. Mint, transfer, burn, freeze.
<p class="fs-sm muted">USDC, most older tokens.</p>

</div>
<div v-click>

### <span class="chain">Token-2022</span>

Same basics, plus optional **extensions**.
<p class="fs-sm muted">PYUSD, USDG, many newer tokens.</p>

</div>
</div>

<div class="ext mt-6">
  <span v-click>Transfer fee</span>
  <span v-click>Transfer hook</span>
  <span v-click class="danger">Permanent delegate</span>
  <span v-click>Non-transferable</span>
  <span v-click>Confidential transfer</span>
  <span v-click>Metadata</span>
</div>

<Callout v-click tone="warn" class="mt-6">Both programs have a <strong>mint authority</strong> and a <strong>freeze authority</strong>. Check who holds them before you buy anything.</Callout>

<style>
.ext { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.ext span { border: 1.5px solid var(--chain); color: var(--chain); border-radius: 999px; padding: 0.2em 0.8em; font-size: var(--fs-sm); font-weight: 650; background: #fff; }
.ext span.danger { border-color: var(--loss); color: var(--loss); background: var(--loss-soft); }
</style>

<!--
Extensions, in plain words:
- Transfer fee: the token takes a cut of every transfer.
- Transfer hook: every transfer also calls another program, which can block or log it.
- Permanent delegate: one address can move or burn anyone's balance of this token, forever. Useful for regulated assets (a court order), dangerous in a random memecoin. Red flag unless you know why it's there.
- Non-transferable: soulbound, can't be sent.
- Confidential transfer: hides amounts.
- Metadata: name, symbol and logo stored on the mint.

Mint authority: can create more tokens (dilution). Freeze authority: can freeze any holder's account. For USDC, Circle holds both, which is expected for a regulated stablecoin. For a memecoin, either one is a warning. Week 5 turns this into a checklist.
-->

---

<Quiz
  q="Where does your USDC balance actually live?"
  :options="['Inside your wallet account', 'Inside the USDC mint account', 'In your own USDC token account', 'In the Token Program\'s code']"
  :answer="2"
  why="Each holder has a separate token account for each token. Its address comes from your wallet plus the mint."
/>

---
layout: section
tone: chain
---

# Transactions

What you actually sign.

---

# Inside a transaction

<p class="muted fs-sm" style="margin-top:-0.6rem">Sending 5 USDC to Bola, who has never held USDC. Hover each part.</p>

<TxAnatomy />

<!--
A transaction is a list of instructions plus the signatures that authorise them.

Walk through it top to bottom. The things to remember:
- The first signature is the transaction's ID.
- Every account is listed up front, with flags: does it sign, is it written to. This is what lets the runtime run unrelated transactions in parallel (week 1).
- The recent blockhash expires after about 150 blocks, roughly a minute. That's why a transaction you left in a wallet popup for five minutes fails.
- Instructions run in order, and all succeed or the whole transaction fails. That all-or-nothing property is called atomic.

A transaction can be at most 1,232 bytes. That limit is why complex DeFi transactions sometimes use "address lookup tables" to compress the account list.
-->

---
clicks: 7
---

# The life of a transaction

<TxLifecycle :step="$clicks" class="mt-6" />

<!--
One stage per click.

Build: the app (say, a DEX front end) decides what instructions to send.
Sign: your wallet shows a preview. This is your last chance to catch a malicious request.
Send: the signed transaction goes to an RPC node, which forwards it directly to the validators scheduled to be leader soon. Solana doesn't use a shared mempool the way Ethereum does.
Execute: the leader runs it in its slot (about 400ms).
Processed, confirmed, finalized are the three "commitment levels" you'll see in explorers and APIs.
- Processed: in a block on the node you asked. Can still be dropped.
- Confirmed: validators with two thirds of the total stake voted for that block. Wallets usually show success here.
- Finalized: at least 31 more blocks have been built on top. For accounting purposes, treat this as settled.

Alpenglow, a new consensus protocol aimed at much faster finality, was approved by validator vote on 2 Sep 2025 (SIMD-0326, 98% yes). It went live on testnet (24 Sep 2026) and devnet (25 Sep 2026), and mainnet was scheduled for about 21 Oct 2026 (epoch 1064). Check solana.com/upgrades/alpenglow before quoting finality times: after it ships, the commitment levels on this slide change.
-->

---

# What it costs

<FeeCalc />

<!--
Drag the sliders.

Base fee: 5,000 lamports per signature. Half of it is burned, half goes to the validator.
Priority fee: optional. Compute limit times the price you set per compute unit (in micro-lamports). All of it goes to the validator. Used when the network or a hot account is busy.
Rent deposit: only if the transaction creates an account, and you get it back when the account closes.

Finance connection: at these costs, a $5 trade is worth doing. On Ethereum mainnet in busy periods, gas could be several dollars, which killed small trades entirely. Fees shape who can use DeFi.

Failed transactions still pay the fee. The validator did the work of running it.
-->

---

<Quiz
  q="Your swap fails because the price moved too much. What happens to the fee?"
  :options="['Refunded automatically', 'Charged anyway', 'Charged only if you retry', 'Paid by the DEX']"
  :answer="1"
  why="The network still processed it. The swap's changes are undone, but the fee is spent."
/>

---
clicks: 7
---

# Reading it on an explorer

<ExplorerTour :step="$clicks" class="mt-2" />

<!--
This is the task in miniature. Click through each part of the page.

Point out the SOL balance changes: you paid 0.000005 SOL in fees and 0.00203928 SOL as the deposit for Bola's new USDC account. Total 0.00204428, shown rounded.

The analyst habit (from the curriculum): separate what you observed from what you interpreted. "The transaction shows a transferChecked of 5 USDC" is observed. "Ada paid Bola for lunch" is interpretation.

Orb's "Explain with AI" button is useful for a first read. Always check it against the raw instructions.
-->

---
layout: section
tone: gain
---

# This week's task

Your first devnet transaction.

---

# The task

<Tracks>
<template #users>

1. Install **Phantom** (or Solflare, Backpack). Turn on **Testnet Mode** and pick **Solana Devnet**. Check the banner.
2. Get devnet SOL: **faucet.solana.com**
3. Get devnet USDC: **faucet.circle.com**
4. Send USDC to a partner.
5. Open it on **Orb** with `?cluster=devnet`. Find: the **fee**, the **token instruction**, the **token account it created**.

</template>
<template #builders>

Everything on the left, plus:

1. Create your own token with the `spl-token` CLI.
2. Mint 1,000 to yourself.
3. **Revoke the mint authority.**
4. Look at the mint account again. What changed?

</template>
</Tracks>

<!--
Phantom: Settings → Developer Settings → Testnet Mode, then choose Solana Devnet. A banner shows when testnet mode is on.

Circle's devnet USDC mint: 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU. Have mentees confirm the mint in Orb.

If the SOL faucet rate-limits the room (it limits by IP), send each mentee 1 devnet SOL from the teacher wallet you funded before class.

Pair people up for step 4 so everybody both sends and receives.
-->

---

# Builders: your own token

```bash {all|1-2|4-5|7-8|10|11|13-14}{lines: true}
solana config set --url devnet
solana-keygen new -o ~/devnet.json && solana airdrop 2

spl-token create-token
# → prints your new MINT address

spl-token create-account <MINT>
# → creates your token account (ATA) for it

spl-token mint <MINT> 1000
spl-token supply <MINT>

spl-token authorize <MINT> mint --disable
spl-token display <MINT>   # mint authority: (not set)
```

<!--
Step through with clicks.

After revoking the mint authority, nobody can ever mint more of this token. That's a one-way door. Revoking is what serious token launches do to prove a fixed supply, and it's the first thing to check on any token you're thinking of buying (week 5).

If `solana airdrop` is rate-limited, use faucet.solana.com in a browser with the address from `solana address`.

Optional extension: create a Token-2022 token with `spl-token create-token --program-2022` and add an extension like a transfer fee.
-->

---
layout: center
---

# Blog post

<div class="fs-xl wide" style="font-weight:800; max-width: 24ch">"How I interacted with my first Solana dApp."</div>

<div class="mt-6 fs-md">

Include **one transaction link** and an **annotated explorer screenshot**.

</div>

---
layout: section
tone: ink
---

# Teacher prep

For the mentor. Skip in class.

---

# You, before class

<v-clicks>

- Make a **fresh wallet** and run the whole task on it. Note which faucet rate-limits you.
- **Pre-fund a teacher wallet** with devnet SOL and USDC. Faucets break when a whole room shares one Wi-Fi.
- Prepare one whiteboard diagram: **wallet → token account (ATA) → mint**. Weeks 3 and 4 build on it.
- Read Solana's intro to transactions in the official docs.

</v-clicks>

<Callout v-click tone="warn" title="Faucet limit" class="mt-6">
Circle's faucet gives 20 USDC every 2 hours per address (confirmed in Circle's FAQ, 14 Oct 2026). Plan the transfer task around that.
</Callout>

---

# Words from week 2

<div class="gloss">
  <div><b>Keypair</b><span>A secret key and the public key made from it.</span></div>
  <div><b>Address</b><span>A public key written in base58.</span></div>
  <div><b>Recovery phrase</b><span>12 or 24 words that rebuild every key.</span></div>
  <div><b>Signature</b><span>Proof that a key holder approved this exact message.</span></div>
  <div><b>Account</b><span>lamports, data, owner, executable. Everything is one.</span></div>
  <div><b>Lamport</b><span>One billionth of a SOL.</span></div>
  <div><b>Rent</b><span>A refundable deposit for an account's storage.</span></div>
  <div><b>Mint</b><span>The account that defines a token.</span></div>
  <div><b>Token account (ATA)</b><span>Holds one wallet's balance of one token.</span></div>
  <div><b>Instruction</b><span>One call to one program inside a transaction.</span></div>
  <div><b>Blockhash</b><span>Recent block ID that makes a transaction expire.</span></div>
  <div><b>Devnet</b><span>Solana's free test network for apps.</span></div>
</div>

<style>
.gloss { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.3rem 2rem; margin-top: 0.5rem; }
.gloss div { display: grid; grid-template-columns: 160px minmax(0, 1fr); gap: 0.6rem; border-bottom: 1px solid var(--rule); padding: 0.28rem 0; }
.gloss b { font-size: var(--fs-sm); color: var(--chain); }
.gloss span { font-size: var(--fs-sm); color: var(--ink-2); }
</style>
