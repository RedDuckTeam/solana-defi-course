<script setup lang="ts">
// Demo day self-assessment. Weights from the curriculum: research 20, mechanics 20,
// analysis 25, risk 20, communication 15. Students score themselves before presenting.
import { computed, reactive } from 'vue'

const rows = reactive([
  { k: 'Quality of research and sources', w: 20, v: 3, tip: 'Primary sources, dated numbers, facts kept apart from assumptions.' },
  { k: 'Understanding of DeFi mechanics', w: 20, v: 3, tip: 'Can explain how the thing works without slides.' },
  { k: 'Financial or technical analysis', w: 25, v: 3, tip: 'A model, a calculation or working code, not just description.' },
  { k: 'Risk evaluation and critical thinking', w: 20, v: 3, tip: 'Names what could go wrong and what you could not verify.' },
  { k: 'Communication and presentation', w: 15, v: 3, tip: 'A non-specialist follows it in five minutes.' },
])
const total = computed(() => Math.round(rows.reduce((a, r) => a + r.v / 4 * r.w, 0)))
const labels = ['Missing', 'Weak', 'OK', 'Good', 'Excellent']
</script>

<template>
  <div class="dr widget">
    <div class="rows">
      <div v-for="r in rows" :key="r.k" class="row">
        <div class="lab"><b>{{ r.k }}</b><small>{{ r.tip }}</small></div>
        <div class="w" :style="{ width: `${r.w * 2.4}px` }"><i :style="{ width: `${r.v / 4 * 100}%` }" /></div>
        <span class="wt">{{ r.w }}%</span>
        <div class="seg">
          <button v-for="(l, i) in labels" :key="l" :class="{ on: r.v === i }" :title="l" @click="r.v = i">{{ i }}</button>
        </div>
      </div>
    </div>
    <div class="sum">
      <p class="readout big" :class="total >= 75 ? 'gain' : total >= 55 ? 'warn' : 'loss'">{{ total }}<span>/100</span></p>
      <p class="note">Self-assessment weights, not official grading.</p>
    </div>
  </div>
</template>

<style scoped>
.dr { display: grid; grid-template-columns: minmax(0, 1fr) 160px; gap: 1rem; align-items: center; }
.row { display: grid; grid-template-columns: minmax(0, 1fr) 60px 2.8em auto; gap: 0.7rem; align-items: center; padding: 0.3rem 0; border-bottom: 1px solid var(--rule); }
.lab b { display: block; font-size: var(--fs-sm); }
.lab small { font-size: var(--fs-2xs); color: var(--muted); }
.w { height: 10px; background: var(--paper-2); border-radius: 5px; overflow: hidden; max-width: 60px; }
.w i { display: block; height: 100%; background: var(--chain); transition: width 0.35s; }
.wt { font-size: var(--fs-xs); color: var(--ink-2); }
.seg { display: flex; gap: 2px; }
.seg button { width: 28px; padding: 0.15em 0 !important; font-size: var(--fs-xs) !important; }
.seg button.on { background: var(--chain) !important; border-color: var(--chain) !important; color: #fff !important; }
.big { font-size: var(--fs-3xl); margin: 0; line-height: 1; }
.big span { font-size: var(--fs-md); color: var(--muted); }
.note { font-size: var(--fs-xs) !important; color: var(--muted); margin: 0.4rem 0 0; }
</style>
