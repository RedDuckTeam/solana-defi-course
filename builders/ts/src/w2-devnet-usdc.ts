// Week 2: your devnet wallet. Shows SOL and Circle devnet USDC, and can send USDC to a partner.
// Usage:
//   npx tsx src/w2-devnet-usdc.ts ~/devnet.json                       show balances
//   npx tsx src/w2-devnet-usdc.ts ~/devnet.json <recipient> 5          send 5 USDC
// Devnet only. The keypair file is the JSON array `solana-keygen new -o ~/devnet.json` writes. Never use a mainnet key here.
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import {
  address, appendTransactionMessageInstructions, assertIsTransactionWithBlockhashLifetime, createKeyPairSignerFromBytes,
  createSolanaRpc, createSolanaRpcSubscriptions, createTransactionMessage, getSignatureFromTransaction, pipe,
  sendAndConfirmTransactionFactory, setTransactionMessageFeePayerSigner, setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from '@solana/kit'
import {
  TOKEN_PROGRAM_ADDRESS, fetchMaybeToken, findAssociatedTokenPda,
  getCreateAssociatedTokenIdempotentInstructionAsync, getTransferCheckedInstruction,
} from '@solana-program/token'

// Circle's devnet USDC, 6 decimals. Set MINT to try the same flow with a token you created in week 2 (6 decimals).
const USDC_DEVNET = address(process.env.MINT ?? '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU')
const [keyPath, recipientArg, amountArg] = process.argv.slice(2)
if (!keyPath) {
  console.error('Usage: npx tsx src/w2-devnet-usdc.ts <keypair.json> [recipient amount]\nMake one with: solana-keygen new -o ~/devnet.json')
  process.exit(1)
}

// RPC_URL / WS_URL let you point this at a local validator (solana-test-validator or surfpool) when faucets are throttled.
const RPC_URL = process.env.RPC_URL ?? 'https://api.devnet.solana.com'
const WS_URL = process.env.WS_URL ?? RPC_URL.replace(/^http/, 'ws').replace(':8899', ':8900')
const rpc = createSolanaRpc(RPC_URL)
const rpcSubscriptions = createSolanaRpcSubscriptions(WS_URL)
const bytes = new Uint8Array(JSON.parse(readFileSync(keyPath.replace(/^~/, homedir()), 'utf8')))
const me = await createKeyPairSignerFromBytes(bytes)

const [myAta] = await findAssociatedTokenPda({ owner: me.address, mint: USDC_DEVNET, tokenProgram: TOKEN_PROGRAM_ADDRESS })
const { value: sol } = await rpc.getBalance(me.address).send()
const ata = await fetchMaybeToken(rpc, myAta)
console.log(`Wallet        ${me.address}`)
console.log(`SOL           ${Number(sol) / 1e9}`)
console.log(`USDC account  ${myAta}${ata.exists ? '' : ' (not created yet: get USDC at faucet.circle.com)'}`)
console.log(`USDC          ${ata.exists ? Number(ata.data.amount) / 1e6 : 0}`)
console.log(`Explorer      https://orb.helius.dev/address/${me.address}?cluster=devnet`)

if (!recipientArg) process.exit(0)
const amount = Number(amountArg)
if (!(amount > 0)) { console.error('Give an amount, for example 5'); process.exit(1) }

const have = ata.exists ? Number(ata.data.amount) / 1e6 : 0
if (have < amount) {
  console.error(`\nYou have ${have} USDC and tried to send ${amount}. Get devnet USDC at faucet.circle.com first.`)
  process.exit(1)
}

const recipient = address(recipientArg)
const [theirAta] = await findAssociatedTokenPda({ owner: recipient, mint: USDC_DEVNET, tokenProgram: TOKEN_PROGRAM_ADDRESS })
const createTheirs = await getCreateAssociatedTokenIdempotentInstructionAsync({ payer: me, owner: recipient, mint: USDC_DEVNET })
const transfer = getTransferCheckedInstruction({
  source: myAta, mint: USDC_DEVNET, destination: theirAta, authority: me,
  amount: BigInt(Math.round(amount * 1e6)), decimals: 6,
})

const { value: blockhash } = await rpc.getLatestBlockhash().send()
const message = pipe(
  createTransactionMessage({ version: 0 }),
  m => setTransactionMessageFeePayerSigner(me, m),
  m => setTransactionMessageLifetimeUsingBlockhash(blockhash, m),
  m => appendTransactionMessageInstructions([createTheirs, transfer], m),
)
const signed = await signTransactionMessageWithSigners(message)
assertIsTransactionWithBlockhashLifetime(signed)
try {
  await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(signed, { commitment: 'confirmed' })
} catch (e: any) {
  // Show the program logs: they say exactly which instruction failed and why.
  const logs: string[] = e?.context?.logs ?? e?.cause?.context?.logs ?? []
  console.error(`\nTransaction failed: ${e?.message ?? e}`)
  for (const l of logs.filter(l => /log: Error|failed|Instruction:/.test(l))) console.error(`  ${l}`)
  process.exit(1)
}
const sig = getSignatureFromTransaction(signed)
console.log(`\nSent ${amount} USDC to ${recipient}`)
console.log(`Transaction   https://orb.helius.dev/tx/${sig}?cluster=devnet`)
console.log('Find: the fee, the token program instruction, and the token account it created (if Bola had none).')
