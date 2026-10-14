<script setup lang="ts">
// Narrowing a research question, one click per level, until evidence can answer it.
withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const levels = [
  { q: 'Is DeFi good?', v: 'Opinion. No data can settle it.', tone: 'loss' },
  { q: 'Is Solana lending safe?', v: 'Too wide: which lender, which asset, safe from what?', tone: 'warn' },
  { q: 'How does a Solana lender protect lenders when SOL falls fast?', v: 'Better: one mechanism. Still needs a lender and a test.', tone: 'warn' },
  { q: 'On Kamino\'s SOL market, how much would SOL have to fall before typical borrowers hit liquidation, as of a stated date?', v: 'Answerable: docs + on-chain data + a spreadsheet.', tone: 'gain' },
]
</script>

<template>
  <div class="funnel">
    <div v-for="(l, i) in levels" :key="i" class="lv" :class="[l.tone, { on: step >= i }]" :style="{ marginInline: `${i * 52}px` }">
      <p class="q">{{ l.q }}</p>
      <p class="v">{{ l.v }}</p>
    </div>
  </div>
</template>

<style scoped>
.funnel { display: grid; gap: 0.45rem; }
.lv {
  border: 1.5px solid; border-radius: var(--r-md); padding: 0.45rem 0.9rem; background: #fff; text-align: center;
  opacity: 0; transform: scaleX(1.12); transition: all 0.5s cubic-bezier(.3,1.2,.5,1);
}
.lv.on { opacity: 1; transform: none; }
.loss { border-color: var(--loss); } .warn { border-color: var(--warn); } .gain { border-color: var(--gain); background: var(--gain-soft); }
.q { margin: 0; font-weight: 750; font-size: var(--fs-base); line-height: 1.25; }
.v { margin: 0.1rem 0 0; font-size: var(--fs-xs); color: var(--ink-2); }
.loss .v { color: var(--loss); } .gain .v { color: var(--gain); font-weight: 650; }
</style>
