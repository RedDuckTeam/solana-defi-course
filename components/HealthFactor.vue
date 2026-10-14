<script setup lang="ts">
// Live lending position. Example market: max LTV 70%, liquidation threshold 80%.
// Move SOL's price or the loan size and watch the health factor needle.
import { computed, ref } from 'vue'

const sol = ref(10)
const price = ref(150)
const debt = ref(900)
const MAX_LTV = 0.7, LT = 0.8

const coll = computed(() => sol.value * price.value)
const ltv = computed(() => (coll.value ? debt.value / coll.value : 0))
const hf = computed(() => (debt.value ? (coll.value * LT) / debt.value : Infinity))
const liqPrice = computed(() => (sol.value ? debt.value / (sol.value * LT) : 0))
const canBorrowMore = computed(() => Math.max(0, coll.value * MAX_LTV - debt.value))
const status = computed(() => (hf.value < 1 ? 'liq' : hf.value < 1.15 ? 'danger' : hf.value < 1.25 ? 'watch' : 'safe'))
const label = { liq: 'Liquidatable', danger: 'One bad candle away', watch: 'Watch it', safe: 'Healthy' }

// gauge: HF 0.5 .. 2.5 across a half circle
const clamp = (v: number) => Math.min(2.5, Math.max(0.5, v))
const angle = computed(() => Math.PI * (1 - (clamp(hf.value) - 0.5) / 2))
const R = 110, CX = 140, CY = 130
const pt = (a: number, r = R) => `${CX + r * Math.cos(a)},${CY - r * Math.sin(a)}`
const arc = (h1: number, h2: number) => {
  const a1 = Math.PI * (1 - (h1 - 0.5) / 2), a2 = Math.PI * (1 - (h2 - 0.5) / 2)
  return `M${pt(a1)} A${R},${R} 0 0 1 ${pt(a2)}`
}
const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`
</script>

<template>
  <div class="hf widget">
    <div class="gauge">
      <svg viewBox="0 0 280 160" width="280" height="160" role="img" :aria-label="`Health factor ${hf.toFixed(2)}`">
        <path :d="arc(0.5, 1)" class="seg loss" />
        <path :d="arc(1, 1.25)" class="seg warn" />
        <path :d="arc(1.25, 2.5)" class="seg gain" />
        <line :x1="CX" :y1="CY" :x2="CX + 92 * Math.cos(angle)" :y2="CY - 92 * Math.sin(angle)" class="needle" />
        <circle :cx="CX" :cy="CY" r="7" class="hub" />
        <text :x="CX + (R + 14) * Math.cos(Math.PI * 0.75)" :y="CY - (R + 14) * Math.sin(Math.PI * 0.75)" class="t" text-anchor="middle">1.0</text>
      </svg>
      <p class="val readout" :class="status">{{ isFinite(hf) ? hf.toFixed(2) : '∞' }}</p>
      <p class="st" :class="status">{{ label[status] }}</p>
    </div>
    <div class="ctl">
      <label>SOL price <b class="readout">${{ price }}</b><input v-model.number="price" type="range" min="50" max="250"></label>
      <label>USDC borrowed <b class="readout">{{ usd(debt) }}</b><input v-model.number="debt" type="range" min="0" max="1400" step="10"></label>
      <dl>
        <dt>Collateral</dt><dd>{{ sol }} SOL = {{ usd(coll) }}</dd>
        <dt>LTV</dt><dd :class="ltv > LT ? 'liq' : ltv > MAX_LTV ? 'danger' : ''">{{ (ltv * 100).toFixed(1) }}%</dd>
        <dt>Liquidation price</dt><dd class="liq">${{ liqPrice.toFixed(2) }}</dd>
        <dt>Can still borrow</dt><dd>{{ usd(canBorrowMore) }}</dd>
      </dl>
      <p class="fx mono">HF = collateral × 0.80 ÷ debt</p>
    </div>
  </div>
</template>

<style scoped>
.hf { display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 1.6rem; align-items: center; }
.gauge { text-align: center; }
.seg { fill: none; stroke-width: 22; }
.seg.loss { stroke: var(--loss); } .seg.warn { stroke: var(--warn); } .seg.gain { stroke: var(--gain); }
.needle { stroke: var(--ink); stroke-width: 4; stroke-linecap: round; transition: all 0.3s; }
.hub { fill: var(--ink); }
.t { font-size: var(--fs-xs); font-family: var(--font); font-weight: 700; fill: var(--ink-2); }
.val { font-size: var(--fs-3xl); margin: -0.4rem 0 0; line-height: 1; }
.st { font-size: var(--fs-base); font-weight: 750; margin: 0.2rem 0 0; }
.liq { color: var(--loss); } .danger { color: var(--warn); } .watch { color: var(--warn); } .safe { color: var(--gain); }
.ctl label { display: block; font-size: var(--fs-sm); margin-bottom: 0.5rem; }
dl { display: grid; grid-template-columns: auto auto; gap: 0.2rem 1rem; margin: 0.4rem 0; }
dt { font-size: var(--fs-sm); color: var(--muted); }
dd { margin: 0; text-align: right; font-size: var(--fs-md); font-weight: 700; font-variant-numeric: tabular-nums; }
.fx { font-size: var(--fs-xs); color: var(--muted); margin: 0.3rem 0 0; }
</style>
