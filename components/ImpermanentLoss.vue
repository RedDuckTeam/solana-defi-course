<script setup lang="ts">
// Impermanent loss, live. $1,000 deposit: 5 SOL at $100 + 500 USDC.
// Move SOL's price; compare LP value with just holding, then let fees try to win it back.
import { computed, ref } from 'vue'

const logR = ref(Math.log(2))
const feeApr = ref(20)
const days = ref(90)
const r = computed(() => Math.exp(logR.value))
const setR = (v: number) => (logR.value = Math.log(v))

const hodl = computed(() => 500 * r.value + 500)
const lp = computed(() => 1000 * Math.sqrt(r.value))
const il = computed(() => (2 * Math.sqrt(r.value)) / (1 + r.value) - 1)
const fees = computed(() => 1000 * (feeApr.value / 100) * (days.value / 365))
const net = computed(() => lp.value + fees.value - hodl.value)

const W = 340, H = 170, P = 40
const lo = Math.log(0.1), hi = Math.log(6)
const sx = (lr: number) => P + ((lr - lo) / (hi - lo)) * (W - P - 8)
const sy = (v: number) => 12 + (-v / 0.6) * (H - 40)
const path = computed(() => {
  const pts: string[] = []
  for (let lr = lo; lr <= hi; lr += 0.05) {
    const rr = Math.exp(lr)
    pts.push(`${sx(lr).toFixed(1)},${sy((2 * Math.sqrt(rr)) / (1 + rr) - 1).toFixed(1)}`)
  }
  return `M${pts.join(' L')}`
})
const maxBar = computed(() => Math.max(hodl.value, lp.value + fees.value, 1000))
const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`
</script>

<template>
  <div class="il widget">
    <div>
      <label>SOL price moves <b class="readout">{{ r.toFixed(2) }}×</b> (from $100 to ${{ (100 * r).toFixed(0) }})</label>
      <input v-model.number="logR" type="range" :min="Math.log(0.1)" :max="Math.log(6)" step="0.01" aria-label="Price ratio">
      <div class="presets">
        <button v-for="p in [0.5, 1.25, 2, 4]" :key="p" @click="setR(p)">{{ p }}×</button>
      </div>
      <svg :viewBox="`0 0 ${W} ${H}`" :width="W" :height="H" role="img" aria-label="Impermanent loss curve">
        <line :x1="P" :y1="sy(0)" :x2="W" :y2="sy(0)" class="axis" />
        <line :x1="sx(0)" y1="6" :x2="sx(0)" :y2="H - 20" class="tick" />
        <text :x="sx(0)" :y="H - 6" class="lbl" text-anchor="middle">1× no move</text>
        <text :x="P" :y="H - 6" class="lbl">0.1×</text>
        <text :x="W - 4" :y="H - 6" class="lbl" text-anchor="end">6×</text>
        <text :x="P - 4" :y="sy(-0.2) + 4" class="lbl" text-anchor="end">−20%</text>
        <text :x="P - 4" :y="sy(-0.4) + 4" class="lbl" text-anchor="end">−40%</text>
        <path :d="path" class="curve" />
        <circle :cx="sx(logR)" :cy="sy(il)" r="6" class="dot" />
      </svg>
    </div>
    <div>
      <p class="big readout lossf">{{ (il * 100).toFixed(2) }}%</p>
      <p class="formula mono">IL = 2√r ÷ (1 + r) − 1</p>
      <div class="bars">
        <div class="row"><span>Just hold</span><i class="b ink" :style="{ width: (hodl / maxBar) * 100 + '%' }" /><b>{{ usd(hodl) }}</b></div>
        <div class="row"><span>LP position</span><i class="b chain" :style="{ width: (lp / maxBar) * 100 + '%' }" /><b>{{ usd(lp) }}</b></div>
        <div class="row"><span>LP + fees</span><i class="b gain" :style="{ width: ((lp + fees) / maxBar) * 100 + '%' }" /><b>{{ usd(lp + fees) }}</b></div>
      </div>
      <div class="fees">
        <label>Fee APR {{ feeApr }}%<input v-model.number="feeApr" type="range" min="0" max="80" step="1"></label>
        <label>Days {{ days }}<input v-model.number="days" type="range" min="7" max="365" step="1"></label>
      </div>
      <p class="verdict" :class="net >= 0 ? 'gainf' : 'lossf'">
        {{ net >= 0 ? 'Fees beat the loss by' : 'Holding wins by' }} {{ usd(Math.abs(net)) }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.il { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 1.4rem; }
.presets { display: flex; gap: 0.4rem; margin: 0.3rem 0 0.4rem; }
.presets button { padding: 0.15em 0.6em; }
.axis { stroke: var(--ink); stroke-width: 1.2; }
.tick { stroke: var(--rule); stroke-dasharray: 3 3; }
.curve { fill: none; stroke: var(--loss); stroke-width: 3; }
.dot { fill: var(--loss); stroke: #fff; stroke-width: 2; }
.lbl { font-size: var(--fs-2xs); fill: var(--muted); font-family: var(--font); }
.big { font-size: var(--fs-2xl); margin: 0; line-height: 1; }
.lossf { color: var(--loss); } .gainf { color: var(--gain); }
.formula { font-size: var(--fs-xs); color: var(--muted); margin: 0.2rem 0 0.6rem; }
.bars { display: grid; gap: 0.3rem; }
.row { display: grid; grid-template-columns: 76px minmax(0, 1fr) 62px; align-items: center; gap: 0.5rem; font-size: var(--fs-xs); }
.row b { text-align: right; font-size: var(--fs-sm); }
.b { display: block; height: 14px; border-radius: 2px; transition: width 0.25s; }
.b.ink { background: var(--ink); } .b.chain { background: var(--chain); } .b.gain { background: var(--gain); }
.fees { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-top: 0.6rem; }
.fees label { font-size: var(--fs-xs); }
.verdict { font-size: var(--fs-base); font-weight: 750; margin: 0.5rem 0 0; }
</style>
