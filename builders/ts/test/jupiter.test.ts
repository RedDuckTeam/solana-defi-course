import assert from 'node:assert/strict'
import { test } from 'node:test'
import { routeLegs } from '../src/lib/jupiter.ts'

test('reads a routePlan with swapInfo labels and percents', () => {
  const legs = routeLegs({ routePlan: [{ swapInfo: { label: 'HumidiFi' }, percent: 60 }, { swapInfo: { label: 'Orca' }, percent: 40 }] })
  assert.deepEqual(legs, [{ label: 'HumidiFi', percent: 60 }, { label: 'Orca', percent: 40 }])
})

test('an unknown shape gives no legs instead of crashing', () => {
  assert.deepEqual(routeLegs({ something: 'else' }), [])
  assert.deepEqual(routeLegs(null), [])
})
