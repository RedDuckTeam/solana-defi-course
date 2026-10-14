// Week 3: constant-product pool maths you can change and rerun.
// Usage: npx tsx src/w3-amm.ts [x] [y] [dx] [feeBps]
import { holdVsLp, impermanentLoss, poolAfter, priceImpact, swapOut } from './lib/amm.ts'

const [x = 100, y = 100, dx = 10, fee = 30] = process.argv.slice(2).map(Number)
const pool = { x, y }
const f2 = (n: number) => n.toFixed(4)

console.log(`Pool ${x} X / ${y} Y, k = ${x * y}`)
console.log(`Sell ${dx} X, no fee:    get ${f2(swapOut(pool, dx))} Y, price impact ${(priceImpact(pool, dx) * 100).toFixed(2)}%`)
const after = poolAfter(pool, dx, fee)
console.log(`Sell ${dx} X, ${fee / 100}% fee: get ${f2(swapOut(pool, dx, fee))} Y, k after = ${(after.x * after.y).toFixed(1)}`)

console.log('\nImpermanent loss (start: 5 SOL at $100 + 500 USDC)')
console.log('price move   hold      LP        IL')
for (const r of [1.25, 2, 4, 0.5]) {
  const h = holdVsLp(5, 100, r)
  console.log(`${String(r + 'x').padEnd(12)} $${h.hold.toFixed(0).padEnd(8)} $${h.lp.toFixed(0).padEnd(8)} ${(impermanentLoss(r) * 100).toFixed(2)}%`)
}
console.log('\nExercise: add a fee income column. How much daily volume does a $1,000 position need at 0.3% to cover the 2x loss in 30 days?')
