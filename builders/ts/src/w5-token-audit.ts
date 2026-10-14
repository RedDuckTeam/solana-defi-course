// Week 5: audit a token's mint before you touch it. Reads SPL Token and Token-2022 mints.
// Usage: npx tsx src/w5-token-audit.ts <mint> [mainnet|devnet] [--issuer-checked]
import { address, createSolanaRpc, fetchEncodedAccount } from '@solana/kit'
import { TOKEN_2022_PROGRAM_ADDRESS, decodeMint } from '@solana-program/token-2022'
import { TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import { auditMint, type MintFacts } from './lib/token-audit.ts'

const args = process.argv.slice(2)
const mintArg = args.find(a => !a.startsWith('--') && a !== 'mainnet' && a !== 'devnet')
const cluster = args.includes('devnet') ? 'devnet' : 'mainnet'
if (!mintArg) { console.error('Usage: npx tsx src/w5-token-audit.ts <mint> [mainnet|devnet] [--issuer-checked]'); process.exit(1) }

const rpc = createSolanaRpc(cluster === 'devnet' ? 'https://api.devnet.solana.com' : 'https://api.mainnet-beta.solana.com')
const account = await fetchEncodedAccount(rpc, address(mintArg))
if (!account.exists) { console.error(`No account at ${mintArg} on ${cluster}`); process.exit(1) }
const owner = account.programAddress
if (owner !== TOKEN_PROGRAM_ADDRESS && owner !== TOKEN_2022_PROGRAM_ADDRESS) {
  console.error(`Owned by ${owner}, not a token program. This is not a token mint.`); process.exit(1)
}

// The Token-2022 decoder also reads plain SPL mints (same 82-byte base layout, no extensions).
const mint = decodeMint(account).data
const opt = <T>(o: any): T | null => (o && o.__option === 'Some' ? o.value : null)
const exts: any[] = opt<any[]>(mint.extensions) ?? []
const find = (k: string) => exts.find(e => e.__kind === k)
const fee = find('TransferFeeConfig')
const facts: MintFacts = {
  program: owner === TOKEN_PROGRAM_ADDRESS ? 'SPL Token' : 'Token-2022',
  decimals: mint.decimals,
  supply: mint.supply,
  mintAuthority: opt<string>(mint.mintAuthority),
  freezeAuthority: opt<string>(mint.freezeAuthority),
  permanentDelegate: find('PermanentDelegate')?.delegate,
  transferHookProgram: find('TransferHook')?.programId,
  transferFeeBps: fee?.newerTransferFee?.transferFeeBasisPoints,
  otherExtensions: exts.map(e => e.__kind).filter(k => !['PermanentDelegate', 'TransferHook', 'TransferFeeConfig'].includes(k)),
}
const { flags, verdict } = auditMint(facts, args.includes('--issuer-checked'))

console.log(`Mint            ${mintArg} (${cluster})`)
console.log(`Program         ${facts.program}`)
console.log(`Decimals        ${facts.decimals}`)
console.log(`Supply          ${(Number(facts.supply) / 10 ** facts.decimals).toLocaleString()}`)
console.log(`Mint authority  ${facts.mintAuthority ?? 'none (revoked)'}`)
console.log(`Freeze auth.    ${facts.freezeAuthority ?? 'none'}`)
console.log(`Extensions      ${exts.length ? exts.map(e => e.__kind).join(', ') : 'none'}`)
console.log('')
for (const f of flags) console.log(`${f.level === 'red' ? 'RED  ' : 'AMBER'} ${f.text}`)
console.log(`\nVerdict: ${verdict}`)
console.log('The mint is only part of it. Also check holder concentration, liquidity and who the team is.')
