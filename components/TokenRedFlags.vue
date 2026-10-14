<script setup lang="ts">
// Read a token page the way an analyst does. Set what Orb or Solscan shows you;
// the checker explains each flag and gives a verdict. Context matters: a regulated
// stablecoin issuer keeps mint and freeze authority on purpose.
import { computed, ref } from 'vue'

const issuer = ref(false)      // regulated stablecoin issuer (USDC, PYUSD)
const mintAuth = ref(true)
const freezeAuth = ref(true)
const permDelegate = ref(false)
const hook = ref(false)
const fee = ref(0)             // transfer fee in percent
const top10 = ref(62)          // share held by top 10 wallets

const flags = computed(() => {
  const f: { t: string, w: number, why: string }[] = []
  if (mintAuth.value && !issuer.value) f.push({ t: 'Mint authority active', w: 3, why: 'Someone can print more and dilute you to zero.' })
  if (freezeAuth.value && !issuer.value) f.push({ t: 'Freeze authority active', w: 3, why: 'Your token account can be frozen: you could buy but never sell.' })
  if (permDelegate.value) f.push({ t: 'Permanent delegate', w: 4, why: 'A Token-2022 extension that can move or burn tokens from any account.' })
  if (hook.value) f.push({ t: 'Transfer hook', w: 2, why: 'Custom code runs on every transfer. It could block sells.' })
  if (fee.value > 0) f.push({ t: `${fee.value}% transfer fee`, w: fee.value >= 5 ? 3 : 1, why: 'Every move costs you. High fees can trap holders.' })
  if (top10.value >= 50) f.push({ t: `Top 10 wallets hold ${top10.value}%`, w: top10.value >= 80 ? 3 : 2, why: 'A few wallets can crash the price by selling.' })
  return f
})
const score = computed(() => flags.value.reduce((a, b) => a + b.w, 0))
const verdict = computed(() => score.value >= 5 ? { t: 'Walk away', c: 'loss' } : score.value >= 2 ? { t: 'Proceed with care', c: 'warn' } : { t: 'No obvious red flags', c: 'gain' })
</script>

<template>
  <div class="trf widget">
    <div class="sheet">
      <p class="hdr">Token page <span>what the explorer shows</span></p>
      <button class="tg" :class="{ on: issuer }" @click="issuer = !issuer"><span>Issuer</span>{{ issuer ? 'Regulated stablecoin issuer' : 'Unknown team' }}</button>
      <button class="tg" :class="{ bad: mintAuth && !issuer }" @click="mintAuth = !mintAuth"><span>Mint authority</span>{{ mintAuth ? '7xKp…f3Qa' : 'Revoked' }}</button>
      <button class="tg" :class="{ bad: freezeAuth && !issuer }" @click="freezeAuth = !freezeAuth"><span>Freeze authority</span>{{ freezeAuth ? '7xKp…f3Qa' : 'None' }}</button>
      <button class="tg" :class="{ bad: permDelegate }" @click="permDelegate = !permDelegate"><span>Permanent delegate</span>{{ permDelegate ? 'Enabled' : 'None' }}</button>
      <button class="tg" :class="{ bad: hook }" @click="hook = !hook"><span>Transfer hook</span>{{ hook ? 'Program set' : 'None' }}</button>
      <label class="sl"><span>Transfer fee</span><b>{{ fee }}%</b><input v-model.number="fee" type="range" min="0" max="10" step="0.5"></label>
      <label class="sl"><span>Top 10 holders</span><b>{{ top10 }}%</b><input v-model.number="top10" type="range" min="5" max="98"></label>
    </div>
    <div class="result">
      <p class="verdict readout" :class="verdict.c">{{ verdict.t }}</p>
      <div class="meter"><i :class="verdict.c" :style="{ width: `${Math.min(score / 10, 1) * 100}%` }" /></div>
      <TransitionGroup name="fl" tag="ul">
        <li v-for="f in flags" :key="f.t"><b>{{ f.t }}</b>{{ f.why }}</li>
      </TransitionGroup>
      <p v-if="issuer && (mintAuth || freezeAuth)" class="ctx">Issuer keeps mint and freeze: normal for USDC-style coins, a red flag for anything else.</p>
    </div>
  </div>
</template>

<style scoped>
.trf { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 1.2rem; }
.hdr { margin: 0 0 0.4rem; font-weight: 800; font-size: var(--fs-base); }
.hdr span { font-weight: 400; color: var(--muted); font-size: var(--fs-xs); margin-left: 0.4rem; }
.tg { display: grid; grid-template-columns: 11.5em 1fr; width: 100%; text-align: left; margin-bottom: 0.25rem; font-family: var(--mono) !important; font-size: var(--fs-xs) !important; font-weight: 500 !important; padding: 0.3em 0.6em !important; }
.tg span { font-family: var(--font); font-weight: 650; color: var(--ink-2); }
.tg.bad { border-color: var(--loss); background: var(--loss-soft); }
.tg.on { border-color: var(--gain); background: var(--gain-soft); }
.tg:hover span { color: inherit; }
.sl { display: grid; grid-template-columns: 11.5em 1fr; font-size: var(--fs-xs) !important; margin-top: 0.2rem; }
.sl input { grid-column: 1 / -1; }
.verdict { font-size: var(--fs-xl); margin: 0; }
.meter { height: 10px; background: var(--paper-2); border-radius: 5px; overflow: hidden; margin: 0.4rem 0 0.6rem; }
.meter i { display: block; height: 100%; transition: width 0.4s, background 0.4s; }
.meter i.loss { background: var(--loss); } .meter i.warn { background: var(--warn); } .meter i.gain { background: var(--gain); }
ul { list-style: none; padding: 0 !important; margin: 0; }
li { font-size: var(--fs-xs) !important; margin: 0 0 0.35rem !important; line-height: 1.3; }
li b { display: block; color: var(--loss); font-size: var(--fs-sm); }
.ctx { font-size: var(--fs-xs); color: var(--gain); margin: 0.4rem 0 0; }
.fl-enter-active, .fl-leave-active { transition: all 0.3s; } .fl-enter-from, .fl-leave-to { opacity: 0; transform: translateX(10px); }
</style>
