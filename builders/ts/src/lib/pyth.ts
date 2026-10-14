// Parsing a Pyth Hermes price response (week 4).
// Hermes returns integers plus an exponent: real price = price * 10^expo.

export const SOL_USD_FEED = 'ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d'
// Since 26 Aug 2026 Hermes needs a Pyth API key (Authorization: Bearer). Pyth's recommended base URL is below;
// hermes.pyth.network also works with a key. Get one at pythdata.app/signup (free trial).
export const HERMES = process.env.PYTH_HERMES_URL ?? 'https://pyth.dourolabs.app/hermes'

export type ParsedPrice = { id: string, price: number, confidence: number, publishTime: Date }

export function parseHermes(json: unknown, feedId = SOL_USD_FEED): ParsedPrice {
  const parsed = (json as { parsed?: Array<{ id: string, price: { price: string, conf: string, expo: number, publish_time: number } }> })?.parsed
  const entry = parsed?.find(p => p.id.replace(/^0x/, '') === feedId.replace(/^0x/, ''))
  if (!entry) throw new Error(`Feed ${feedId} not found in the Hermes response`)
  const scale = 10 ** entry.price.expo
  return {
    id: entry.id,
    price: Number(entry.price.price) * scale,
    confidence: Number(entry.price.conf) * scale,
    publishTime: new Date(entry.price.publish_time * 1000),
  }
}

// On-chain route, no API key: Pyth's sponsored SOL/USD price feed account on Solana mainnet.
// Owned by the Pyth Receiver program. Layout (PriceUpdateV2, Anchor account):
// 8 discriminator | 32 write authority | verification level (1 byte enum, +1 byte if Partial)
// | 32 feed id | i64 price | u64 conf | i32 expo | i64 publish time | ...
export const SOL_USD_PRICE_ACCOUNT = '7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE'
export const PYTH_RECEIVER_PROGRAM = 'rec5EKMGg6MxZYaMdyBfgwp4d5rB9T1VQH5pJv5LtFJ'

export function parsePriceUpdateV2(data: Uint8Array): ParsedPrice & { verification: 'Full' | 'Partial' } {
  const v = new DataView(data.buffer, data.byteOffset, data.byteLength)
  let o = 8 + 32
  const level = data[o]
  o += level === 0 ? 2 : 1 // 0 = Partial { num_signatures: u8 }, 1 = Full
  const id = Array.from(data.subarray(o, o + 32), b => b.toString(16).padStart(2, '0')).join('')
  o += 32
  const price = v.getBigInt64(o, true); o += 8
  const conf = v.getBigUint64(o, true); o += 8
  const expo = v.getInt32(o, true); o += 4
  const publish = v.getBigInt64(o, true)
  const scale = 10 ** expo
  return {
    id,
    price: Number(price) * scale,
    confidence: Number(conf) * scale,
    publishTime: new Date(Number(publish) * 1000),
    verification: level === 0 ? 'Partial' : 'Full',
  }
}
