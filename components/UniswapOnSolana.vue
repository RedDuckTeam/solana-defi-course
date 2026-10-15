<script setup lang="ts">
// "Uniswap on Solana" is a front end, not Uniswap's pools.
// 1 on Ethereum: the Uniswap app sends your swap to Uniswap's own pools.
// 2 on Solana: the same app hands the swap to Jupiter's API.
// 3 Jupiter fills it from Solana pools. 4 the lesson: the app and the protocol are different layers.
import { computed } from 'vue'

const props = withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const s = computed(() => props.step)
const venues = ['Raydium', 'Orca', 'Meteora', 'Prop AMMs']
</script>

<template>
  <svg viewBox="0 0 900 360" class="uos" role="img" aria-label="The Uniswap app routes Solana swaps through Jupiter to Solana pools">
    <defs>
      <marker id="uo-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--ink)" /></marker>
      <marker id="uo-c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--chain)" /></marker>
    </defs>

    <!-- the app, shared by both lanes -->
    <g class="p" :class="{ on: s >= 1 }">
      <rect x="20" y="130" width="190" height="100" rx="12" class="app" />
      <text x="115" y="170" class="t w">Uniswap app</text>
      <text x="115" y="194" class="m w">the website you click</text>
      <text x="115" y="214" class="m w">(a front end)</text>
    </g>

    <!-- Ethereum lane -->
    <g class="p" :class="{ on: s >= 1 }" style="color: var(--ink)">
      <text x="300" y="40" class="lane">On Ethereum</text>
      <path d="M210,155 C260,155 260,75 330,75" class="ln" marker-end="url(#uo-a)" />
      <rect x="335" y="50" width="250" height="52" rx="10" class="pool" />
      <text x="460" y="82" class="t">Uniswap's own pools</text>
      <text x="610" y="82" class="m l">v2 · v3 · v4 contracts</text>
    </g>

    <!-- Solana lane -->
    <g class="p" :class="{ on: s >= 2 }" style="color: var(--chain)">
      <text x="300" y="196" class="lane">On Solana (since Oct 2025)</text>
      <path d="M210,205 C260,205 260,245 330,245" class="ln flow" marker-end="url(#uo-c)" />
      <rect x="335" y="220" width="190" height="52" rx="10" class="jup" />
      <text x="430" y="251" class="t w">Jupiter API</text>
    </g>
    <g v-for="(v, i) in venues" :key="v" class="p" :class="{ on: s >= 3 }" :style="{ transitionDelay: `${i * 90}ms`, color: 'var(--chain)' }">
      <path :d="`M525,246 C580,246 590,${210 + i * 40} 640,${210 + i * 40}`" class="ln flow" marker-end="url(#uo-c)" />
      <rect x="645" :y="192 + i * 40" width="150" height="34" rx="17" class="venue" />
      <text x="720" :y="214 + i * 40" class="v">{{ v }}</text>
    </g>

    <g class="p" :class="{ on: s >= 4 }">
      <rect x="20" y="300" width="560" height="48" rx="8" class="lesson" />
      <text x="40" y="330" class="les">Same app, different engine. No Uniswap pools on Solana.</text>
    </g>
  </svg>
</template>

<style scoped>
.uos { width: 100%; height: auto; font-family: var(--font); }
.p { opacity: 0; transform: translateY(10px); transition: all 0.5s cubic-bezier(.2,.8,.2,1); }
.p.on { opacity: 1; transform: none; }
.app { fill: var(--ink); }
.pool { fill: #fff; stroke: var(--ink); stroke-width: 2; }
.jup { fill: var(--chain); }
.venue { fill: var(--chain-soft); stroke: var(--chain); stroke-width: 1.5; }
.lesson { fill: var(--warn-soft); stroke: var(--warn); stroke-width: 1.5; }
.lane { font-size: var(--fs-md); font-weight: 800; fill: currentColor; font-stretch: 112%; }
.t { text-anchor: middle; font-size: var(--fs-base); font-weight: 800; fill: var(--ink); }
.m { text-anchor: middle; font-size: var(--fs-xs); fill: var(--ink-2); }
.m.l { text-anchor: start; }
.w { fill: #fff !important; }
.v { text-anchor: middle; font-size: var(--fs-sm); font-weight: 700; fill: var(--chain); }
.les { font-size: var(--fs-base); font-weight: 700; fill: var(--warn); }
.ln { fill: none; stroke: currentColor; stroke-width: 2.2; }
.ln.flow { stroke-dasharray: 7 6; animation: dash 0.9s linear infinite; }
@keyframes dash { to { stroke-dashoffset: -26; } }
</style>
