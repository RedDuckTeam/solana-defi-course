<script setup lang="ts">
// The handbook's liquidation, replayed one click at a time. Example market:
// liquidation threshold 80%, close factor 50%, liquidation bonus 5% (illustrative numbers).
// steps: 1 $150 healthy, 2 $130, 3 $112.50 on the line, 4 $110 underwater,
// 5 liquidator repays 450 USDC, 6 seizes $472.50 of SOL, 7 position after.
import { computed } from 'vue'

const props = withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const frames = [
  { p: 150, sol: 10, debt: 900 },
  { p: 150, sol: 10, debt: 900 },
  { p: 130, sol: 10, debt: 900 },
  { p: 112.5, sol: 10, debt: 900 },
  { p: 110, sol: 10, debt: 900 },
  { p: 110, sol: 10, debt: 450 },
  { p: 110, sol: 5.705, debt: 450 },
  { p: 110, sol: 5.705, debt: 450 },
]
const f = computed(() => frames[Math.min(props.step, 7)])
const coll = computed(() => f.value.sol * f.value.p)
const ltv = computed(() => (f.value.debt / coll.value) * 100)
const hf = computed(() => (coll.value * 0.8) / f.value.debt)
const tone = computed(() => (hf.value < 1 ? 'loss' : hf.value < 1.2 ? 'warn' : 'gain'))
// price chart points for the drop
const prices = [150, 150, 130, 112.5, 110]
const px = (i: number) => 20 + i * 70
const py = (p: number) => 20 + ((160 - p) / 60) * 140
const shown = computed(() => prices.slice(0, Math.min(props.step, 4) + 1))
</script>

<template>
  <div class="lr">
    <div class="chart">
      <svg viewBox="0 0 320 190" width="320" height="190" role="img" aria-label="SOL price falling">
        <line x1="10" :y1="py(112.5)" x2="310" :y2="py(112.5)" class="lt" />
        <text x="14" :y="py(112.5) + 18" class="tl">liquidation price $112.50</text>
        <polyline :points="shown.map((p, i) => `${px(i)},${py(p)}`).join(' ')" class="pl" />
        <circle v-for="(p, i) in shown" :key="i" :cx="px(i)" :cy="py(p)" r="5" :class="p < 112.5 ? 'dl' : 'dg'" />
        <text :x="px(shown.length - 1)" :y="py(shown[shown.length - 1]) + 24" class="pt" text-anchor="middle">${{ shown[shown.length - 1] }}</text>
      </svg>
      <div class="pos">
        <div><small>Collateral</small><b>{{ f.sol.toFixed(f.sol % 1 ? 3 : 0) }} SOL = ${{ coll.toFixed(2) }}</b></div>
        <div><small>Debt</small><b>${{ f.debt }}</b></div>
        <div><small>LTV</small><b>{{ ltv.toFixed(1) }}%</b></div>
        <div><small>Health</small><b :class="tone">{{ hf.toFixed(2) }}</b></div>
      </div>
    </div>
    <div class="liqside">
      <div class="bot" :class="{ on: step >= 4, act: step >= 5 }">
        <b>Liquidator bot</b>
        <p v-if="step < 5">Health below 1.00. Position is open for liquidation.</p>
        <template v-else>
          <p :class="{ on: step >= 5 }" class="ln">Repays <b>450 USDC</b> of debt (50% close factor)</p>
          <p :class="{ on: step >= 6 }" class="ln">Takes $450 + 5% bonus = <b>$472.50 of SOL</b> = 4.295 SOL</p>
          <p :class="{ on: step >= 6 }" class="ln profit">Profit: <b>$22.50</b>, before fees</p>
        </template>
      </div>
      <div class="after" :class="{ on: step >= 7 }">
        <b>Borrower after</b>
        <p>Lost 4.295 SOL. Still owes $450. Health back above 1, at <span class="warn">1.12</span>.</p>
        <p class="muted">The 5% bonus is the penalty they paid.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lr { display: grid; grid-template-columns: 340px minmax(0, 1fr); gap: 1.6rem; }
.lt { stroke: var(--loss); stroke-dasharray: 5 4; stroke-width: 1.5; }
.tl { font-size: var(--fs-2xs); fill: var(--loss); font-family: var(--font); font-weight: 700; }
.pl { fill: none; stroke: var(--ink); stroke-width: 3; }
.dg { fill: var(--ink); } .dl { fill: var(--loss); }
.pt { font-size: var(--fs-sm); font-weight: 800; fill: var(--ink); font-family: var(--font); }
.pos { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.4rem 1rem; border-top: 2px solid var(--ink); padding-top: 0.4rem; }
.pos > div:first-child { grid-column: 1 / -1; }
.pos small { display: block; font-size: var(--fs-2xs); color: var(--muted); }
.pos b { font-size: var(--fs-base); font-variant-numeric: tabular-nums; }
.liqside { display: grid; gap: 0.8rem; align-content: start; }
.bot, .after { border: 2px solid var(--rule); border-radius: var(--r-md); padding: 0.7rem 0.9rem; background: #fff; opacity: 0.15; transition: all 0.5s; }
.bot.on { opacity: 1; border-color: var(--loss); }
.bot.act { background: var(--loss-soft); }
.after.on { opacity: 1; border-color: var(--ink); }
.bot > b, .after > b { font-size: var(--fs-md); }
p { font-size: var(--fs-sm); margin: 0.3rem 0 0; }
.ln { opacity: 0; transform: translateX(-10px); transition: all 0.4s; }
.ln.on { opacity: 1; transform: none; }
.profit b { color: var(--gain); }
.loss { color: var(--loss); } .warn { color: var(--warn); } .gain { color: var(--gain); }
.muted { color: var(--muted); }
</style>
