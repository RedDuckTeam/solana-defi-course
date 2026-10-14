import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { parseHermes } from '../src/lib/pyth.ts'

const fixture = JSON.parse(readFileSync(new URL('./fixtures/hermes-sol.json', import.meta.url), 'utf8'))

test('price = price × 10^expo', () => {
  const p = parseHermes(fixture)
  assert.ok(Math.abs(p.price - 152.3456789) < 1e-9)
  assert.ok(Math.abs(p.confidence - 0.08123456) < 1e-9)
  assert.equal(p.publishTime.toISOString(), new Date(1792000000 * 1000).toISOString())
})

test('accepts a 0x-prefixed feed id', () => {
  assert.ok(parseHermes(fixture, '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d').price > 0)
})

test('a missing feed is an error, not a zero price', () => {
  assert.throws(() => parseHermes({ parsed: [] }), /not found/)
})

const onchain = JSON.parse(readFileSync(new URL('./fixtures/price-update-v2-sol.json', import.meta.url), 'utf8'))

test('reads the on-chain PriceUpdateV2 account (real mainnet snapshot, 14 Oct 2026)', async () => {
  const { parsePriceUpdateV2, SOL_USD_FEED, PYTH_RECEIVER_PROGRAM } = await import('../src/lib/pyth.ts')
  assert.equal(onchain.owner, PYTH_RECEIVER_PROGRAM)
  const p = parsePriceUpdateV2(Buffer.from(onchain.base64, 'base64'))
  assert.equal(p.id, SOL_USD_FEED)
  assert.ok(p.price > 1 && p.price < 10_000, `implausible SOL price ${p.price}`)
  assert.ok(p.confidence < p.price / 100, 'confidence should be a small fraction of price')
  assert.ok(p.publishTime.getUTCFullYear() === 2026)
})
