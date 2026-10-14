// Week 4: a lending position, step by step, down to liquidation. Example market settings, not a real protocol's.
// Usage: npx tsx src/w4-lending.ts [collateralSol] [startPrice] [debtUsdc]
import { EXAMPLE_MARKET, borrowRoom, healthFactor, liquidate, liquidationPrice, ltv } from './lib/lending.ts'

const [collateral = 10, start = 150, debt = 900] = process.argv.slice(2).map(Number)
const m = EXAMPLE_MARKET
console.log(`Example market: max LTV ${m.maxLtv * 100}%, liquidation at ${m.liqThreshold * 100}%, close factor ${m.closeFactor * 100}%, bonus ${m.liqBonus * 100}%`)
console.log(`Deposit ${collateral} SOL at $${start}, borrow ${debt} USDC. Liquidation price $${liquidationPrice({ collateral, price: start, debt }).toFixed(2)}\n`)
console.log('SOL price   LTV      health   room to borrow')
for (let price = start; price >= start * 0.6; price -= 10) {
  const p = { collateral, price, debt }
  const hf = healthFactor(p)
  console.log(`$${String(price).padEnd(10)} ${((ltv(p) * 100).toFixed(1) + "%").padEnd(8)} ${hf.toFixed(2).padEnd(8)} $${borrowRoom(p).toFixed(0)}${hf < 1 ? '   <- liquidatable' : ''}`)
  if (hf < 1) {
    const l = liquidate(p)!
    console.log(`\nLiquidator repays ${l.repaid} USDC and takes ${l.seized.toFixed(3)} SOL ($${(l.seized * price).toFixed(2)}). Profit $${l.profit.toFixed(2)} before fees.`)
    console.log(`Borrower after: ${l.after.collateral.toFixed(3)} SOL, owes ${l.after.debt} USDC, health ${healthFactor(l.after).toFixed(2)}`)
    break
  }
}
console.log('\nExercise: change the start price to a live one from `npm run w4:price` and find your own liquidation price.')
