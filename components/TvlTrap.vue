<script setup lang="ts">
// Why TVL alone lies. One hypothetical protocol over four months. Each click splits a
// headline number into what actually drove it: real deposits, price moves, paid incentives.
// The last click shows double counting across protocols.
import { computed } from 'vue'

const props = withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const s = computed(() => props.step)
// segments in $M: base = deposits valued at month-1 price, price = price effect, inc = farmed deposits
const months = [
  { m: 'Month 1', base: 100, price: 0, inc: 0, note: '1M SOL at $100' },
  { m: 'Month 2', base: 100, price: 50, inc: 0, note: 'SOL → $150, no new users' },
  { m: 'Month 3', base: 100, price: 50, inc: 75, note: 'rewards attract 0.5M SOL' },
  { m: 'Month 4', base: 100, price: 0, inc: 0, note: 'rewards end, SOL → $100' },
]
const scale = 0.92
const split = (i: number) => s.value >= Math.min(i, 3)
const visible = (i: number) => i < 3 || s.value >= 3
const total = (mo: typeof months[number]) => mo.base + mo.price + mo.inc
const headline = computed(() => (s.value >= 3 ? 'Back to $100M: the growth was never users.' : 'TVL up 125%! Is it working?'))
</script>

<template>
  <div class="tvl">
    <svg viewBox="0 0 560 270" class="chart" role="img" aria-label="TVL bars decomposed into deposits, price effect and incentives">
      <line x1="40" y1="250" x2="550" y2="250" class="axis" />
      <g v-for="(mo, i) in months" :key="mo.m" :transform="`translate(${70 + i * 125},0)`" class="mo" :class="{ on: visible(i) }">
        <rect x="0" :y="250 - mo.base * scale" width="80" :height="mo.base * scale" class="seg base" />
        <rect x="0" :y="250 - (mo.base + mo.price) * scale" width="80" :height="mo.price * scale" class="seg" :class="split(i) ? 'price' : 'base'" />
        <rect x="0" :y="250 - total(mo) * scale" width="80" :height="mo.inc * scale" class="seg" :class="split(i) ? 'inc' : 'base'" />
        <text x="40" :y="242 - total(mo) * scale" text-anchor="middle" class="val">${{ total(mo) }}M</text>
        <text x="40" y="266" text-anchor="middle" class="ml">{{ mo.m }}</text>
        <text x="40" :y="236 - total(mo) * scale - 16" text-anchor="middle" class="nt" :class="{ on: split(i) && i > 0 }">{{ mo.note }}</text>
      </g>
    </svg>
    <div class="side">
      <p class="head readout" :class="s >= 3 ? 'loss' : 'gain'">{{ headline }}</p>
      <ul class="key">
        <li><i class="base" />Real deposits</li>
        <li :class="{ dim: s < 1 }"><i class="price" />Price went up, not usage</li>
        <li :class="{ dim: s < 2 }"><i class="inc" />Rented by rewards</li>
      </ul>
      <div class="dc" :class="{ on: s >= 4 }">
        <b>Double counting</b>
        <div class="dcrow"><span class="chip">SOL worth $100M</span>→<span class="chip c">staked: $100M</span>→<span class="chip c">lent: $100M</span></div>
        <p>Some dashboards add both: <b class="loss">$200M</b> of "TVL" from <b>$100M</b> of SOL.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tvl { display: grid; grid-template-columns: 560px minmax(0, 1fr); gap: 1.2rem; align-items: start; }
.chart { width: 560px; height: 270px; overflow: visible; }
.axis { stroke: var(--ink); stroke-width: 1.5; }
.mo { opacity: 0; transition: opacity 0.5s; } .mo.on { opacity: 1; }
.seg { transition: fill 0.6s, y 0.6s, height 0.6s; }
.base { fill: var(--chain); } .price { fill: var(--ink-2); } .inc { fill: var(--warn); }
.val { font-family: var(--font); font-size: var(--fs-sm); font-weight: 800; fill: var(--ink); }
.ml { font-family: var(--font); font-size: var(--fs-xs); fill: var(--muted); }
.nt { font-family: var(--font); font-size: var(--fs-2xs); fill: var(--ink-2); opacity: 0; transition: opacity 0.4s 0.3s; }
.nt.on { opacity: 1; }
.head { font-size: var(--fs-lg); line-height: 1.15; margin: 0 0 0.6rem; }
.key { list-style: none; padding: 0 !important; margin: 0; }
.key li { display: flex; align-items: center; gap: 0.5rem; font-size: var(--fs-sm); transition: opacity 0.4s; margin: 0.2rem 0 !important; }
.key li.dim { opacity: 0.25; }
.key i { width: 16px; height: 16px; border-radius: 3px; display: inline-block; }
.key i.base { background: var(--chain); } .key i.price { background: var(--ink-2); } .key i.inc { background: var(--warn); }
.dc { margin-top: 0.9rem; border-top: 1.5px solid var(--ink); padding-top: 0.5rem; opacity: 0; transform: translateY(10px); transition: all 0.5s; }
.dc.on { opacity: 1; transform: none; }
.dc b { font-size: var(--fs-sm); }
.dcrow { display: flex; flex-wrap: wrap; align-items: center; gap: 0.3rem; font-size: var(--fs-xs); margin: 0.35rem 0; }
.chip { border: 1.5px solid var(--ink); border-radius: var(--r-sm); padding: 0 0.35rem; background: #fff; }
.chip.c { border-color: var(--chain); background: var(--chain-soft); }
.dc p { font-size: var(--fs-xs); margin: 0; }
</style>
