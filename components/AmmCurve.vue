<script setup lang="ts">
// Constant product pool x · y = k, live. Drag the slider to sell X into a 100 / 100 pool.
// The dot slides along the curve; the violet leg is what you pay in, the red leg is what you get out.
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{ start?: number, fee?: boolean }>(), { start: 10, fee: false })
const dx = ref(props.start)
const feeOn = ref(props.fee)

const X0 = 100, Y0 = 100, K = X0 * Y0
const W = 440, H = 300, PAD = 36
const minX = 40, maxX = 230, minY = 35, maxY = 200
const sx = (x: number) => PAD + ((x - minX) / (maxX - minX)) * (W - PAD * 1.5)
const sy = (y: number) => H - PAD - ((y - minY) / (maxY - minY)) * (H - PAD * 1.6)

const curve = computed(() => {
  const pts: string[] = []
  for (let x = K / maxY; x <= maxX; x += 2) pts.push(`${sx(x).toFixed(1)},${sy(K / x).toFixed(1)}`)
  return `M${pts.join(' L')}`
})
const dxEff = computed(() => dx.value * (feeOn.value ? 0.997 : 1))
const x1 = computed(() => X0 + dxEff.value)
const y1 = computed(() => K / x1.value)
const out = computed(() => Y0 - y1.value)
const exec = computed(() => (dx.value ? out.value / dx.value : 1))
const spotAfter = computed(() => y1.value / (X0 + dx.value))
const impact = computed(() => (dx.value ? (1 - out.value / dxEff.value) * 100 : 0))
const kAfter = computed(() => (X0 + dx.value) * y1.value)
const f = (n: number, d = 2) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
</script>

<template>
  <div class="amm widget">
    <svg :viewBox="`0 0 ${W} ${H}`" :width="W" :height="H" role="img" aria-label="Constant product curve">
      <line :x1="PAD" :y1="H - PAD" :x2="W - 10" :y2="H - PAD" class="axis" />
      <line :x1="PAD" :y1="H - PAD" :x2="PAD" :y2="10" class="axis" />
      <text :x="W - 14" :y="H - PAD + 20" class="lbl" text-anchor="end">X in the pool</text>
      <text :x="PAD + 6" :y="18" class="lbl">Y in the pool</text>
      <path :d="curve" class="curve" />
      <text :x="sx(175)" :y="sy(175)" class="lbl chainf" text-anchor="middle">x · y = {{ f(K, 0) }}</text>
      <!-- legs of the trade -->
      <line :x1="sx(X0)" :y1="sy(Y0)" :x2="sx(x1)" :y2="sy(Y0)" class="leg in" />
      <line :x1="sx(x1)" :y1="sy(Y0)" :x2="sx(x1)" :y2="sy(y1)" class="leg outl" />
      <text v-if="dx > 14" :x="(sx(X0) + sx(x1)) / 2" :y="sy(Y0) - 10" text-anchor="middle" class="lbl chainf">+{{ f(dx, 1) }} X</text>
      <text v-if="dx > 14" :x="sx(x1) + 8" :y="(sy(Y0) + sy(y1)) / 2 + 4" class="lbl lossf">−{{ f(out) }} Y</text>
      <circle :cx="sx(X0)" :cy="sy(Y0)" r="6" class="dot start" />
      <circle :cx="sx(x1)" :cy="sy(y1)" r="8" class="dot end" />
    </svg>
    <div class="side">
      <label>Sell X into the pool: <b class="readout">{{ dx }}</b></label>
      <input v-model.number="dx" type="range" min="0" max="120" step="1" aria-label="Amount of X to sell">
      <label class="feet"><input v-model="feeOn" type="checkbox"> 0.3% LP fee</label>
      <dl>
        <dt>You get</dt><dd class="readout lossf">{{ f(out) }} Y</dd>
        <dt>Your average price</dt><dd class="readout">{{ f(exec, 3) }} Y per X</dd>
        <dt>Pool price after</dt><dd class="readout">{{ f(spotAfter, 3) }}</dd>
        <dt>Price impact</dt><dd class="readout" :class="impact > 5 ? 'lossf' : ''">{{ f(impact) }}%</dd>
        <dt>k after</dt><dd class="readout" :class="kAfter > K + 0.5 ? 'gainf' : ''">{{ f(kAfter, 0) }}</dd>
      </dl>
    </div>
  </div>
</template>

<style scoped>
.amm { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 1rem; align-items: center; }
svg { display: block; }
.axis { stroke: var(--ink); stroke-width: 1.5; }
.curve { fill: none; stroke: var(--chain); stroke-width: 3; }
.leg { stroke-width: 3; stroke-dasharray: 6 4; transition: all 0.3s; }
.leg.in { stroke: var(--chain); }
.leg.outl { stroke: var(--loss); }
.dot { transition: cx 0.3s, cy 0.3s; }
.dot.start { fill: #fff; stroke: var(--ink); stroke-width: 2; }
.dot.end { fill: var(--chain); stroke: #fff; stroke-width: 2; }
.lbl { font-size: var(--fs-xs); fill: var(--ink-2); font-family: var(--font); }
.chainf { fill: var(--chain); color: var(--chain); font-weight: 700; }
.lossf { fill: var(--loss); color: var(--loss); font-weight: 700; }
.gainf { color: var(--gain); }
.side label { display: block; font-size: var(--fs-sm); }
.feet { margin-top: 0.4rem; display: flex !important; gap: 0.4rem; align-items: center; }
dl { display: grid; grid-template-columns: auto auto; gap: 0.25rem 0.8rem; margin: 0.7rem 0 0; }
dt { font-size: var(--fs-sm); color: var(--muted); }
dd { margin: 0; font-size: var(--fs-md); text-align: right; }
</style>
