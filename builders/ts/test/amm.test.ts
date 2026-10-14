import assert from 'node:assert/strict'
import { test } from 'node:test'
import { holdVsLp, impermanentLoss, lpShare, poolAfter, priceImpact, swapOut } from '../src/lib/amm.ts'

const near = (a: number, b: number, eps = 1e-3) => assert.ok(Math.abs(a - b) < eps, `${a} is not within ${eps} of ${b}`)

test('100/100 pool: selling 10 X returns 9.0909 Y with no fee', () => {
  near(swapOut({ x: 100, y: 100 }, 10), 9.0909, 1e-4)
})

test('with a 0.3% fee the trader gets 9.066 Y and k grows', () => {
  const pool = { x: 100, y: 100 }
  near(swapOut(pool, 10, 30), 9.066)
  const after = poolAfter(pool, 10, 30)
  assert.ok(after.x * after.y > 10_000, 'k must grow when a fee is charged')
  near(after.x * after.y, 10_002.7, 0.1)
})

test('k never decreases across many random swaps with a fee', () => {
  let pool = { x: 1_000, y: 1_000 }
  for (let i = 0; i < 500; i++) {
    const k = pool.x * pool.y
    const dx = Math.random() * 200
    pool = poolAfter(pool, dx, 30)
    assert.ok(pool.x * pool.y >= k - 1e-6)
    pool = { x: pool.y, y: pool.x } // flip direction so both sides get traded
  }
})

test('bigger trades have bigger price impact', () => {
  const pool = { x: 100, y: 100 }
  assert.ok(priceImpact(pool, 30) > priceImpact(pool, 10))
  near(priceImpact(pool, 30), 0.2308, 1e-3)
})

test('lp share of a deposit at the pool ratio', () => {
  near(lpShare({ x: 100, y: 100 }, 25), 0.2)
})

test('impermanent loss matches the week 3 table', () => {
  near(impermanentLoss(1.25), -0.0062, 1e-4)
  near(impermanentLoss(2), -0.0572, 1e-4)
  near(impermanentLoss(4), -0.2, 1e-4)
  near(impermanentLoss(0.5), -0.0572, 1e-4)
})

test('hold vs LP: 5 SOL at $100, SOL doubles', () => {
  const r = holdVsLp(5, 100, 2)
  near(r.hold, 1500)
  near(r.lp, 1414.21, 0.01)
})
