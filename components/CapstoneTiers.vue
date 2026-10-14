<script setup lang="ts">
// Three capstone tiers, revealed one per click. Same rigour, different tools.
withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const tiers = [
  {
    n: 'No code', tone: 't-ink', who: 'Users track',
    build: 'A Solana stablecoin report or dashboard',
    ex: ['Supply by coin and growth over time', 'Who uses them, for what', 'Data from DefiLlama, Artemis or Dune'],
    proof: 'Every number has a source and a date.',
  },
  {
    n: 'Light code', tone: 't-chain', who: 'Users + scripting',
    build: 'A TypeScript tool with @solana/kit',
    ex: ['Live SOL price from Pyth Hermes', 'A Jupiter quote with its route', 'Or: a lending health checker'],
    proof: 'It runs on someone else\'s laptop.',
  },
  {
    n: 'On-chain', tone: 't-gain', who: 'Builders track',
    build: 'An Anchor or Quasar program on devnet',
    ex: ['Constant-product AMM', 'Escrow', 'Mini lending market reading a Pyth price'],
    proof: 'Tests pass in LiteSVM or Surfpool, and it is deployed.',
  },
]
</script>

<template>
  <div class="tiers">
    <section v-for="(t, i) in tiers" :key="t.n" :class="[t.tone, { on: step > i }]">
      <p class="who">{{ t.who }}</p>
      <h3>{{ t.n }}</h3>
      <p class="build">{{ t.build }}</p>
      <ul><li v-for="e in t.ex" :key="e">{{ e }}</li></ul>
      <p class="proof"><b>Done means:</b> {{ t.proof }}</p>
    </section>
  </div>
</template>

<style scoped>
.tiers { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; align-items: end; }
section {
  background: #fff; border: 1.5px solid var(--ink); border-top-width: 8px; border-radius: var(--r-md); padding: 0.8rem 0.9rem;
  opacity: 0; transform: translateY(30px); transition: all 0.55s cubic-bezier(.3,1.3,.5,1);
}
section:nth-child(1) { min-height: 270px; } section:nth-child(2) { min-height: 300px; } section:nth-child(3) { min-height: 330px; }
section.on { opacity: 1; transform: none; }
.t-ink { border-top-color: var(--ink); } .t-chain { border-top-color: var(--chain); } .t-gain { border-top-color: var(--gain); }
.who { margin: 0; font-size: var(--fs-xs); color: var(--muted); }
h3 { margin: 0.1rem 0 0.3rem !important; font-size: var(--fs-lg) !important; font-stretch: 118%; }
.t-chain h3 { color: var(--chain) !important; } .t-gain h3 { color: var(--gain) !important; }
.build { font-weight: 700; margin: 0 0 0.3rem; font-size: var(--fs-sm) !important; }
li { font-size: var(--fs-sm) !important; margin: 0.15rem 0 !important; }
.proof { font-size: var(--fs-xs) !important; color: var(--ink-2); border-top: 1px solid var(--rule); padding-top: 0.4rem; margin: 0.5rem 0 0; }
</style>
