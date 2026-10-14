import { addSyncMethod } from '@slidev/client'
import { defineAppSetup } from '@slidev/types'

// Live class mode on the hosted site (Vercel).
// Mentees open  https://<site>/week-3/        and follow you automatically.
// You open      https://<site>/week-3/?key=<presenter key>#/presenter/1
// Only speaker view with the right key moves the room. A mentee can flip back
// on their own; they snap to you again on your next click.
// On hosts without /api/sync (GitHub Pages, a local build) this does nothing,
// and `slidev` dev mode already syncs through its own server.

const POLL_MS = 700

export default defineAppSetup(() => {
  if (typeof window === 'undefined' || __SLIDEV_HAS_SERVER__) return
  const room = location.pathname.split('/').filter(Boolean)[0]
  if (!room || !/^[a-z0-9-]{1,32}$/.test(room)) return

  const fromUrl = new URLSearchParams(location.search).get('key')
  try { if (fromUrl) sessionStorage.setItem(`presenter-key:${room}`, fromUrl) } catch {}
  let key = fromUrl || ''
  try { key ||= sessionStorage.getItem(`presenter-key:${room}`) || '' } catch {}
  const isPresenter = () => location.hash.startsWith('#/presenter')

  fetch(`/api/sync?room=${room}`, { cache: 'no-store' }).then((res) => {
    if (!res.ok) return
    addSyncMethod({
      init(channelKey, onUpdate, _state, persist) {
        if (persist || !channelKey.endsWith(' - shared')) return

        let version = 0
        const poll = async () => {
          if (!document.hidden && !isPresenter()) {
            try {
              const r = await fetch(`/api/sync?room=${room}`, { cache: 'no-store' })
              const data = await r.json() as { v: number, state?: object }
              if (data.v && data.v !== version && data.state) {
                version = data.v
                onUpdate(data.state as never)
              }
            }
            catch {}
          }
          setTimeout(poll, POLL_MS)
        }
        poll()

        let pending: ReturnType<typeof setTimeout> | undefined
        return (state, updating) => {
          if (updating || !key || !isPresenter()) return
          clearTimeout(pending)
          pending = setTimeout(() => {
            const s = state as { page: number, clicks: number, clicksTotal: number }
            fetch('/api/sync', {
              method: 'POST',
              headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
              body: JSON.stringify({ room, state: { page: s.page, clicks: s.clicks, clicksTotal: s.clicksTotal } }),
            }).catch(() => {})
          }, 60)
        }
      },
    })
  }).catch(() => {})
})
