<script setup lang="ts">
// How arbitrage holds a fiat-backed stablecoin at $1, and why it can fail.
// Move the market price. Below $1: buy on the market, redeem with the issuer. Above $1: mint, sell.
// Close redemptions (a weekend, a failed bank) and the pull back to $1 disappears.
import { computed, ref } from 'vue'

const price = ref(0.97)
const redeemOpen = ref(true)
const side = computed(() => (price.value < 0.995 ? 'below' : price.value > 1.005 ? 'above' : 'at'))
const edge = computed(() => Math.abs(1 - price.value) * 100)
const W = 300, H = 250
const py = (p: number) => 100 - (p - 1) * 900
</script>

<template>
  <div class="pa widget">
    <svg :viewBox="`0 0 ${W} ${H}`" :width="W" :height="H" role="img" :aria-label="`Market price ${price.toFixed(3)}`">
      <line x1="10" :y1="py(1)" :x2="W - 10" :y2="py(1)" class="peg" />
      <text :x="W - 10" :y="py(1) - 6" class="pl" text-anchor="end">$1.00 peg</text>
      <line :x1="W / 2" :y1="py(1)" :x2="W / 2" :y2="py(price)" class="gap" :class="side" />
      <circle :cx="W / 2" :cy="py(price)" r="12" class="dot" :class="side" />
      <text :x="W / 2 + 20" :y="py(price) + 5" class="pv">${{ price.toFixed(3) }}</text>
      <g v-if="side !== 'at' && redeemOpen" class="pull">
        <path :d="`M${W / 2 - 40},${py(price) + (side === 'below' ? 22 : -22)} L${W / 2 - 40},${py(1) + (side === 'below' ? 8 : -8)}`" marker-end="url(#pa)" />
      </g>
      <defs><marker id="pa" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--gain)" /></marker></defs>
    </svg>
    <div>
      <label>Market price <b class="readout">${{ price.toFixed(3) }}</b><input v-model.number="price" type="range" min="0.85" max="1.1" step="0.005"></label>
      <label class="tg"><input v-model="redeemOpen" type="checkbox"> Issuer is redeeming</label>
      <div class="play" :class="side">
        <template v-if="side === 'at'"><b>On the peg</b><p>No free money. Nothing to do.</p></template>
        <template v-else-if="!redeemOpen"><b class="lossc">Stuck at ${{ price.toFixed(3) }}</b><p>Redemption is closed, so nobody can turn a coin back into $1. Fear sets the price.</p></template>
        <template v-else-if="side === 'below'">
          <b>Buy at ${{ price.toFixed(3) }}, redeem for $1.00</b>
          <p>Profit {{ edge.toFixed(1) }}¢ per coin. Buying lifts the price; redeeming burns supply.</p>
        </template>
        <template v-else>
          <b>Mint at $1.00, sell at ${{ price.toFixed(3) }}</b>
          <p>Profit {{ edge.toFixed(1) }}¢ per coin. Selling pushes the price down; minting adds supply.</p>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pa { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 1.4rem; align-items: center; }
.peg { stroke: var(--ink); stroke-width: 2; stroke-dasharray: 6 4; }
.pl { font-size: var(--fs-xs); font-family: var(--font); fill: var(--ink); font-weight: 700; }
.gap { stroke-width: 4; }
.gap.below { stroke: var(--loss); } .gap.above { stroke: var(--warn); } .gap.at { stroke: var(--gain); }
.dot { transition: cy 0.2s; stroke: #fff; stroke-width: 3; }
.dot.below { fill: var(--loss); } .dot.above { fill: var(--warn); } .dot.at { fill: var(--gain); }
.pv { font-size: var(--fs-md); font-weight: 800; font-family: var(--font); fill: var(--ink); }
.pull path { stroke: var(--gain); stroke-width: 4; animation: nudge 1s ease-in-out infinite alternate; }
@keyframes nudge { from { opacity: 0.3; } to { opacity: 1; } }
label { display: block; font-size: var(--fs-sm); }
.tg { display: flex; gap: 0.4rem; align-items: center; margin: 0.6rem 0; }
.play { border-left: 5px solid var(--gain); padding: 0.5rem 0.8rem; background: var(--paper); min-height: 6.5em; }
.play b { font-size: var(--fs-md); }
.play p { font-size: var(--fs-sm); margin: 0.3rem 0 0; color: var(--ink-2); }
.lossc { color: var(--loss); }
</style>
