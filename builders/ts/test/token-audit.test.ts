import assert from 'node:assert/strict'
import { test } from 'node:test'
import { auditMint, type MintFacts } from '../src/lib/token-audit.ts'

const clean: MintFacts = { program: 'SPL Token', decimals: 6, supply: 1_000_000n, mintAuthority: null, freezeAuthority: null, otherExtensions: [] }

test('revoked authorities and no extensions: no red flags', () => {
  const r = auditMint(clean)
  assert.equal(r.verdict, 'No red flags in the mint')
  assert.equal(r.flags.length, 0)
})

test('unknown issuer with both authorities: walk away', () => {
  const r = auditMint({ ...clean, mintAuthority: 'Issuer1111', freezeAuthority: 'Issuer2222' })
  assert.equal(r.verdict, 'Walk away')
  assert.equal(r.flags.filter(f => f.level === 'red').length, 2)
})

test('a known issuer (USDC) keeps both authorities: flagged, verdict names the trust', () => {
  const r = auditMint({ ...clean, mintAuthority: 'Circle1111', freezeAuthority: 'Circle2222' }, true)
  assert.equal(r.verdict, 'Issuer-controlled: only as safe as the issuer')
  assert.equal(r.flags.length, 2)
})

test('permanent delegate alone is a red flag', () => {
  const r = auditMint({ ...clean, program: 'Token-2022', permanentDelegate: 'Delegate111' })
  assert.equal(r.verdict, 'Be careful')
  assert.match(r.flags[0].text, /Permanent delegate/)
})

test('transfer hook and a big transfer fee stack up', () => {
  const r = auditMint({ ...clean, program: 'Token-2022', transferHookProgram: 'Hook111', transferFeeBps: 1000, mintAuthority: 'X' })
  assert.equal(r.verdict, 'Walk away')
  assert.equal(r.flags.length, 3)
})
