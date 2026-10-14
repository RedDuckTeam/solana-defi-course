<script setup lang="ts">
// What a Solana transaction actually costs, piece by piece.
// fee = signatures × 5,000 lamports + compute limit × priority price (micro-lamports per CU) / 1,000,000
// plus a refundable rent deposit if the transaction creates an account.
import { computed, ref } from 'vue'

const sigs = ref(1)
const cu = ref(200_000)
const price = ref(10_000)
const newAccount = ref(true)
const solUsd = ref(150)

const LAMPORTS = 1_000_000_000
const base = computed(() => sigs.value * 5_000)
const priority = computed(() => Math.ceil(cu.value * price.value / 1_000_000))
const rent = computed(() => newAccount.value ? 2_039_280 : 0)
const fee = computed(() => base.value + priority.value)
const usd = (l: number) => (l / LAMPORTS * solUsd.value)
const fmtSol = (l: number) => (l / LAMPORTS).toFixed(9).replace(/0+$/, '').replace(/\.$/, '')
const fmtUsd = (x: number) => x < 0.01 ? `$${x.toFixed(5)}` : `$${x.toFixed(3)}`
const bar = (l: number) => `${Math.max(2, (l / Math.max(fee.value + rent.value, 1)) * 100)}%`
</script>

<template>
  <div class="fc widget">
    <div class="inputs">
      <label>Signatures <b class="readout">{{ sigs }}</b><input v-model.number="sigs" type="range" min="1" max="4" /></label>
      <label>Compute limit <b class="readout">{{ cu.toLocaleString() }} CU</b><input v-model.number="cu" type="range" min="20000" max="1400000" step="20000" /></label>
      <label>Priority price <b class="readout">{{ price.toLocaleString() }} µ-lamports/CU</b><input v-model.number="price" type="range" min="0" max="1000000" step="5000" /></label>
      <label>SOL price (example) <b class="readout">${{ solUsd }}</b><input v-model.number="solUsd" type="range" min="20" max="500" step="10" /></label>
      <label class="chk"><input v-model="newAccount" type="checkbox" /> Creates the recipient's token account</label>
    </div>
    <div class="out">
      <div class="line"><span>Base fee</span><i class="b ink" :style="{ width: bar(base) }" /><b>{{ fmtSol(base) }} SOL</b></div>
      <div class="line"><span>Priority fee</span><i class="b chain" :style="{ width: bar(priority) }" /><b>{{ fmtSol(priority) }} SOL</b></div>
      <div class="line"><span>Rent deposit</span><i class="b gain" :style="{ width: bar(rent) }" /><b>{{ fmtSol(rent) || '0' }} SOL</b></div>
      <div class="total">
        <div><small>Fee (gone)</small><b class="readout fs-xl">{{ fmtUsd(usd(fee)) }}</b></div>
        <div><small>Deposit (refundable)</small><b class="readout fs-xl gain">{{ fmtUsd(usd(rent)) }}</b></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fc { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: 1.4rem; }
.inputs { display: grid; gap: 0.5rem; }
.inputs label { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0.1rem 0.5rem; align-items: baseline; }
.inputs label input[type='range'] { grid-column: 1 / -1; }
.inputs .chk { display: flex; gap: 0.5rem; align-items: center; color: var(--ink); }
.inputs .chk input { accent-color: var(--gain); width: 16px; height: 16px; }
.readout { font-size: var(--fs-sm); }
.out { display: grid; gap: 0.5rem; align-content: start; }
.line { display: grid; grid-template-columns: 100px minmax(0, 1fr) 150px; gap: 0.6rem; align-items: center; font-size: var(--fs-sm); }
.line b { font-family: var(--mono); font-size: var(--fs-xs); text-align: right; }
.b { display: block; height: 14px; border-radius: 3px; transition: width 0.4s cubic-bezier(.3,.8,.3,1); }
.b.ink { background: var(--ink); } .b.chain { background: var(--chain); } .b.gain { background: var(--gain); }
.total { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; border-top: 2px solid var(--ink); padding-top: 0.6rem; margin-top: 0.4rem; }
.total small { display: block; font-size: var(--fs-xs); color: var(--muted); }
</style>
