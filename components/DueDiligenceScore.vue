<script setup lang="ts">
// A due-diligence scorecard. Score each criterion 0 to 5, but a score only counts once you
// mark that you have evidence for it. The radar shows the shape; the number shows the total.
import { computed, reactive } from 'vue'

const rows = reactive([
  { k: 'Security record', w: 20, v: 3, ev: false, hint: 'Audits (who, when, scope), incidents, bug bounty size.' },
  { k: 'Admin keys and governance', w: 15, v: 2, ev: false, hint: 'Who can upgrade? Multisig size, timelock, who signs.' },
  { k: 'Revenue quality', w: 15, v: 3, ev: false, hint: 'Fees paid by users vs rewards paid in its own token.' },
  { k: 'Oracles and dependencies', w: 10, v: 3, ev: false, hint: 'Which price feeds, bridges, other protocols it relies on.' },
  { k: 'Liquidity depth', w: 10, v: 4, ev: false, hint: 'Can users exit at size without moving the price?' },
  { k: 'Token distribution', w: 10, v: 2, ev: false, hint: 'Team and investor share, unlock schedule, top holders.' },
  { k: 'Transparency and docs', w: 10, v: 4, ev: false, hint: 'Public code, clear docs, incident reports published.' },
  { k: 'Team and maintenance', w: 10, v: 3, ev: false, hint: 'Commits, releases, response to past issues.' },
])
const total = computed(() => Math.round(rows.reduce((a, r) => a + (r.ev ? r.v / 5 * r.w : 0), 0)))
const evidenced = computed(() => rows.filter(r => r.ev).length)
const band = computed(() => evidenced.value < 6 ? { t: 'Not enough evidence to judge', c: 'warn' } : total.value >= 70 ? { t: 'Strong, with named risks', c: 'gain' } : total.value >= 45 ? { t: 'Mixed: size positions small', c: 'warn' } : { t: 'Weak: avoid or keep watching', c: 'loss' })

const R = 92, C = 110
const pt = (i: number, v: number) => {
  const a = -Math.PI / 2 + i * 2 * Math.PI / rows.length
  return [C + Math.cos(a) * R * v / 5, C + Math.sin(a) * R * v / 5]
}
const poly = computed(() => rows.map((r, i) => pt(i, r.ev ? r.v : 0).join(',')).join(' '))
const claimed = computed(() => rows.map((r, i) => pt(i, r.v).join(',')).join(' '))
const ring = (v: number) => rows.map((_, i) => pt(i, v).join(',')).join(' ')
</script>

<template>
  <div class="dd widget">
    <div class="rows">
      <div class="hd"><span>Criterion</span><span>Weight</span><span>Score</span><span>Evidence</span></div>
      <div v-for="r in rows" :key="r.k" class="row" :title="r.hint">
        <span class="k">{{ r.k }}<small>{{ r.hint }}</small></span>
        <span class="w">{{ r.w }}%</span>
        <input v-model.number="r.v" type="range" min="0" max="5" :aria-label="`${r.k} score`">
        <button class="ev" :class="{ on: r.ev }" :aria-pressed="r.ev" @click="r.ev = !r.ev">{{ r.ev ? 'Have it' : 'None yet' }}</button>
      </div>
    </div>
    <div class="viz">
      <svg viewBox="0 0 220 220" role="img" aria-label="Radar chart of scores">
        <polygon v-for="v in [1, 2, 3, 4, 5]" :key="v" :points="ring(v)" class="ring" />
        <polygon :points="claimed" class="claimed" />
        <polygon :points="poly" class="real" />
      </svg>
      <p class="total readout">{{ total }}<span>/100</span></p>
      <p class="band" :class="band.c">{{ band.t }}</p>
      <p class="legend"><i class="d" />claimed <i class="s" />backed by evidence</p>
    </div>
  </div>
</template>

<style scoped>
.dd { display: grid; grid-template-columns: minmax(0, 1fr) 230px; gap: 1rem; }
.hd, .row { display: grid; grid-template-columns: minmax(0, 1fr) 3.2em 110px 5.6em; gap: 0.6rem; align-items: center; }
.hd { font-size: var(--fs-2xs); color: var(--muted); border-bottom: 1.5px solid var(--ink); padding-bottom: 0.2rem; }
.row { border-bottom: 1px solid var(--rule); padding: 0.18rem 0; }
.k { font-size: var(--fs-sm); font-weight: 650; line-height: 1.15; }
.k small { display: block; font-size: var(--fs-2xs); font-weight: 400; color: var(--muted); }
.w { font-size: var(--fs-xs); color: var(--ink-2); }
.ev { font-size: var(--fs-2xs) !important; padding: 0.2em 0.4em !important; }
.ev.on { background: var(--gain) !important; border-color: var(--gain) !important; color: #fff !important; }
.viz { text-align: center; }
svg { width: 210px; height: 210px; }
.ring { fill: none; stroke: var(--rule); }
.claimed { fill: none; stroke: var(--muted); stroke-dasharray: 4 3; transition: all 0.4s; }
.real { fill: var(--chain-soft); stroke: var(--chain); stroke-width: 2; transition: all 0.5s cubic-bezier(.3,1.3,.5,1); }
.total { font-size: var(--fs-3xl); margin: -0.2rem 0 0; line-height: 1; }
.total span { font-size: var(--fs-md); color: var(--muted); }
.band { font-size: var(--fs-sm); font-weight: 750; margin: 0.2rem 0; }
.legend { font-size: var(--fs-2xs); color: var(--muted); margin: 0; }
.legend i { display: inline-block; width: 14px; height: 0; vertical-align: middle; margin: 0 0.2rem 0 0.5rem; }
.legend i.d { border-top: 2px dashed var(--muted); } .legend i.s { border-top: 2px solid var(--chain); }
</style>
