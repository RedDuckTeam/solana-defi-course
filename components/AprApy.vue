<script setup lang="ts">
// APR vs APY, then the trap: yield paid in a token whose price falls.
// $1,000 of a farm token in, rewards paid in the same token, one year.
import { computed, ref } from 'vue'

const apr = ref(40)
const n = ref(365)
const tokenMove = ref(-50)
const opts = [{ v: 1, l: 'Yearly' }, { v: 12, l: 'Monthly' }, { v: 52, l: 'Weekly' }, { v: 365, l: 'Daily' }]

const apy = computed(() => (Math.pow(1 + apr.value / 100 / n.value, n.value) - 1) * 100)
const tokens = computed(() => 1000 * (1 + apy.value / 100))
const usd = computed(() => tokens.value * (1 + tokenMove.value / 100))
const real = computed(() => (usd.value / 1000 - 1) * 100)
const pct = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`
</script>

<template>
  <div class="aa widget">
    <div class="in">
      <label>Advertised APR <b class="readout">{{ apr }}%</b><input v-model.number="apr" type="range" min="1" max="200"></label>
      <div class="seg">
        <button v-for="o in opts" :key="o.v" :class="{ sel: n === o.v }" @click="n = o.v">{{ o.l }}</button>
      </div>
      <label>Token price over the year <b class="readout" :class="tokenMove < 0 ? 'lossf' : 'gainf'">{{ pct(tokenMove) }}</b>
        <input v-model.number="tokenMove" type="range" min="-90" max="100">
      </label>
    </div>
    <div class="steps">
      <div class="s"><span>APR (simple)</span><b class="readout">{{ apr.toFixed(1) }}%</b></div>
      <div class="arrow">compounded</div>
      <div class="s"><span>APY</span><b class="readout chain">{{ apy.toFixed(1) }}%</b><small class="mono">(1 + APR ÷ n)ⁿ − 1</small></div>
      <div class="arrow">priced in dollars</div>
      <div class="s big"><span>What you actually made</span><b class="readout" :class="real < 0 ? 'lossf' : 'gainf'">{{ pct(real) }}</b><small>$1,000 became ${{ usd.toFixed(0) }}</small></div>
    </div>
  </div>
</template>

<style scoped>
.aa { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: 1.6rem; align-items: center; }
.in { display: grid; gap: 0.9rem; }
.in label { font-size: var(--fs-sm); }
.seg { display: flex; gap: 0.3rem; }
.seg button { flex: 1; padding: 0.25em 0.2em; }
.seg button.sel { background: var(--chain); border-color: var(--chain); color: #fff; }
.steps { display: grid; gap: 0.25rem; }
.s { border: 1.5px solid var(--ink); border-radius: var(--r-md); padding: 0.35rem 0.8rem; background: var(--paper); }
.s span { display: block; font-size: var(--fs-xs); color: var(--muted); }
.s b { font-size: var(--fs-xl); }
.s small { display: block; font-size: var(--fs-2xs); color: var(--muted); }
.s.big { background: #fff; border-width: 2px; }
.arrow { font-size: var(--fs-xs); color: var(--muted); padding-left: 1rem; }
.arrow::before { content: '↓ '; color: var(--chain); font-weight: 800; }
.chain { color: var(--chain); } .lossf { color: var(--loss); } .gainf { color: var(--gain); }
</style>
