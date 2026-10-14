<script setup lang="ts">
// "Decentralised" is a spectrum. Tick what is true about a protocol and watch the needle move.
import { computed, reactive } from 'vue'

const facts = reactive([
  { t: 'Users hold their own keys (non-custodial)', w: 25, on: true },
  { t: 'Code is open source and verified on chain', w: 15, on: true },
  { t: 'No one can upgrade the program (upgrade authority burned)', w: 20, on: false },
  { t: 'Admin keys cannot pause or freeze funds', w: 15, on: false },
  { t: 'Price data comes from more than one source', w: 10, on: true },
  { t: 'Anyone can build their own front end for it', w: 15, on: false },
])
const score = computed(() => facts.reduce((a, f) => a + (f.on ? f.w : 0), 0))
const angle = computed(() => -90 + score.value * 1.8)
const verdict = computed(() => score.value < 35 ? 'Mostly a company with a blockchain database' : score.value < 70 ? 'Partly decentralised: ask who holds the admin keys' : 'Hard for any one party to stop or change')
</script>

<template>
  <div class="dd widget">
    <ul>
      <li v-for="f in facts" :key="f.t">
        <label><input v-model="f.on" type="checkbox" /> {{ f.t }}</label>
      </li>
    </ul>
    <div class="gauge">
      <svg viewBox="0 0 220 145">
        <defs>
          <linearGradient id="dd-g" x1="0" x2="1"><stop offset="0" stop-color="var(--ink)" /><stop offset="1" stop-color="var(--chain)" /></linearGradient>
        </defs>
        <path d="M20,115 A90,90 0 0 1 200,115" fill="none" stroke="url(#dd-g)" stroke-width="16" stroke-linecap="round" />
        <g :style="{ transform: `rotate(${angle}deg)`, transformOrigin: '110px 115px', transition: 'transform 0.6s cubic-bezier(.3,1.4,.5,1)' }">
          <line x1="110" y1="115" x2="110" y2="38" stroke="var(--loss)" stroke-width="4" stroke-linecap="round" />
        </g>
        <circle cx="110" cy="115" r="8" fill="var(--ink)" />
        <text x="20" y="142" class="end m">Company</text>
        <text x="200" y="142" class="end m">Protocol</text>
      </svg>
      <div class="readout fs-xl" style="text-align:center">{{ score }}<span class="fs-sm muted"> / 100</span></div>
      <p class="v">{{ verdict }}</p>
    </div>
  </div>
</template>

<style scoped>
.dd { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 1.2rem; align-items: center; }
ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.35rem; }
li { margin: 0 !important; }
label { display: flex; gap: 0.5rem; align-items: center; font-size: var(--fs-sm) !important; color: var(--ink) !important; cursor: pointer; }
input[type='checkbox'] { accent-color: var(--chain); width: 16px; height: 16px; }
svg { width: 100%; }
.end { font-size: var(--fs-2xs); fill: var(--muted); }
.end.m { text-anchor: middle; }
.v { text-align: center; font-size: var(--fs-sm); font-weight: 650; margin: 0.2rem 0 0; min-height: 2.6em; }
</style>
