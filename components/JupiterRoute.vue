<script setup lang="ts">
// How an aggregator splits a swap. Drag the size: small trades take one pool,
// big trades split across pools (and sometimes hop through a third token) to cut price impact.
// The splits are illustrative, not live data.
import { computed, ref } from 'vue'

const sizes = [10, 1_000, 50_000]
const idx = ref(0)
const size = computed(() => sizes[idx.value])

type Leg = { via: string, y: number, share: number, hop?: string }
const route = computed<Leg[]>(() => {
  if (idx.value === 0) return [{ via: 'HumidiFi', y: 150, share: 100 }]
  if (idx.value === 1) return [
    { via: 'HumidiFi', y: 70, share: 55 }, { via: 'Raydium', y: 150, share: 30 }, { via: 'Orca', y: 230, share: 15 },
  ]
  return [
    { via: 'HumidiFi', y: 50, share: 35 }, { via: 'Orca', y: 120, share: 25 }, { via: 'Raydium', y: 190, share: 20 },
    { via: 'Meteora', y: 260, share: 20, hop: 'USDT' },
  ]
})
const path = (l: Leg) => `M110,150 C200,150 210,${l.y} 300,${l.y} L${l.hop ? 470 : 520},${l.y} C${l.hop ? 520 : 600},${l.y} 600,150 690,150`
</script>

<template>
  <div class="jr widget">
    <svg viewBox="0 0 800 300" role="img" :aria-label="`Route for ${size} SOL`">
      <g v-for="l in route" :key="l.via + idx">
        <path :d="path(l)" class="leg" :style="{ strokeWidth: 3 + l.share / 6 }" />
        <path :d="path(l)" class="flowp" />
        <rect x="300" :y="l.y - 17" width="140" height="34" rx="17" class="pool" />
        <text x="370" :y="l.y + 5" class="pt">{{ l.via }} · {{ l.share }}%</text>
        <template v-if="l.hop">
          <rect x="455" :y="l.y - 15" width="64" height="30" rx="15" class="hop" />
          <text x="487" :y="l.y + 5" class="ht">{{ l.hop }}</text>
        </template>
      </g>
      <circle cx="70" cy="150" r="42" class="tok sol" /><text x="70" y="157" class="tt">SOL</text>
      <circle cx="730" cy="150" r="42" class="tok usdc" /><text x="730" y="157" class="tt">USDC</text>
    </svg>
    <div class="ctl">
      <label>Swap size</label>
      <input v-model.number="idx" type="range" min="0" max="2" step="1" aria-label="Swap size" />
      <span class="readout">{{ size.toLocaleString() }} SOL</span>
      <span class="muted fs-2xs">Illustrative split. Real routes change every few seconds.</span>
    </div>
  </div>
</template>

<style scoped>
svg { width: 100%; height: auto; font-family: var(--font); }
.leg { fill: none; stroke: var(--chain-soft); stroke-linecap: round; }
.flowp { fill: none; stroke: var(--chain); stroke-width: 2.5; stroke-dasharray: 2 14; stroke-linecap: round; animation: flow 0.9s linear infinite; }
.pool { fill: #fff; stroke: var(--chain); stroke-width: 2; }
.pt { text-anchor: middle; font-size: var(--fs-sm); font-weight: 700; fill: var(--ink); }
.hop { fill: var(--paper-2); stroke: var(--ink-2); stroke-width: 1.5; }
.ht { text-anchor: middle; font-size: var(--fs-xs); font-weight: 700; fill: var(--ink-2); }
.tok { stroke-width: 3; }
.sol { fill: var(--chain); stroke: var(--chain); }
.usdc { fill: var(--ink); stroke: var(--ink); }
.tt { text-anchor: middle; font-size: var(--fs-md); font-weight: 800; fill: #fff; }
.ctl { display: grid; grid-template-columns: auto minmax(0, 220px) auto minmax(0, 1fr); gap: 0.8rem; align-items: center; }
g { animation: fadein 0.5s both; }
@keyframes flow { to { stroke-dashoffset: -32; } }
@keyframes fadein { from { opacity: 0; } }
</style>
