<script setup lang="ts">
// The closing entry: everything each student produced, posted like a ledger, then the balance.
withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const entries = [
  { w: 1, t: 'Traced a Jupiter route', a: '1 post' },
  { w: 2, t: 'Sent devnet USDC, read it on Orb', a: '1 post' },
  { w: 3, t: 'Provided liquidity, built an IL table', a: '1 post' },
  { w: 4, t: 'Walked a liquidation by hand', a: '1 post' },
  { w: 5, t: 'Wrote a post-mortem, audited a token', a: '1 post' },
  { w: 6, t: 'Shipped and presented a capstone', a: '1 post + demo' },
]
</script>

<template>
  <div class="cl">
    <div v-for="e in entries" :key="e.w" class="row" :class="{ on: step >= e.w }">
      <span class="n">{{ e.w }}</span><span class="t">{{ e.t }}</span><span class="a">{{ e.a }}</span>
    </div>
    <div class="bal" :class="{ on: step >= 7 }">
      <span>Balance carried forward</span>
      <b>6 posts, 1 capstone, a public portfolio</b>
    </div>
  </div>
</template>

<style scoped>
.cl { border-top: 2px solid var(--ink); max-width: 760px; }
.row { display: grid; grid-template-columns: 40px minmax(0, 1fr) 9em; gap: 1rem; align-items: baseline; padding: 0.35rem 0; border-bottom: 1px solid var(--rule); opacity: 0; transform: translateX(-12px); transition: all 0.45s; }
.row.on { opacity: 1; transform: none; }
.n { font-size: var(--fs-lg); font-weight: 900; font-stretch: 62%; color: var(--chain); }
.t { font-size: var(--fs-base); }
.a { font-size: var(--fs-sm); color: var(--gain); font-weight: 700; text-align: right; }
.bal { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; flex-wrap: wrap; border-top: 3px double var(--ink); margin-top: 0.4rem; padding-top: 0.5rem; opacity: 0; transition: opacity 0.6s; }
.bal.on { opacity: 1; }
.bal span { font-size: var(--fs-sm); color: var(--muted); }
.bal b { font-size: var(--fs-lg); font-stretch: 112%; color: var(--gain); }
</style>
