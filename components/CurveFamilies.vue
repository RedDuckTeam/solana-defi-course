<script setup lang="ts">
// Four ways Solana DEXs hold liquidity, one per click. Each mini chart shows
// where the liquidity sits across prices (x axis = price, height = depth).
withDefaults(defineProps<{ step?: number }>(), { step: 99 })

const fams = [
  { k: 'cpmm', n: 'Constant product', ex: 'Raydium CPMM', l: 'Spread over every price, zero to infinity. Simple, thin.' },
  { k: 'clmm', n: 'Concentrated', ex: 'Orca Whirlpools, Raydium CLMM', l: 'LPs pick ranges. Depth piles up near the price.' },
  { k: 'dlmm', n: 'Bins', ex: 'Meteora DLMM', l: 'Fixed-price buckets. No slippage inside a bin.' },
  { k: 'prop', n: 'Prop AMM', ex: 'HumidiFi and others', l: 'A market maker quotes its own prices on-chain, updated every slot.' },
]
const clmm = [2, 3, 5, 9, 16, 26, 34, 30, 20, 12, 6, 3, 2]
const bins = [4, 7, 11, 16, 22, 30, 22, 16, 11, 7, 4]
</script>

<template>
  <div class="fams">
    <div v-for="(f, i) in fams" :key="f.k" class="fam" :class="{ on: step >= i + 1, cur: step === i + 1 }">
      <svg viewBox="0 0 180 90" width="180" height="90" aria-hidden="true">
        <line x1="4" y1="84" x2="176" y2="84" class="axis" />
        <line x1="90" y1="6" x2="90" y2="84" class="price" />
        <template v-if="f.k === 'cpmm'">
          <rect x="4" y="70" width="172" height="14" class="liq" />
        </template>
        <template v-else-if="f.k === 'clmm'">
          <rect v-for="(h, j) in clmm" :key="j" :x="6 + j * 13" :y="84 - h * 2.2" width="12" :height="h * 2.2" class="liq" />
        </template>
        <template v-else-if="f.k === 'dlmm'">
          <rect v-for="(h, j) in bins" :key="j" :x="8 + j * 15.4" :y="84 - h * 2.4" width="13" :height="h * 2.4" :class="j === 5 ? 'active' : 'liq'" />
        </template>
        <template v-else>
          <line x1="4" y1="40" x2="176" y2="40" class="oracle" />
          <rect x="94" y="16" width="70" height="20" class="ask" />
          <rect x="16" y="44" width="70" height="20" class="bid" />
          <text x="166" y="30" class="t" text-anchor="end">ask</text>
          <text x="20" y="58" class="t">bid</text>
        </template>
      </svg>
      <h4>{{ f.n }}</h4>
      <p class="ex">{{ f.ex }}</p>
      <p class="l">{{ f.l }}</p>
    </div>
  </div>
</template>

<style scoped>
.fams { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.9rem; }
.fam { border-top: 4px solid var(--rule); padding-top: 0.5rem; opacity: 0.12; transform: translateY(10px); transition: all 0.5s; }
.fam.on { opacity: 1; transform: none; }
.fam.cur { border-color: var(--chain); }
svg { width: 100%; height: auto; }
.axis { stroke: var(--ink); stroke-width: 1.5; }
.price { stroke: var(--loss); stroke-width: 1.5; stroke-dasharray: 3 3; }
.liq { fill: var(--chain); opacity: 0.75; }
.active { fill: var(--gain); }
.oracle { stroke: var(--ink); stroke-dasharray: 4 3; }
.ask { fill: var(--loss-soft); stroke: var(--loss); }
.bid { fill: var(--gain-soft); stroke: var(--gain); }
.t { font-size: var(--fs-2xs); font-family: var(--font); fill: var(--ink-2); }
h4 { font-size: var(--fs-md); font-weight: 800; font-stretch: 112%; margin: 0.3rem 0 0; }
.ex { font-size: var(--fs-xs); color: var(--chain); font-weight: 650; margin: 0.1rem 0 0.3rem; }
.l { font-size: var(--fs-sm); color: var(--ink-2); margin: 0; }
</style>
