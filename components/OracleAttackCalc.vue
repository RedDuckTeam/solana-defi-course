<script setup lang="ts">
// Does an oracle attack pay? A toy model of Mango-style manipulation.
// Buying S dollars into a constant-product market with Q dollars of depth multiplies the
// price by ((Q + S) / Q)^2. The lender values the attacker's tokens at that price and lends
// against them. Defences: a time-averaged price, and a borrow cap on thin assets.
import { computed, ref } from 'vue'

const depth = ref(500_000)   // dollar depth of the thin market
const spend = ref(2_000_000) // dollars spent pumping
const held = ref(2_000_000)  // collateral tokens bought before the pump, in dollars
const ltv = ref(80)
const twap = ref(false)
const cap = ref(false)

const usd = (v: number) => (Math.abs(v) >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : `$${Math.round(v / 1e3)}K`)
const mult = computed(() => ((depth.value + spend.value) / depth.value) ** 2)
const seen = computed(() => (twap.value ? 1 + (mult.value - 1) * 0.08 : mult.value))
const collateral = computed(() => held.value * seen.value)
const borrow = computed(() => Math.min(collateral.value * ltv.value / 100, cap.value ? 1_000_000 : Infinity))
const cost = computed(() => spend.value + held.value)
const profit = computed(() => borrow.value - cost.value)
const maxBar = computed(() => Math.max(borrow.value, cost.value))
</script>

<template>
  <div class="oa widget">
    <div class="inputs">
      <label>Market depth <b>{{ usd(depth) }}</b>
        <input v-model.number="depth" type="range" min="100000" max="20000000" step="100000"></label>
      <label>Spent pumping <b>{{ usd(spend) }}</b>
        <input v-model.number="spend" type="range" min="0" max="10000000" step="100000"></label>
      <label>Collateral held <b>{{ usd(held) }}</b>
        <input v-model.number="held" type="range" min="100000" max="10000000" step="100000"></label>
      <label>Loan-to-value <b>{{ ltv }}%</b>
        <input v-model.number="ltv" type="range" min="30" max="90" step="5"></label>
      <div class="def">
        <button :class="{ on: twap }" :aria-pressed="twap" @click="twap = !twap">Time-averaged price</button>
        <button :class="{ on: cap }" :aria-pressed="cap" @click="cap = !cap">$1M borrow cap</button>
      </div>
    </div>
    <div class="out">
      <p class="m">Oracle sees <b class="readout">{{ seen.toFixed(1) }}×</b> the real price</p>
      <div class="bars">
        <div class="row"><span>Attacker pays</span><i class="ink" :style="{ width: `${cost / maxBar * 100}%` }" /><b>{{ usd(cost) }}</b></div>
        <div class="row"><span>Can borrow</span><i class="loss" :style="{ width: `${borrow / maxBar * 100}%` }" /><b>{{ usd(borrow) }}</b></div>
      </div>
      <p class="verdict readout" :class="profit > 0 ? 'loss' : 'gain'">
        {{ profit > 0 ? `Attack pays: +${usd(profit)}` : `Attack loses ${usd(-profit)}` }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.oa { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: 1.4rem; }
.inputs { display: grid; gap: 0.35rem; }
.inputs label { display: grid; grid-template-columns: 1fr auto; font-size: var(--fs-sm); }
.inputs label input { grid-column: 1 / -1; }
.inputs b { font-variant-numeric: tabular-nums; }
.def { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.3rem; }
.def button.on { background: var(--gain); border-color: var(--gain); color: #fff; }
.m { margin: 0 0 0.6rem; font-size: var(--fs-base); }
.m b { font-size: var(--fs-xl); color: var(--loss); }
.bars { display: grid; gap: 0.45rem; }
.row { display: grid; grid-template-columns: 7.5em minmax(0, 1fr) 4.5em; align-items: center; gap: 0.5rem; font-size: var(--fs-sm); }
.row i { height: 22px; border-radius: 3px; transition: width 0.4s cubic-bezier(.3,1.2,.4,1); min-width: 2px; }
.row i.ink { background: var(--ink); } .row i.loss { background: var(--loss); }
.row b { text-align: right; }
.verdict { font-size: var(--fs-xl); margin: 0.8rem 0 0; }
</style>
