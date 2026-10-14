import assert from 'node:assert/strict'
import { test } from 'node:test'
import { borrowRoom, healthFactor, liquidate, liquidationPrice, ltv } from '../src/lib/lending.ts'

const near = (a: number, b: number, eps = 1e-3) => assert.ok(Math.abs(a - b) < eps, `${a} is not within ${eps} of ${b}`)
const start = { collateral: 10, price: 150, debt: 900 }

test('the week 4 position at $150', () => {
  near(ltv(start), 0.6)
  near(healthFactor(start), 1.3333)
  near(liquidationPrice(start), 112.5)
  near(borrowRoom(start), 150)
  assert.equal(liquidate(start), null, 'a healthy position cannot be liquidated')
})

test('SOL falls to $110: liquidatable, and the liquidation matches the deck', () => {
  const crashed = { ...start, price: 110 }
  near(ltv(crashed), 0.8182)
  near(healthFactor(crashed), 0.9778)
  const l = liquidate(crashed)
  assert.ok(l)
  near(l.repaid, 450)
  near(l.seized, 4.2955)
  near(l.profit, 22.5)
  near(l.after.collateral, 5.7045)
  near(healthFactor(l.after), 1.1156)
})
