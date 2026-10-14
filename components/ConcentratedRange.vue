<script setup lang="ts">
// Concentrated liquidity (Orca Whirlpools, Raydium CLMM). Pick a price range, then move SOL's price.
// In range: your liquidity is deeper than a full-range LP's and earns fees.
// Out of range: you hold only one asset and earn nothing.
import { computed, ref } from 'vue'

const price = ref(150)
const lo = ref(120)
const hi = ref(185)
const W = 840, H = 170, P = 20
const pmin = 50, pmax = 260
const sx = (p: number) => P + ((p - pmin) / (pmax - pmin)) * (W - 2 * P)

const a = computed(() => Math.min(lo.value, hi.value - 5))
const b = computed(() => Math.max(hi.value, lo.value + 5))
const state = computed(() => (price.value < a.value ? 'below' : price.value > b.value ? 'above' : 'in'))
const boost = computed(() => {
  const p = price.value, sp = Math.sqrt(p)
  if (state.value !== 'in') return 0
  return (2 * sp) / (2 * sp - p / Math.sqrt(b.value) - Math.sqrt(a.value))
})
const solShare = computed(() => {
  if (state.value === 'below') return 100
  if (state.value === 'above') return 0
  const p = price.value, sp = Math.sqrt(p)
  const x = 1 / sp - 1 / Math.sqrt(b.value)
  const y = sp - Math.sqrt(a.value)
  return ((p * x) / (p * x + y)) * 100
})
const barH = computed(() => Math.min(120, 12 * Math.max(boost.value, 1)))
</script>

<template>
  <div class="cl widget">
    <svg :viewBox="`0 0 ${W} ${H}`" :width="W" :height="H" role="img" aria-label="Liquidity range on a price axis">
      <rect :x="P" :y="H - 34 - 10" :width="W - 2 * P" height="10" class="full" />
      <text :x="P" :y="H - 48" class="lbl">full-range LP, same dollars</text>
      <rect
        :x="sx(a)" :y="H - 34 - barH" :width="sx(b) - sx(a)" :height="barH"
        class="range" :class="state"
      />
      <line :x1="P" :y1="H - 34" :x2="W - P" :y2="H - 34" class="axis" />
      <text v-for="t in [50, 100, 150, 200, 250]" :key="t" :x="sx(t)" :y="H - 16" class="lbl" text-anchor="middle">${{ t }}</text>
      <line :x1="sx(price)" y1="4" :x2="sx(price)" :y2="H - 34" class="now" />
      <text :x="sx(price) + 6" y="6" class="nowl">SOL ${{ price }}</text>
    </svg>
    <div class="ctrl">
      <label>SOL price<input v-model.number="price" type="range" :min="pmin" :max="pmax - 10"></label>
      <label>Range low ${{ a }}<input v-model.number="lo" type="range" :min="pmin" :max="pmax - 15"></label>
      <label>Range high ${{ b }}<input v-model.number="hi" type="range" :min="pmin + 10" :max="pmax"></label>
    </div>
    <div class="out">
      <div><span>Status</span><b :class="state === 'in' ? 'gainf' : 'lossf'">{{ state === 'in' ? 'In range, earning fees' : 'Out of range, earning nothing' }}</b></div>
      <div><span>Depth vs full range</span><b class="readout">{{ state === 'in' ? boost.toFixed(1) + '×' : '0×' }}</b></div>
      <div><span>You hold</span><b class="readout">{{ solShare.toFixed(0) }}% SOL · {{ (100 - solShare).toFixed(0) }}% USDC</b></div>
    </div>
  </div>
</template>

<style scoped>
.cl { display: grid; grid-template-columns: minmax(0, 1fr); gap: 0.4rem; }
svg { width: 100%; height: auto; }
.axis { stroke: var(--ink); stroke-width: 1.5; }
.full { fill: var(--paper-2); stroke: var(--rule); }
.range { transition: all 0.25s; }
.range.in { fill: var(--chain); opacity: 0.85; }
.range.below, .range.above { fill: var(--muted); opacity: 0.35; }
.now { stroke: var(--loss); stroke-width: 2.5; }
.nowl { font-size: var(--fs-xs); fill: var(--loss); font-weight: 700; paint-order: stroke; stroke: #fff; stroke-width: 4px; font-family: var(--font); dominant-baseline: hanging; }
.lbl { font-size: var(--fs-2xs); fill: var(--muted); font-family: var(--font); }
.ctrl { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.ctrl label { font-size: var(--fs-xs); }
.out { display: grid; grid-template-columns: 1.4fr 1fr 1.2fr; gap: 1rem; border-top: 1px solid var(--rule); padding-top: 0.4rem; }
.out span { display: block; font-size: var(--fs-2xs); color: var(--muted); }
.out b { font-size: var(--fs-base); }
.gainf { color: var(--gain); } .lossf { color: var(--loss); }
</style>
