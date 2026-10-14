<script setup lang="ts">
// A guided read of an explorer page for a devnet USDC send. Each click highlights one part.
// Sample data shaped like Orb / Solscan, not a real transaction.
import { computed } from 'vue'

const props = withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const s = computed(() => props.step)
const notes = [
  '',
  'The signature is the transaction ID. Paste it into any explorer.',
  'Success, the slot it landed in, and the time. Check "devnet" in the cluster switch.',
  'The fee: 0.000005 SOL base for one signature, plus any priority fee.',
  'SOL balance changes. You paid the fee and Bola\'s token account deposit.',
  'Token balance changes. This is the part the user cares about.',
  'The instructions, in order. Match each one to the transaction parts we saw.',
]
const on = (n: number) => s.value === n || s.value >= 7
</script>

<template>
  <div class="et">
    <div class="page">
      <div class="bar"><span class="dot" /><span class="dot" /><span class="dot" /><span class="url">orb.helius.dev/tx/4Rf9…xT1q?cluster=devnet</span></div>
      <div class="body">
        <div class="sec" :class="{ hi: on(1) }"><small>Signature</small><code>4Rf9kQ2…mD8xT1q</code></div>
        <div class="grid3">
          <div class="sec" :class="{ hi: on(2) }"><small>Result</small><b class="gain">Success</b><span>Slot 412,880,113 · 14 Oct 2026 10:02</span></div>
          <div class="sec" :class="{ hi: on(3) }"><small>Fee</small><b>0.000005 SOL</b><span>1 signature, no priority fee</span></div>
        </div>
        <div class="sec" :class="{ hi: on(4) }">
          <small>SOL balance changes</small>
          <div class="chg"><span>You</span><b class="loss">−0.002044 SOL</b></div>
          <div class="chg"><span>Bola's USDC account (new)</span><b class="gain">+0.002039 SOL</b></div>
        </div>
        <div class="sec" :class="{ hi: on(5) }">
          <small>Token balance changes</small>
          <div class="chg"><span>You · USDC</span><b class="loss">−5.00</b></div>
          <div class="chg"><span>Bola · USDC</span><b class="gain">+5.00</b></div>
        </div>
        <div class="sec" :class="{ hi: on(6) }">
          <small>Instructions</small>
          <div class="ix"><b>#1</b> Associated Token Program · create (idempotent)</div>
          <div class="ix"><b>#2</b> Token Program · transferChecked 5.000000 USDC</div>
        </div>
      </div>
    </div>
    <Transition name="n" mode="out-in">
      <p :key="s" class="note">{{ s >= 7 ? 'Everything an analyst needs is on one page. Write down what you can and can\'t interpret.' : notes[s] || 'Click to walk through the page.' }}</p>
    </Transition>
    <p class="samp">Sample data for teaching.</p>
  </div>
</template>

<style scoped>
.et { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 1.2rem; align-items: center; }
.page { border: 2px solid var(--ink); border-radius: var(--r-md); overflow: hidden; background: #fff; grid-row: span 2; }
.bar { background: var(--ink); padding: 0.35rem 0.6rem; display: flex; gap: 0.3rem; align-items: center; }
.dot { width: 9px; height: 9px; border-radius: 50%; background: #5d6a85; }
.url { color: #c9d2e3; font-family: var(--mono); font-size: var(--fs-2xs); margin-left: 0.5rem; }
.body { padding: 0.5rem; display: grid; gap: 0.4rem; }
.grid3 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.4rem; }
.sec { border: 1.5px solid var(--rule); border-radius: var(--r-sm); padding: 0.3rem 0.5rem; transition: all 0.35s; opacity: 0.55; }
.sec.hi { border-color: var(--chain); background: var(--chain-soft); opacity: 1; box-shadow: 0 0 0 3px var(--chain-soft); }
.sec small { display: block; font-size: var(--fs-2xs); color: var(--muted); font-weight: 700; }
.sec b { font-size: var(--fs-sm); }
.sec span { display: block; font-size: var(--fs-2xs); color: var(--ink-2); }
.sec code { font-size: var(--fs-xs) !important; }
.chg { display: flex; justify-content: space-between; font-size: var(--fs-xs); }
.chg span { display: inline !important; font-size: var(--fs-xs) !important; }
.chg b { font-family: var(--mono); font-size: var(--fs-xs); }
.ix { font-size: var(--fs-xs); }
.ix b { color: var(--chain); }
.note { font-size: var(--fs-md); font-weight: 650; margin: 0; align-self: end; }
.samp { font-size: var(--fs-2xs); color: var(--muted); align-self: start; margin: 0; }
.n-enter-active, .n-leave-active { transition: all 0.2s; } .n-enter-from { opacity: 0; transform: translateY(6px); } .n-leave-to { opacity: 0; }
</style>
