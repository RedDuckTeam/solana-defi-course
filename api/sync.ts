// Live class sync for the hosted decks.
// The presenter's speaker view POSTs its position (slide + click step); every
// mentee's browser polls GET and follows. Only a request carrying PRESENTER_KEY
// can move the room. State lives in Upstash Redis for six hours per deck.
import { timingSafeEqual } from 'node:crypto'

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
const KEY = process.env.PRESENTER_KEY || ''
const TTL_SECONDS = 6 * 60 * 60
const ROOM = /^[a-z0-9-]{1,32}$/

type Position = { page: number, clicks: number, clicksTotal: number, lastUpdate?: { id: string, type: 'presenter', time: number } }

async function redis(cmd: (string | number)[]) {
  if (!URL_ || !TOKEN) throw new Error('Redis is not configured')
  const res = await fetch(URL_, {
    method: 'POST',
    headers: { authorization: `Bearer ${TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify(cmd),
  })
  if (!res.ok) throw new Error(`Redis responded ${res.status}`)
  return (await res.json() as { result: unknown }).result
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
})

function isPresenter(req: Request) {
  const given = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
  if (!KEY || given.length !== KEY.length) return false
  return timingSafeEqual(Buffer.from(given), Buffer.from(KEY))
}

export async function GET(req: Request) {
  const room = new URL(req.url).searchParams.get('room') || ''
  if (!ROOM.test(room)) return json({ error: 'Unknown deck' }, 400)
  if (new URL(req.url).searchParams.has('check')) return json({ ok: isPresenter(req) }, isPresenter(req) ? 200 : 401)
  const raw = await redis(['GET', `sync:${room}`])
  return json(raw ? JSON.parse(String(raw)) : { v: 0 })
}

export async function POST(req: Request) {
  if (!isPresenter(req)) return json({ error: 'Only the presenter can move the class' }, 401)
  const body = await req.json().catch(() => null) as { room?: string, state?: Partial<Position> } | null
  const room = body?.room || ''
  const s = body?.state
  if (!ROOM.test(room) || !s) return json({ error: 'Send a deck name and a position' }, 400)
  const n = (x: unknown) => (Number.isInteger(x) && (x as number) >= 0 && (x as number) < 10_000 ? x as number : 0)
  const state: Position = {
    page: Math.max(1, n(s.page)),
    clicks: n(s.clicks),
    clicksTotal: n(s.clicksTotal),
    lastUpdate: { id: 'presenter', type: 'presenter', time: Date.now() },
  }
  const v = Date.now()
  await redis(['SET', `sync:${room}`, JSON.stringify({ v, state }), 'EX', TTL_SECONDS])
  return json({ ok: true, v })
}
