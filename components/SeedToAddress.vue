<script setup lang="ts">
// How 12 words become every address in your wallet.
// 1 words, 2 seed, 3 derivation path, 4 keypair, 5 address, 6 same words, next account.
import { computed } from 'vue'

const props = withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const s = computed(() => props.step)
const words = ['orbit', 'canvas', 'pepper', 'tribe', 'ladder', 'sunny', 'velvet', 'mango', 'harbor', 'oxygen', 'quiet', 'zebra']
</script>

<template>
  <div class="sa">
    <div class="stage" :class="{ on: s >= 1 }">
      <p class="lbl">Recovery phrase <span class="loss">example only, never real</span></p>
      <div class="words"><span v-for="(w, i) in words" :key="w" :style="{ transitionDelay: `${i * 40}ms` }">{{ i + 1 }}. {{ w }}</span></div>
    </div>
    <div class="arrow" :class="{ on: s >= 2 }">→<small>one-way maths</small></div>
    <div class="stage" :class="{ on: s >= 2 }">
      <p class="lbl">Seed</p>
      <div class="blob mono">5eb00bbd…a3c7f1</div>
    </div>
    <div class="arrow" :class="{ on: s >= 3 }">→<small>path</small></div>
    <div class="stage" :class="{ on: s >= 3 }">
      <p class="lbl">Derivation path</p>
      <div class="blob mono">m/44'/501'/<b class="chain">0</b>'/0'</div>
      <p class="tiny">501 is Solana's coin number</p>
    </div>
    <div class="arrow" :class="{ on: s >= 4 }">→</div>
    <div class="stage keys" :class="{ on: s >= 4 }">
      <p class="lbl">Keypair</p>
      <div class="blob loss-b">secret key</div>
      <div class="blob chain-b" :class="{ on2: s >= 5 }">public key = address<br><span class="mono">7xKp…Qm2a</span></div>
    </div>
    <div class="branch" :class="{ on: s >= 6 }">
      <span>Same 12 words, path <b class="mono">m/44'/501'/<b class="chain">1</b>'/0'</b> → a second address. One phrase can restore every account.</span>
    </div>
  </div>
</template>

<style scoped>
.sa { display: grid; grid-template-columns: minmax(0, 1.5fr) auto minmax(0, 0.8fr) auto minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: 0.4rem; row-gap: 1.2rem; }
.stage, .arrow, .branch { opacity: 0.08; transform: translateY(8px); transition: all 0.5s cubic-bezier(.2,.8,.2,1); }
.on { opacity: 1 !important; transform: none !important; }
.lbl { font-size: var(--fs-xs) !important; font-weight: 700; color: var(--ink-2); margin: 0 0 0.3rem; display: flex; justify-content: space-between; gap: 0.4rem; }
.lbl span { font-size: var(--fs-2xs); }
.words { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.2rem; border: 1.5px dashed var(--loss); border-radius: var(--r-md); padding: 0.5rem; background: #fff; }
.words span { font-family: var(--mono); font-size: var(--fs-2xs); color: var(--ink); }
.arrow { font-size: var(--fs-xl); color: var(--chain); font-weight: 800; text-align: center; line-height: 1; }
.arrow small { display: block; font-size: var(--fs-2xs); color: var(--muted); font-weight: 500; }
.blob { border: 1.5px solid var(--ink); border-radius: var(--r-sm); padding: 0.4rem 0.5rem; font-size: var(--fs-xs); background: #fff; text-align: center; }
.blob.mono { font-family: var(--mono); }
.tiny { font-size: var(--fs-2xs) !important; color: var(--muted); margin: 0.2rem 0 0; }
.keys { display: grid; gap: 0.35rem; }
.loss-b { border-color: var(--loss); color: var(--loss); background: var(--loss-soft); font-weight: 700; }
.chain-b { border-color: var(--chain); color: #fff; background: var(--chain); font-weight: 700; transition: all 0.4s; transform: scale(0.95); }
.chain-b.on2 { transform: scale(1.06); box-shadow: 0 0 0 6px var(--chain-soft); }
.chain-b .mono { font-weight: 500; font-size: var(--fs-2xs); }
.branch { grid-column: 1 / -1; font-size: var(--fs-sm); color: var(--ink-2); border-left: 5px solid var(--chain); padding-left: 0.8rem; }
</style>
