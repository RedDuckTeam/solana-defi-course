<script setup lang="ts">
// Class game: sort real Solana protocols into DeFi categories.
// Click a protocol, then click the bucket it belongs to. Right answers lock in green.
import { computed, ref } from 'vue'

const buckets = [
  { k: 'dex', t: 'Swap (DEX)', tf: 'stock exchange' },
  { k: 'agg', t: 'Aggregator', tf: 'smart order router' },
  { k: 'lend', t: 'Lending', tf: 'bank loan desk' },
  { k: 'perps', t: 'Perps', tf: 'futures exchange' },
  { k: 'lst', t: 'Liquid staking', tf: 'interest-bearing deposit' },
  { k: 'oracle', t: 'Oracle', tf: 'Bloomberg terminal' },
]
const protocols = [
  { n: 'Raydium', k: 'dex' }, { n: 'Jupiter', k: 'agg' }, { n: 'Kamino Lend', k: 'lend' }, { n: 'Pyth', k: 'oracle' },
  { n: 'Orca', k: 'dex' }, { n: 'Drift', k: 'perps' }, { n: 'Jito', k: 'lst' }, { n: 'Save', k: 'lend' },
  { n: 'Meteora', k: 'dex' }, { n: 'Switchboard', k: 'oracle' }, { n: 'Marinade', k: 'lst' }, { n: 'Project 0', k: 'lend' },
  { n: 'Sanctum', k: 'lst' }, { n: 'HumidiFi', k: 'dex' },
]
const placed = ref<Record<string, string>>({})
const picked = ref<string | null>(null)
const miss = ref<string | null>(null)
const left = computed(() => protocols.filter(p => !placed.value[p.n]))
function drop(k: string) {
  if (!picked.value) return
  const p = protocols.find(x => x.n === picked.value)!
  if (p.k === k) { placed.value = { ...placed.value, [p.n]: k }; picked.value = null }
  else { miss.value = k; setTimeout(() => (miss.value = null), 450) }
}
const reset = () => { placed.value = {}; picked.value = null }
</script>

<template>
  <div class="ps">
    <div class="pool">
      <TransitionGroup name="chip">
        <button v-for="p in left" :key="p.n" class="chip" :class="{ sel: picked === p.n }" @click="picked = picked === p.n ? null : p.n">{{ p.n }}</button>
      </TransitionGroup>
      <span v-if="!left.length" class="done gain">All sorted. <button class="btn" @click="reset">Play again</button></span>
    </div>
    <div class="buckets">
      <button v-for="b in buckets" :key="b.k" class="bucket" :class="{ ready: picked, miss: miss === b.k }" @click="drop(b.k)">
        <b>{{ b.t }}</b>
        <small>like a {{ b.tf }}</small>
        <span class="in">
          <span v-for="(k, n) in placed" v-show="k === b.k" :key="n" class="chip ok">{{ n }}</span>
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.ps { display: grid; gap: 0.9rem; }
.pool { display: flex; flex-wrap: wrap; gap: 0.4rem; min-height: 2.2rem; align-items: center; }
.chip {
  font-family: var(--font); font-size: var(--fs-sm); font-weight: 650; border: 1.5px solid var(--chain); color: var(--chain);
  background: #fff; border-radius: 999px; padding: 0.2em 0.75em; cursor: pointer; transition: all 0.2s;
}
.chip.sel { background: var(--chain); color: #fff; transform: translateY(-3px); box-shadow: 0 4px 0 var(--chain-soft); }
.chip.ok { border-color: var(--gain); color: var(--gain); background: var(--gain-soft); cursor: default; font-size: var(--fs-xs); padding: 0.1em 0.55em; }
.buckets { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.6rem; }
.bucket {
  text-align: left; font-family: var(--font); background: #fff; border: 1.5px dashed var(--ink-2); border-radius: var(--r-md);
  padding: 0.5rem 0.7rem; min-height: 92px; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; gap: 0.1rem;
}
.bucket.ready:hover { border-style: solid; border-color: var(--chain); background: var(--chain-soft); }
.bucket.miss { border-color: var(--loss); background: var(--loss-soft); animation: shake 0.35s; }
.bucket b { font-size: var(--fs-base); color: var(--ink); }
.bucket small { font-size: var(--fs-2xs); color: var(--muted); }
.in { display: flex; flex-wrap: wrap; gap: 0.25rem; margin-top: 0.3rem; }
.done { font-weight: 700; font-size: var(--fs-base); display: flex; gap: 0.8rem; align-items: center; }
.chip-leave-active { transition: all 0.3s; } .chip-leave-to { opacity: 0; transform: scale(0.6) translateY(20px); }
@keyframes shake { 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
</style>
