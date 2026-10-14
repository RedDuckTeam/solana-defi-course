// Token red-flag rules (week 5), kept separate from RPC calls so they can be tested offline.

export type MintFacts = {
  program: 'SPL Token' | 'Token-2022'
  decimals: number
  supply: bigint
  mintAuthority: string | null
  freezeAuthority: string | null
  permanentDelegate?: string
  transferHookProgram?: string
  transferFeeBps?: number
  otherExtensions: string[]
}

export type Flag = { level: 'red' | 'amber', text: string }

export type Verdict = 'Walk away' | 'Be careful' | 'No red flags in the mint' | 'Issuer-controlled: only as safe as the issuer'

/**
 * `issuerKnown`: you checked the issuer's own docs and the mint address matches (for example Circle for USDC).
 * Then active authorities are expected, and the verdict says who you are trusting instead of "walk away".
 */
export function auditMint(f: MintFacts, issuerKnown = false): { flags: Flag[], verdict: Verdict } {
  const flags: Flag[] = []
  if (f.mintAuthority) flags.push({ level: 'red', text: `Mint authority active (${f.mintAuthority}): more can be printed.` })
  if (f.freezeAuthority) flags.push({ level: 'red', text: `Freeze authority active (${f.freezeAuthority}): your token account can be frozen.` })
  if (f.permanentDelegate) flags.push({ level: 'red', text: `Permanent delegate (${f.permanentDelegate}) can move or burn anyone's balance.` })
  if (f.transferHookProgram) flags.push({ level: 'amber', text: `Transfer hook calls ${f.transferHookProgram} on every transfer. It could block sells.` })
  if (f.transferFeeBps && f.transferFeeBps > 0) flags.push({ level: f.transferFeeBps >= 500 ? 'red' : 'amber', text: `Transfer fee ${f.transferFeeBps / 100}% on every transfer.` })
  const reds = flags.filter(x => x.level === 'red').length
  const verdict: Verdict = !flags.length ? 'No red flags in the mint'
    : issuerKnown ? 'Issuer-controlled: only as safe as the issuer'
    : reds >= 2 ? 'Walk away' : 'Be careful'
  return { flags, verdict }
}
