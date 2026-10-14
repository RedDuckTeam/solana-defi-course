<script setup lang="ts">
// Click-stepped replay of a flow (an exploit, a leak, a deploy).
// Nodes appear at their `at` step, edges draw themselves at theirs, and the
// edge that belongs to the current step carries a moving dot so the eye follows it.
// A node can turn red (`badAt`) or green (`goodAt`), be drawn dashed as a fake (`fake`),
// or get a rubber stamp. Captions explain the current step in one line.
import { computed, useId } from 'vue'

type Tone = 'ink' | 'chain' | 'loss' | 'gain' | 'warn' | 'muted'
interface FlowNode {
  id: string, x: number, y: number, w?: number, h?: number
  title: string, sub?: string, tone?: Tone, at?: number
  fake?: boolean, badAt?: number, goodAt?: number
  stamp?: { at: number, text: string, tone?: Tone }
}
type Side = 'l' | 'r' | 't' | 'b'
interface FlowEdge { from: string, to: string, at: number, label?: string, tone?: Tone, bend?: number, fromSide?: Side, toSide?: Side }
interface Tally { at: number, label: string, value: string, tone?: Tone }

const props = withDefaults(defineProps<{
  nodes: FlowNode[], edges: FlowEdge[], captions: string[]
  step?: number, height?: number, tally?: Tally[], tallyPos?: 'tr' | 'br' | 'bl' | 'tl'
}>(), { step: 99, height: 320, tally: () => [], tallyPos: 'tr' })

const uid = useId()
const W = 880
const s = computed(() => Math.min(props.step, props.captions.length - 1))
const byId = computed(() => Object.fromEntries(props.nodes.map(n => [n.id, { w: 150, h: 58, ...n }])))

const toneOf = (n: FlowNode) => {
  if (n.goodAt !== undefined && s.value >= n.goodAt) return 'gain'
  if (n.badAt !== undefined && s.value >= n.badAt) return 'loss'
  return n.tone ?? 'ink'
}

const anchor = (n: any, side: Side, gap = 0) => ({
  l: { x: n.x - gap, y: n.y + n.h / 2, dx: -1, dy: 0 },
  r: { x: n.x + n.w + gap, y: n.y + n.h / 2, dx: 1, dy: 0 },
  t: { x: n.x + n.w / 2, y: n.y - gap, dx: 0, dy: -1 },
  b: { x: n.x + n.w / 2, y: n.y + n.h + gap, dx: 0, dy: 1 },
}[side])

// Pick exit and entry sides automatically unless the edge names them.
const geo = (e: FlowEdge) => {
  const a = byId.value[e.from], b = byId.value[e.to]
  const dx = (b.x + b.w / 2) - (a.x + a.w / 2), dy = (b.y + b.h / 2) - (a.y + a.h / 2)
  const horiz = Math.abs(dx) * a.h > Math.abs(dy) * a.w
  const fs: Side = e.fromSide ?? (horiz ? (dx > 0 ? 'r' : 'l') : (dy > 0 ? 'b' : 't'))
  const ts: Side = e.toSide ?? (horiz ? (dx > 0 ? 'l' : 'r') : (dy > 0 ? 't' : 'b'))
  const p = anchor(a, fs), q = anchor(b, ts, 6)
  const k = Math.max(40, Math.hypot(q.x - p.x, q.y - p.y) * 0.45)
  const bend = e.bend ?? 0
  const c1 = { x: p.x + p.dx * k + (p.dy ? bend : 0), y: p.y + p.dy * k + (p.dx ? bend : 0) }
  const c2 = { x: q.x + q.dx * k + (q.dy ? bend : 0), y: q.y + q.dy * k + (q.dx ? bend : 0) }
  const d = `M${p.x},${p.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${q.x},${q.y}`
  // label at the curve midpoint (t = 0.5 of the cubic)
  const lx = (p.x + 3 * c1.x + 3 * c2.x + q.x) / 8, ly = (p.y + 3 * c1.y + 3 * c2.y + q.y) / 8 - 6
  return { d, lx, ly }
}

const tallyNow = computed(() => [...props.tally].reverse().find(t => t.at <= s.value))
const tones: Tone[] = ['ink', 'chain', 'loss', 'gain', 'warn', 'muted']
</script>

<template>
  <div class="flow">
    <svg :viewBox="`0 0 ${W} ${height}`" :style="{ height: `${height}px` }" role="img">
      <defs>
        <marker v-for="t in tones" :id="`${uid}-${t}`" :key="t" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" :class="`fill-${t}`" />
        </marker>
      </defs>

      <g v-for="(e, i) in edges" :key="`e${i}`" class="edge" :class="[`tone-${e.tone ?? 'ink'}`, { drawn: e.at <= s, live: e.at === s }]">
        <path :d="geo(e).d" pathLength="1" :marker-end="e.at <= s ? `url(#${uid}-${e.tone ?? 'ink'})` : undefined" />
        <circle v-if="e.at === s" r="5" class="dot">
          <animateMotion :path="geo(e).d" dur="1.3s" repeatCount="indefinite" />
        </circle>
        <text v-if="e.label" :x="geo(e).lx" :y="geo(e).ly" class="elabel" text-anchor="middle">{{ e.label }}</text>
      </g>

      <g v-for="n in nodes" :key="n.id" class="node" :class="[`tone-${toneOf(n)}`, { shown: (n.at ?? 0) <= s, fake: n.fake, now: n.at === s }]">
        <rect :x="byId[n.id].x" :y="byId[n.id].y" :width="byId[n.id].w" :height="byId[n.id].h" rx="9" />
        <foreignObject :x="byId[n.id].x" :y="byId[n.id].y" :width="byId[n.id].w" :height="byId[n.id].h">
          <div class="nbody">
            <b>{{ n.title }}</b>
            <span v-if="n.sub">{{ n.sub }}</span>
          </div>
        </foreignObject>
        <g v-if="n.stamp" class="stamp" :class="[`tone-${n.stamp.tone ?? 'loss'}`, { on: n.stamp.at <= s }]"
           :style="{ transformOrigin: `${byId[n.id].x + byId[n.id].w - 4}px ${byId[n.id].y - 10}px` }">
          <rect :x="byId[n.id].x + byId[n.id].w - 50" :y="byId[n.id].y - 22" width="92" height="24" rx="3" />
          <text :x="byId[n.id].x + byId[n.id].w - 4" :y="byId[n.id].y - 5" text-anchor="middle">{{ n.stamp.text }}</text>
        </g>
      </g>
    </svg>

    <Transition name="tally">
      <div v-if="tallyNow" :key="tallyNow.value" class="tally" :class="[tallyNow.tone ?? 'loss', tallyPos]">
        <span>{{ tallyNow.label }}</span><b>{{ tallyNow.value }}</b>
      </div>
    </Transition>

    <div class="caption">
      <span class="stepno">{{ s + 1 }}/{{ captions.length }}</span>
      <Transition name="cap" mode="out-in"><p :key="s">{{ captions[s] }}</p></Transition>
    </div>
  </div>
</template>

<style scoped>
.flow { position: relative; }
svg { width: 100%; display: block; overflow: visible; }
.fill-ink { fill: var(--ink); } .fill-chain { fill: var(--chain); } .fill-loss { fill: var(--loss); }
.fill-gain { fill: var(--gain); } .fill-warn { fill: var(--warn); } .fill-muted { fill: var(--muted); }

.edge path { fill: none; stroke-width: 2.2; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 0.8s ease; }
.edge.drawn path { stroke-dashoffset: 0; }
.edge.live path { stroke-width: 3; }
.edge.tone-ink path { stroke: var(--ink); } .edge.tone-chain path { stroke: var(--chain); } .edge.tone-loss path { stroke: var(--loss); }
.edge.tone-gain path { stroke: var(--gain); } .edge.tone-warn path { stroke: var(--warn); } .edge.tone-muted path { stroke: var(--muted); }
.dot { fill: var(--loss); }
.edge.tone-chain .dot { fill: var(--chain); } .edge.tone-gain .dot { fill: var(--gain); } .edge.tone-ink .dot { fill: var(--ink); }
.elabel { font-family: var(--font); font-size: var(--fs-xs); font-weight: 600; fill: var(--ink-2); paint-order: stroke; stroke: var(--paper); stroke-width: 5px; stroke-linejoin: round; opacity: 0; transition: opacity 0.4s 0.4s; }
.edge.drawn .elabel { opacity: 1; }

.node { opacity: 0; transform: translateY(10px); transition: opacity 0.45s, transform 0.45s; }
.node.shown { opacity: 1; transform: none; }
.node rect { fill: #fff; stroke-width: 2; transition: fill 0.4s, stroke 0.4s; }
.node.fake rect { stroke-dasharray: 6 4; }
.node.tone-ink rect { stroke: var(--ink); } .node.tone-muted rect { stroke: var(--muted); }
.node.tone-chain rect { stroke: var(--chain); fill: var(--chain-soft); }
.node.tone-loss rect { stroke: var(--loss); fill: var(--loss-soft); }
.node.tone-gain rect { stroke: var(--gain); fill: var(--gain-soft); }
.node.tone-warn rect { stroke: var(--warn); fill: var(--warn-soft); }
.node.now rect { stroke-width: 3.2; }
.nbody { height: 100%; display: flex; flex-direction: column; justify-content: center; padding: 0 10px; line-height: 1.2; font-family: var(--font); color: var(--ink); }
.nbody b { font-size: var(--fs-sm); font-weight: 750; font-stretch: 106%; }
.nbody span { font-size: var(--fs-2xs); color: var(--ink-2); margin-top: 2px; }

.stamp { opacity: 0; transform: scale(2.2) rotate(-14deg); transition: all 0.35s cubic-bezier(.3,1.6,.5,1); }
.stamp.on { opacity: 1; transform: scale(1) rotate(-8deg); }
.stamp rect { fill: var(--paper); stroke-width: 2.5; }
.stamp text { font-family: var(--font); font-size: var(--fs-xs); font-weight: 900; font-stretch: 125%; }
.stamp.tone-loss rect { stroke: var(--loss); } .stamp.tone-loss text { fill: var(--loss); }
.stamp.tone-gain rect { stroke: var(--gain); } .stamp.tone-gain text { fill: var(--gain); }
.stamp.tone-warn rect { stroke: var(--warn); } .stamp.tone-warn text { fill: var(--warn); }

.tally { position: absolute; text-align: right; }
.tally.tr { top: -6px; right: 0; } .tally.tl { top: -6px; left: 0; text-align: left; }
.tally.br { bottom: 4.2em; right: 0; } .tally.bl { bottom: 4.2em; left: 0; text-align: left; }
.tally span { display: block; font-size: var(--fs-xs); color: var(--muted); }
.tally b { font-size: var(--fs-2xl); font-weight: 900; font-stretch: 112%; line-height: 1; }
.tally.loss b { color: var(--loss); } .tally.gain b { color: var(--gain); } .tally.chain b { color: var(--chain); } .tally.ink b { color: var(--ink); }
.tally-enter-active { transition: all 0.4s cubic-bezier(.3,1.5,.5,1); } .tally-enter-from { opacity: 0; transform: scale(0.6); }
.tally-leave-active { display: none; }

.caption { display: flex; gap: 0.8rem; align-items: baseline; border-top: 1.5px solid var(--ink); padding-top: 0.5rem; margin-top: 0.4rem; min-height: 3.2em; }
.stepno { font-size: var(--fs-xs); font-weight: 800; color: var(--chain); white-space: nowrap; }
.caption p { margin: 0; font-size: var(--fs-md); }
.cap-enter-active, .cap-leave-active { transition: all 0.25s; }
.cap-enter-from { opacity: 0; transform: translateY(6px); } .cap-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
