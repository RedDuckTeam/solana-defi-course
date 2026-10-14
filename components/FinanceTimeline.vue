<script setup lang="ts">
// From Bitcoin to Solana DeFi in seven stops. `step` drops each stop onto the line.
import { computed } from 'vue'

const props = withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const stops = [
  { y: '2008', t: 'Bitcoin paper', d: 'Money that moves without a bank.', tone: 'ink' },
  { y: '2015', t: 'Ethereum', d: 'The ledger can run programs.', tone: 'chain' },
  { y: '2017', t: 'MakerDAO · DAI', d: 'A dollar token backed by crypto collateral.', tone: 'chain' },
  { y: '2018', t: 'Uniswap · Compound', d: 'Swaps and loans with no company in the middle.', tone: 'chain' },
  { y: '2020', t: 'DeFi Summer', d: 'Token rewards pull billions in. Solana mainnet beta goes live.', tone: 'gain' },
  { y: '2022', t: 'The collapse', d: 'Terra/UST in May, FTX in November. SOL falls hard.', tone: 'loss' },
  { y: '2023+', t: 'Solana DeFi rebuilds', d: 'Jupiter, Jito, Kamino. Stablecoins on Solana hit $17.3B (25 Sep 2026).', tone: 'gain' },
]
const shown = computed(() => props.step)
</script>

<template>
  <div class="tl">
    <div class="line"><div class="fill" :style="{ width: `${Math.min(shown, stops.length) / stops.length * 100}%` }" /></div>
    <div class="stops">
      <div v-for="(s, i) in stops" :key="s.y" class="stop" :class="[s.tone, { on: shown > i }]">
        <div class="dot" />
        <div class="year">{{ s.y }}</div>
        <div class="title">{{ s.t }}</div>
        <div class="desc">{{ s.d }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tl { position: relative; padding-top: 1.2rem; }
.line { position: absolute; top: 1.95rem; left: 0; right: 0; height: 3px; background: var(--rule); }
.fill { height: 100%; background: var(--ink); transition: width 0.7s cubic-bezier(.2,.8,.2,1); }
.stops { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 0.6rem; }
.stop { opacity: 0.12; transform: translateY(10px); transition: all 0.5s cubic-bezier(.2,.8,.2,1); }
.stop.on { opacity: 1; transform: none; }
.dot { width: 18px; height: 18px; border-radius: 50%; background: #fff; border: 4px solid currentColor; margin-bottom: 0.5rem; }
.stop.on .dot { animation: pop 0.45s cubic-bezier(.3,1.6,.4,1); }
.year { font-size: var(--fs-lg); font-weight: 900; font-stretch: 70%; line-height: 1; }
.title { font-size: var(--fs-sm); font-weight: 750; margin: 0.25rem 0; color: var(--ink); }
.desc { font-size: var(--fs-xs); color: var(--ink-2); line-height: 1.35; }
.ink { color: var(--ink); } .chain { color: var(--chain); } .gain { color: var(--gain); } .loss { color: var(--loss); }
@keyframes pop { 0% { transform: scale(0.2); } 100% { transform: scale(1); } }
</style>
