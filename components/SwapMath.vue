<script setup lang="ts">
// The 10 X swap worked by hand, one ledger line per click.
// step 1-4: no fee. step 5-7: the same swap with a 0.3% fee that stays in the pool.
withDefaults(defineProps<{ step?: number }>(), { step: 99 })

const noFee = [
  { l: 'Pool before', m: 'x = 100   y = 100', r: 'k = 100 × 100 = 10,000' },
  { l: 'You add 10 X', m: 'x = 110', r: 'k must stay 10,000' },
  { l: 'Pool solves for y', m: 'y = 10,000 ÷ 110', r: '= 90.91' },
  { l: 'You receive', m: '100 − 90.91', r: '= 9.09 Y', hi: 'loss' },
]
const fee = [
  { l: '0.3% fee kept back', m: '10 × 0.997', r: '= 9.97 X counts for pricing' },
  { l: 'Pool solves for y', m: 'y = 10,000 ÷ 109.97', r: '= 90.934' },
  { l: 'You receive', m: '100 − 90.934', r: '= 9.066 Y', hi: 'loss' },
  { l: 'Pool keeps all 10 X', m: 'k = 110 × 90.934', r: '= 10,002.7  LPs got richer', hi: 'gain' },
]
</script>

<template>
  <div class="sm">
    <div class="col">
      <h4>No fee</h4>
      <div v-for="(r, i) in noFee" :key="r.l" class="line" :class="[{ on: step >= i + 1 }, r.hi]">
        <span class="l">{{ r.l }}</span><span class="m mono">{{ r.m }}</span><span class="r mono">{{ r.r }}</span>
      </div>
    </div>
    <div class="col">
      <h4>With a 0.3% LP fee</h4>
      <div v-for="(r, i) in fee" :key="r.l" class="line" :class="[{ on: step >= i + 5 }, r.hi]">
        <span class="l">{{ r.l }}</span><span class="m mono">{{ r.m }}</span><span class="r mono">{{ r.r }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sm { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.4rem; }
h4 { font-size: var(--fs-md); font-weight: 750; font-stretch: 112%; margin: 0 0 0.4rem; border-bottom: 2px solid var(--ink); padding-bottom: 0.2rem; }
.line {
  display: grid; grid-template-columns: minmax(0, 1fr); gap: 0.05rem; padding: 0.4rem 0.2rem;
  border-bottom: 1px solid var(--rule); opacity: 0; transform: translateY(8px); transition: all 0.4s;
}
.line.on { opacity: 1; transform: none; }
.l { font-size: var(--fs-xs); color: var(--muted); }
.m { font-size: var(--fs-sm); color: var(--ink-2); }
.r { font-size: var(--fs-base); font-weight: 600; color: var(--ink); }
.line.loss .r { color: var(--loss); }
.line.gain .r { color: var(--gain); }
.line.on.loss, .line.on.gain { background: #fff; }
</style>
