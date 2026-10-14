<script setup lang="ts">
// Sort the incidents by root cause. Each click sends one bucket's incidents flying from
// the unsorted pile into their column, under the question that would have stopped them.
import { computed } from 'vue'

const props = withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const buckets = [
  { t: 'Unchecked accounts', q: 'Is this the real account?' },
  { t: 'Oracle and pricing', q: 'Can someone push this price?' },
  { t: 'Keys, signers, ops', q: 'Who can sign, and what are they signing?' },
  { t: 'Supply chain', q: 'Do I trust every package I install?' },
]
const chips = [
  { n: 'Wormhole', b: 1, m: '$320M+' }, { n: 'Cashio', b: 1, m: '$48M+' },
  { n: 'Mango', b: 2, m: '$110M+' }, { n: 'Solend', b: 2, m: '$1.3M' }, { n: 'Loopscale', b: 2, m: '$5.8M' },
  { n: 'Slope', b: 3, m: '$4.1M' }, { n: 'Drift', b: 3, m: '$285M' }, { n: 'Aquifer', b: 3, m: '$2.5M' },
  { n: 'web3.js', b: 4, m: '$160K+' },
]
const pileOrder = [6, 0, 8, 3, 5, 2, 7, 1, 4] // shuffled on purpose
const pos = (i: number) => {
  const c = chips[i]
  if (props.step >= c.b) {
    const idx = chips.filter((o, j) => o.b === c.b && j < i).length
    return { left: `${(c.b - 1) * 222}px`, top: `${128 + idx * 44}px` }
  }
  return { left: `${pileOrder.indexOf(i) * 97}px`, top: '0px' }
}
const totals = computed(() => buckets.map((_, k) => props.step > k))
</script>

<template>
  <div class="rc">
    <div v-for="(b, k) in buckets" :key="b.t" class="col" :class="{ live: step >= k + 1 }" :style="{ left: `${k * 222}px` }">
      <b>{{ k + 1 }}. {{ b.t }}</b>
      <span>{{ b.q }}</span>
    </div>
    <div v-for="(c, i) in chips" :key="c.n" class="chip" :class="{ placed: step >= c.b }" :style="pos(i)">
      {{ c.n }}<small>{{ c.m }}</small>
    </div>
    <p class="pile" :class="{ gone: step >= 4 }">Unsorted: nine incidents, 2022 to 2026</p>
    <p class="punch" :class="{ on: totals[3] }">Biggest losses: two missing checks and one tricked council.</p>
  </div>
</template>

<style scoped>
.rc { position: relative; height: 330px; width: 880px; }
.col { position: absolute; top: 58px; width: 210px; height: 270px; border-top: 4px solid var(--rule); padding-top: 0.35rem; transition: border-color 0.4s; }
.col.live { border-color: var(--loss); }
.col b { display: block; font-size: var(--fs-base); font-stretch: 110%; color: var(--muted); transition: color 0.4s; }
.col.live b { color: var(--ink); }
.col span { display: block; font-size: var(--fs-xs); color: var(--muted); font-style: italic; line-height: 1.25; }
.chip {
  position: absolute; width: 90px; padding: 0.25rem 0.5rem; border-radius: var(--r-sm);
  background: #fff; border: 1.5px solid var(--ink); font-size: var(--fs-sm); font-weight: 750; line-height: 1.15;
  transition: left 0.75s cubic-bezier(.5,0,.2,1.2), top 0.75s cubic-bezier(.5,0,.2,1.2), background 0.4s, border-color 0.4s;
}
.chip small { display: block; font-size: var(--fs-2xs); font-weight: 600; color: var(--loss); }
.chip.placed { width: 200px; background: var(--loss-soft); border-color: var(--loss); }
.pile { position: absolute; top: 34px; left: 0; margin: 0; font-size: var(--fs-2xs); color: var(--muted); transition: opacity 0.4s; }
.pile.gone { opacity: 0; }
.punch { position: absolute; bottom: -6px; left: 0; margin: 0; font-size: var(--fs-md); font-weight: 750; opacity: 0; transition: opacity 0.5s 0.6s; }
.punch.on { opacity: 1; }
</style>
