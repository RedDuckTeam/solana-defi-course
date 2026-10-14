<script setup lang="ts">
// Why a pre-signed transaction is dangerous on Solana only when it uses a durable nonce.
// Top lane: a normal transaction dies ~150 blocks after its blockhash. Bottom lane: it waits.
import { computed } from 'vue'

const props = withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const captions = [
  'Two transactions, both signed right now.',
  'A normal transaction carries a recent blockhash. It is only valid for about 150 blocks: roughly a minute.',
  'After that it can never land. A signature from yesterday is worthless.',
  'A durable nonce swaps the blockhash for a value stored in an account.',
  'That signature stays valid until someone advances the nonce. Days. Weeks.',
  'Useful for offline signing and slow multisigs. Dangerous when you do not know what you signed.',
]
const s = computed(() => Math.min(props.step, captions.length - 1))
const normalFill = computed(() => (s.value >= 1 ? 1 : 0))
const nonceFill = computed(() => (s.value >= 4 ? 1 : s.value >= 3 ? 0.12 : 0))
</script>

<template>
  <div class="nc">
    <svg viewBox="0 0 880 230" role="img" aria-label="Normal transaction expiry versus durable nonce">
      <!-- lane 1 -->
      <text x="0" y="22" class="lane">Normal transaction</text>
      <rect x="0" y="34" width="120" height="44" rx="8" class="sig" />
      <text x="60" y="61" class="sigt" text-anchor="middle">signed ✍</text>
      <rect x="140" y="44" width="200" height="24" rx="4" class="track" />
      <rect x="140" y="44" :width="200 * normalFill" height="24" rx="4" class="fill chainf" />
      <text x="240" y="61" class="trt" text-anchor="middle">150 blocks ≈ 1 min</text>
      <g class="pop" :class="{ on: s >= 2 }">
        <rect x="360" y="38" width="120" height="36" rx="4" class="dead" transform="rotate(-6 420 56)" />
        <text x="420" y="62" class="deadt" text-anchor="middle" transform="rotate(-6 420 56)">EXPIRED</text>
      </g>

      <!-- lane 2 -->
      <text x="0" y="132" class="lane">Durable nonce transaction</text>
      <rect x="0" y="144" width="120" height="44" rx="8" class="sig" />
      <text x="60" y="171" class="sigt" text-anchor="middle">signed ✍</text>
      <rect x="140" y="154" width="720" height="24" rx="4" class="track" />
      <rect x="140" y="154" :width="720 * nonceFill" height="24" rx="4" class="fill warnf" />
      <g class="pop" :class="{ on: s >= 3 }">
        <rect x="140" y="190" width="132" height="30" rx="6" class="nonce" />
        <text x="206" y="210" class="sigt" text-anchor="middle">nonce account</text>
      </g>
      <g class="pop" :class="{ on: s >= 4 }">
        <text v-for="(d, i) in ['day 1', 'day 7', 'day 14', 'day 30']" :key="d" :x="300 + i * 150" y="171" class="trt" text-anchor="middle">{{ d }}</text>
        <text x="860" y="210" class="valid" text-anchor="end">still valid</text>
      </g>
    </svg>
    <div class="caption">
      <span class="stepno">{{ s + 1 }}/{{ captions.length }}</span>
      <Transition name="cap" mode="out-in"><p :key="s">{{ captions[s] }}</p></Transition>
    </div>
  </div>
</template>

<style scoped>
svg { width: 100%; height: 230px; display: block; overflow: visible; }
.lane { font-family: var(--font); font-size: var(--fs-base); font-weight: 750; fill: var(--ink); }
.sig { fill: #fff; stroke: var(--ink); stroke-width: 2; }
.sigt { font-family: var(--font); font-size: var(--fs-sm); font-weight: 700; fill: var(--ink); }
.track { fill: var(--paper-2); }
.fill { transition: width 1.6s linear; }
.chainf { fill: var(--chain); } .warnf { fill: var(--warn); transition-duration: 2.4s; }
.trt { font-family: var(--font); font-size: var(--fs-xs); font-weight: 700; fill: var(--ink); paint-order: stroke; stroke: rgba(255,255,255,0.75); stroke-width: 3px; }
.pop { opacity: 0; transition: opacity 0.4s; } .pop.on { opacity: 1; }
.dead { fill: var(--paper); stroke: var(--loss); stroke-width: 2.5; }
.deadt { font-family: var(--font); font-size: var(--fs-base); font-weight: 900; font-stretch: 125%; fill: var(--loss); }
.nonce { fill: var(--chain-soft); stroke: var(--chain); stroke-width: 1.5; }
.valid { font-family: var(--font); font-size: var(--fs-base); font-weight: 900; fill: var(--warn); }
.caption { display: flex; gap: 0.8rem; align-items: baseline; border-top: 1.5px solid var(--ink); padding-top: 0.5rem; margin-top: 0.4rem; min-height: 3.2em; }
.stepno { font-size: var(--fs-xs); font-weight: 800; color: var(--chain); white-space: nowrap; }
.caption p { margin: 0; font-size: var(--fs-md); }
.cap-enter-active, .cap-leave-active { transition: all 0.25s; }
.cap-enter-from { opacity: 0; transform: translateY(6px); } .cap-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
