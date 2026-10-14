<script setup lang="ts">
// Why an aggregator splits a trade. Made-up pool sizes, real constant-product math.
// step 1: all 100 SOL through the biggest pool (9.1% impact).
// step 2: the router splits 50 / 30 / 20 by depth. step 3: tokens flow, each pool only moves 4.8%.
import { computed } from 'vue'

const props = withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const pools = [
  { n: 'Pool A', depth: 1000, share: 50, y: 30 },
  { n: 'Pool B', depth: 600, share: 30, y: 110 },
  { n: 'Pool C', depth: 400, share: 20, y: 190 },
]
const impact = (sell: number, depth: number) => (sell / (depth + sell)) * 100
const split = computed(() => props.step >= 2)
</script>

<template>
  <div class="jr">
    <svg viewBox="0 0 620 250" width="620" height="250" role="img" aria-label="Trade route through three pools">
      <g v-for="(p, i) in pools" :key="p.n" :class="['pool', { dim: !split && i > 0 }]">
        <path :d="`M100,125 C180,125 180,${p.y + 20} 250,${p.y + 20}`" class="edge" :style="{ strokeWidth: split ? 2 + p.share / 6 : i === 0 ? 12 : 1 }" />
        <path :d="`M370,${p.y + 20} C440,${p.y + 20} 440,125 520,125`" class="edge" :style="{ strokeWidth: split ? 2 + p.share / 6 : i === 0 ? 12 : 1 }" />
        <rect x="250" :y="p.y" width="120" height="40" rx="6" />
        <text x="310" :y="p.y + 17" text-anchor="middle" class="pn">{{ p.n }}</text>
        <text x="310" :y="p.y + 32" text-anchor="middle" class="pd">{{ p.depth }} SOL deep</text>
        <text v-if="split" x="196" :y="p.y + 8" text-anchor="middle" class="share">{{ p.share }} SOL</text>
        <circle v-if="step >= 3" r="5" class="flow">
          <animateMotion :dur="`${1.6 + i * 0.3}s`" repeatCount="indefinite" :path="`M100,125 C180,125 180,${p.y + 20} 250,${p.y + 20} L370,${p.y + 20} C440,${p.y + 20} 440,125 520,125`" />
        </circle>
      </g>
      <g class="node"><rect x="10" y="100" width="90" height="50" rx="10" /><text x="55" y="131" text-anchor="middle">100 SOL</text></g>
      <g class="node"><rect x="520" y="100" width="90" height="50" rx="10" /><text x="565" y="131" text-anchor="middle">USDC</text></g>
    </svg>
    <div class="impacts">
      <div class="imp" :class="{ on: step >= 1 }">
        <span>All through pool A</span>
        <b class="lossf readout">{{ impact(100, 1000).toFixed(1) }}% impact</b>
        <small class="mono">100 ÷ (1000 + 100)</small>
      </div>
      <div class="imp" :class="{ on: step >= 3 }">
        <span>Split by depth</span>
        <b class="gainf readout">{{ impact(50, 1000).toFixed(1) }}% in each pool</b>
        <small class="mono">50 ÷ 1050 = 30 ÷ 630 = 20 ÷ 420</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.jr { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 1.2rem; align-items: center; }
.node rect { fill: var(--chain); }
.node text { fill: #fff; font-weight: 750; font-size: var(--fs-base); font-family: var(--font); }
.pool rect { fill: #fff; stroke: var(--ink); stroke-width: 1.5; }
.pool { transition: opacity 0.5s; }
.pool.dim { opacity: 0.18; }
.edge { fill: none; stroke: var(--chain); opacity: 0.45; transition: stroke-width 0.6s; }
.pn { font-size: var(--fs-sm); font-weight: 750; font-family: var(--font); fill: var(--ink); }
.pd { font-size: var(--fs-2xs); fill: var(--muted); font-family: var(--font); }
.share { font-size: var(--fs-xs); font-weight: 800; fill: var(--chain); font-family: var(--font); }
.flow { fill: var(--gain); }
.impacts { display: grid; gap: 1.2rem; }
.imp { opacity: 0; transition: opacity 0.4s; border-left: 4px solid var(--rule); padding-left: 0.7rem; }
.imp.on { opacity: 1; }
.imp span { display: block; font-size: var(--fs-sm); color: var(--muted); }
.imp b { display: block; font-size: var(--fs-lg); }
.imp small { font-size: var(--fs-2xs); color: var(--muted); }
.lossf { color: var(--loss); } .gainf { color: var(--gain); }
</style>
