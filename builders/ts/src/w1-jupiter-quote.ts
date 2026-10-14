// Week 1: ask Jupiter for a quote, SOL to USDC. Quote only: no taker, nothing to sign, no funds needed.
// Usage: JUP_API_KEY=... npx tsx src/w1-jupiter-quote.ts [amountInSol]
// Get a free key at portal.jup.ag. Old quote-api.jup.ag/v6 and lite-api.jup.ag tutorials are retired.
import { routeLegs } from './lib/jupiter.ts'

const SOL = 'So11111111111111111111111111111111111111112'
const USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'

const key = process.env.JUP_API_KEY
if (!key) {
  console.error('Missing JUP_API_KEY. Get a free key at https://portal.jup.ag, then run:\n  JUP_API_KEY=your-key npm run w1')
  process.exit(1)
}

const sol = Number(process.argv[2] ?? 1)
const lamports = BigInt(Math.round(sol * 1_000_000_000)) // SOL has 9 decimals
const url = `https://api.jup.ag/swap/v2/order?inputMint=${SOL}&outputMint=${USDC}&amount=${lamports}`

const res = await fetch(url, { headers: { 'x-api-key': key } })
const body = await res.json().catch(() => ({}))
if (!res.ok) {
  console.error(`Jupiter answered ${res.status}:`, body)
  process.exit(1)
}

console.log('Full response (read this first, field names change):')
console.log(JSON.stringify(body, null, 2))

const legs = routeLegs(body)
console.log(`\nRoute for ${sol} SOL:`)
if (!legs.length) console.log('  No routePlan field found. Look at the JSON above and find where the venues are listed.')
for (const l of legs) console.log(`  ${l.label}${l.percent !== undefined ? `  ${l.percent}%` : ''}`)
const out = (body as any).outAmount ?? (body as any).quote?.outAmount
if (out) console.log(`Out: ${Number(out) / 1_000_000} USDC (USDC has 6 decimals)`)
