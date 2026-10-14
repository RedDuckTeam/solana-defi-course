// Week 4: the live SOL/USD price from Pyth. Lending is only as safe as this number.
// Usage: npx tsx src/w4-pyth-price.ts
//   No key needed: reads Pyth's SOL/USD price account on Solana mainnet.
//   With PYTH_API_KEY set: also fetches the same feed from Hermes (keys required since 26 Aug 2026; pythdata.app/signup).
import { address, createSolanaRpc, fetchEncodedAccount } from '@solana/kit'
import { HERMES, PYTH_RECEIVER_PROGRAM, SOL_USD_FEED, SOL_USD_PRICE_ACCOUNT, parseHermes, parsePriceUpdateV2 } from './lib/pyth.ts'

const rpc = createSolanaRpc('https://api.mainnet-beta.solana.com')
const acct = await fetchEncodedAccount(rpc, address(SOL_USD_PRICE_ACCOUNT))
if (!acct.exists) { console.error('Price account not found'); process.exit(1) }
if (acct.programAddress !== PYTH_RECEIVER_PROGRAM) {
  // The week 5 lesson in one line: never trust a price account without checking its owner.
  console.error(`Owner is ${acct.programAddress}, expected the Pyth Receiver. Refusing to read it.`); process.exit(1)
}
const p = parsePriceUpdateV2(acct.data)
const age = Math.round((Date.now() - p.publishTime.getTime()) / 1000)
console.log('On chain (no key)')
console.log(`  SOL/USD    $${p.price.toFixed(4)}  (± $${p.confidence.toFixed(4)})`)
console.log(`  Published  ${p.publishTime.toISOString()}  (${age}s ago, ${p.verification} verification)`)
console.log(`  Account    https://orb.helius.dev/address/${SOL_USD_PRICE_ACCOUNT}`)
if (p.id !== SOL_USD_FEED) console.log('  Warning: feed id does not match SOL/USD')

const key = process.env.PYTH_API_KEY
if (!key) {
  console.log('\nHermes skipped: set PYTH_API_KEY to also fetch the signed update an app would post in its transaction.')
  process.exit(0)
}
const url = `${HERMES}/v2/updates/price/latest?ids[]=${SOL_USD_FEED}`
const res = await fetch(url, { headers: { Authorization: `Bearer ${key}` } })
if (!res.ok) { console.error(`\nHermes answered ${res.status} ${await res.text()}`); process.exit(1) }
const h = parseHermes(await res.json())
console.log('\nHermes (signed update, pull oracle)')
console.log(`  SOL/USD    $${h.price.toFixed(4)}  (± $${h.confidence.toFixed(4)})`)
console.log(`  Published  ${h.publishTime.toISOString()}`)
