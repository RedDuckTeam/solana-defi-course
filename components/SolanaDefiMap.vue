<script setup lang="ts">
// The Solana DeFi map, built up category by category on click.
// 1 money layer, 2 swaps, 3 Jupiter on top, 4 lending, 5 perps, 6 liquid staking, 7 oracles feeding prices.
import { computed } from 'vue'

const props = withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const s = computed(() => props.step)
const groups = [
  { k: 2, x: 20, y: 20, w: 270, h: 120, t: 'Swaps', tf: 'exchange', items: ['Raydium', 'Orca', 'Meteora', 'HumidiFi'] },
  { k: 4, x: 610, y: 20, w: 270, h: 120, t: 'Lending', tf: 'bank loan desk', items: ['Kamino Lend', 'Jupiter Lend', 'Save', 'Project 0'] },
  { k: 5, x: 610, y: 270, w: 270, h: 105, t: 'Perps', tf: 'futures desk', items: ['Drift', 'Jupiter Perps'] },
  { k: 6, x: 20, y: 270, w: 270, h: 105, t: 'Liquid staking', tf: 'deposit', items: ['Jito', 'Sanctum', 'Marinade', 'JupSOL'] },
]
</script>

<template>
  <svg viewBox="0 0 900 400" class="map" role="img" aria-label="Map of Solana DeFi by category">
    <defs>
      <marker id="sm-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--chain)" /></marker>
    </defs>

    <!-- links drawn first so boxes sit on top -->
    <g class="part" :class="{ on: s >= 3 }">
      <path d="M340,58 C300,58 300,80 292,80" class="link" marker-end="url(#sm-arr)" />
      <path d="M560,58 C600,58 600,80 608,80" class="link" marker-end="url(#sm-arr)" />
      <path d="M520,92 C560,180 600,300 608,315" class="link" marker-end="url(#sm-arr)" />
    </g>
    <g class="part" :class="{ on: s >= 7 }">
      <path d="M520,345 C580,345 560,140 650,142" class="link oracle" marker-end="url(#sm-arr)" />
      <path d="M560,355 C590,355 595,330 608,330" class="link oracle" marker-end="url(#sm-arr)" />
    </g>

    <!-- money layer in the middle -->
    <g class="part" :class="{ on: s >= 1 }">
      <rect x="330" y="150" width="240" height="105" rx="10" class="core" />
      <text x="450" y="185" class="core-t">Solana</text>
      <text x="450" y="207" class="core-s">one shared ledger · ~0.4s slots</text>
      <text x="450" y="236" class="core-m">USDC · USDT · PYUSD · USDG</text>
    </g>

    <g v-for="g in groups" :key="g.t" class="part" :class="{ on: s >= g.k }">
      <rect :x="g.x" :y="g.y" :width="g.w" :height="g.h" rx="10" class="box" />
      <text :x="g.x + 14" :y="g.y + 28" class="gt">{{ g.t }}</text>
      <text :x="g.x + g.w - 14" :y="g.y + 28" class="gtf">like a {{ g.tf }}</text>
      <g v-for="(it, i) in g.items" :key="it">
        <rect :x="g.x + 14 + (i % 2) * 124" :y="g.y + 42 + Math.floor(i / 2) * 32" width="116" height="26" rx="13" class="chip" />
        <text :x="g.x + 72 + (i % 2) * 124" :y="g.y + 60 + Math.floor(i / 2) * 32" class="ct">{{ it }}</text>
      </g>
    </g>

    <g class="part" :class="{ on: s >= 3 }">
      <rect x="340" y="25" width="220" height="68" rx="10" class="box agg" />
      <text x="450" y="54" class="gt c light">Jupiter</text>
      <text x="450" y="76" class="gtf c light">routes every swap across all DEXs</text>
    </g>

    <g class="part" :class="{ on: s >= 7 }">
      <rect x="340" y="300" width="180" height="80" rx="10" class="box" />
      <text x="354" y="328" class="gt">Oracles</text>
      <text x="354" y="352" class="ct l">Pyth · Switchboard</text>
      <text x="354" y="370" class="gtf l">prices for lenders and perps</text>
    </g>
  </svg>
</template>

<style scoped>
.map { width: 100%; height: auto; font-family: var(--font); }
.part { opacity: 0; transform: translateY(12px) scale(0.98); transform-box: fill-box; transform-origin: center; transition: all 0.5s cubic-bezier(.2,.8,.2,1); }
.part.on { opacity: 1; transform: none; }
.box { fill: #fff; stroke: var(--ink); stroke-width: 1.8; }
.box.agg { fill: var(--chain); stroke: var(--chain); }
.core { fill: var(--ink); }
.core-t { text-anchor: middle; fill: #fff; font-size: var(--fs-lg); font-weight: 850; font-stretch: 120%; }
.core-s { text-anchor: middle; fill: #c9d2e3; font-size: var(--fs-xs); }
.core-m { text-anchor: middle; fill: #fff; font-size: var(--fs-sm); font-weight: 700; }
.gt { font-size: var(--fs-md); font-weight: 800; fill: var(--ink); font-stretch: 112%; }
.gtf { font-size: var(--fs-2xs); fill: var(--muted); text-anchor: end; }
.gtf.l { text-anchor: start; }
.c { text-anchor: middle !important; }
.light { fill: #fff !important; }
.chip { fill: var(--chain-soft); }
.ct { text-anchor: middle; font-size: var(--fs-xs); font-weight: 650; fill: var(--chain); }
.ct.l { text-anchor: start; font-size: var(--fs-sm); }
.link { fill: none; stroke: var(--chain); stroke-width: 2; stroke-dasharray: 6 5; animation: dash 1.2s linear infinite; }
.link.oracle { stroke-dasharray: 2 6; }
@keyframes dash { to { stroke-dashoffset: -22; } }
</style>
