<script setup lang="ts">
// Solana incidents 2022 to 2026, evenly spaced in time order. Circle area tracks the loss.
// `step` reveals one incident per click.
import { computed } from 'vue'

const props = withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const items = [
  { name: 'Wormhole', date: '2 Feb 2022', loss: 323, label: '~$320–326M', why: 'accounts' },
  { name: 'Cashio', date: '23 Mar 2022', loss: 50, label: '~$48–52M', why: 'accounts' },
  { name: 'Slope', date: '2 Aug 2022', loss: 4.1, label: '~$4.1M', why: 'keys' },
  { name: 'Mango', date: '11 Oct 2022', loss: 113, label: '~$110–116M', why: 'oracle' },
  { name: 'Solend', date: 'Nov 2022', loss: 1.26, label: '~$1.26M', why: 'oracle' },
  { name: 'web3.js', date: '2 Dec 2024', loss: 0.175, label: '~$160–190K', why: 'supply chain' },
  { name: 'Loopscale', date: '26 Apr 2025', loss: 5.8, label: '~$5.8M', why: 'oracle' },
  { name: 'Drift', date: '1 Apr 2026', loss: 285, label: '~$285M', why: 'keys' },
  { name: 'Aquifer', date: '31 Aug 2026', loss: 2.5, label: '~$2.5M', why: 'keys' },
]
const x = (i: number) => 50 + i * 97.5
const r = (m: number) => 5 + Math.sqrt(m) * 2.3
const shown = computed(() => props.step)
</script>

<template>
  <svg viewBox="0 0 880 300" class="tl" role="img" aria-label="Timeline of Solana DeFi incidents sized by loss">
    <line x1="10" y1="160" x2="870" y2="160" class="axis" />
    <g v-for="(it, i) in items" :key="it.name" class="ev" :class="{ on: shown > i }" :style="{ transitionDelay: '0.05s' }">
      <circle :cx="x(i)" cy="160" :r="r(it.loss)" class="blob" />
      <circle :cx="x(i)" cy="160" r="3" class="pin" />
      <text :x="x(i)" :y="i % 2 ? 160 + r(it.loss) + 22 : 160 - r(it.loss) - 46" text-anchor="middle" class="name">{{ it.name }}</text>
      <text :x="x(i)" :y="i % 2 ? 160 + r(it.loss) + 38 : 160 - r(it.loss) - 30" text-anchor="middle" class="loss">{{ it.label }}</text>
      <text :x="x(i)" :y="i % 2 ? 160 + r(it.loss) + 54 : 160 - r(it.loss) - 14" text-anchor="middle" class="date">{{ it.date }}</text>
    </g>
    <text x="870" y="292" text-anchor="end" class="note">Circle area tracks the reported loss. Figures from the course handbook, 11 Oct 2026.</text>
  </svg>
</template>

<style scoped>
.tl { width: 100%; height: 300px; overflow: visible; }
.axis { stroke: var(--ink); stroke-width: 2; }
.ev { opacity: 0; transform-box: fill-box; transition: opacity 0.4s; }
.ev.on { opacity: 1; }
.blob { fill: var(--loss-soft); stroke: var(--loss); stroke-width: 2; transform-box: fill-box; transform-origin: center; transform: scale(0); transition: transform 0.6s cubic-bezier(.3,1.6,.5,1); }
.ev.on .blob { transform: scale(1); }
.pin { fill: var(--loss); }
.name { font-family: var(--font); font-size: var(--fs-sm); font-weight: 800; font-stretch: 110%; fill: var(--ink); }
.loss { font-family: var(--font); font-size: var(--fs-xs); font-weight: 700; fill: var(--loss); }
.date { font-family: var(--font); font-size: var(--fs-2xs); fill: var(--muted); }
.note { font-family: var(--font); font-size: var(--fs-2xs); fill: var(--muted); }
</style>
