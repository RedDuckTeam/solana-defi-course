<script setup lang="ts">
// Kinked interest-rate model. Example parameters, not a real market:
// 0% base, borrow rate rises to 4% at 80% utilization (the kink), then steeply to 64% at 100%.
// Lenders earn: borrow rate × utilization × (1 − 10% reserve factor).
import { computed, ref } from 'vue'

const u = ref(60)
const KINK = 80, R_KINK = 4, R_MAX = 64, RESERVE = 0.1
const borrowRate = (x: number) => (x <= KINK ? (x / KINK) * R_KINK : R_KINK + ((x - KINK) / (100 - KINK)) * (R_MAX - R_KINK))
const br = computed(() => borrowRate(u.value))
const sr = computed(() => br.value * (u.value / 100) * (1 - RESERVE))

const W = 420, H = 230, P = 40
const sx = (x: number) => P + (x / 100) * (W - P - 14)
const sy = (r: number) => H - 30 - (r / 70) * (H - 50)
const line = (fn: (x: number) => number) => {
  const pts: string[] = []
  for (let x = 0; x <= 100; x += 1) pts.push(`${sx(x).toFixed(1)},${sy(fn(x)).toFixed(1)}`)
  return `M${pts.join(' L')}`
}
const bPath = line(borrowRate)
const sPath = line((x) => borrowRate(x) * (x / 100) * (1 - RESERVE))
</script>

<template>
  <div class="uk widget">
    <svg :viewBox="`0 0 ${W} ${H}`" :width="W" :height="H" role="img" aria-label="Interest rate versus utilization">
      <rect :x="sx(KINK)" y="10" :width="sx(100) - sx(KINK)" :height="H - 40" class="zone" />
      <text :x="sx(90)" y="26" class="z" text-anchor="middle">danger zone</text>
      <line :x1="P" :y1="H - 30" :x2="W - 10" :y2="H - 30" class="axis" />
      <line :x1="P" y1="10" :x2="P" :y2="H - 30" class="axis" />
      <text v-for="t in [0, 20, 40, 60, 80, 100]" :key="t" :x="sx(t)" :y="H - 12" class="lbl" text-anchor="middle">{{ t }}%</text>
      <text v-for="r in [0, 20, 40, 60]" :key="'r' + r" :x="P - 6" :y="sy(r) + 4" class="lbl" text-anchor="end">{{ r }}%</text>
      <path :d="bPath" class="borrow" />
      <path :d="sPath" class="supply" />
      <line :x1="sx(u)" y1="10" :x2="sx(u)" :y2="H - 30" class="now" />
      <circle :cx="sx(u)" :cy="sy(br)" r="6" class="db" />
      <circle :cx="sx(u)" :cy="sy(sr)" r="6" class="ds" />
      <text :x="sx(KINK) - 4" :y="sy(R_KINK) - 10" class="k" text-anchor="end">kink</text>
    </svg>
    <div>
      <label>Utilization <b class="readout">{{ u }}%</b><input v-model.number="u" type="range" min="0" max="100"></label>
      <p class="fx mono">utilization = borrowed ÷ supplied</p>
      <div class="r"><span class="sw borrowc" />Borrowers pay <b class="readout lossc">{{ br.toFixed(1) }}%</b></div>
      <div class="r"><span class="sw supplyc" />Lenders earn <b class="readout gainc">{{ sr.toFixed(1) }}%</b></div>
      <p class="hint" :class="{ hot: u > KINK }">{{ u > KINK ? 'Rates spike to pull in lenders and push out borrowers. Withdrawals may have to wait.' : 'Plenty of cash in the pool. Rates stay low.' }}</p>
    </div>
  </div>
</template>

<style scoped>
.uk { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 1.4rem; align-items: center; }
.zone { fill: var(--loss-soft); }
.z { font-size: var(--fs-2xs); fill: var(--loss); font-family: var(--font); font-weight: 700; }
.axis { stroke: var(--ink); stroke-width: 1.5; }
.lbl { font-size: var(--fs-2xs); fill: var(--muted); font-family: var(--font); }
.borrow { fill: none; stroke: var(--loss); stroke-width: 3; }
.supply { fill: none; stroke: var(--gain); stroke-width: 3; }
.now { stroke: var(--ink); stroke-dasharray: 4 3; }
.db { fill: var(--loss); stroke: #fff; stroke-width: 2; }
.ds { fill: var(--gain); stroke: #fff; stroke-width: 2; }
.k { font-size: var(--fs-xs); font-family: var(--font); font-weight: 700; fill: var(--ink); }
label { font-size: var(--fs-sm); }
.fx { font-size: var(--fs-xs); color: var(--muted); margin: 0.2rem 0 0.8rem; }
.r { display: flex; align-items: center; gap: 0.5rem; font-size: var(--fs-base); margin: 0.3rem 0; }
.r b { font-size: var(--fs-xl); margin-left: auto; }
.sw { width: 18px; height: 4px; }
.borrowc { background: var(--loss); } .supplyc { background: var(--gain); }
.lossc { color: var(--loss); } .gainc { color: var(--gain); }
.hint { font-size: var(--fs-sm); color: var(--ink-2); margin-top: 0.6rem; min-height: 3em; }
.hint.hot { color: var(--loss); font-weight: 650; }
</style>
