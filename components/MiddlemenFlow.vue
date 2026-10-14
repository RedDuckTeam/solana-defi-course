<script setup lang="ts">
// Buying a share vs swapping a token.
// step 1: the TradFi chain of intermediaries lights up hop by hop.
// step 2: the on-chain swap, one transaction. step 3: the settlement times stamp in.
import { computed } from 'vue'

const props = withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const s = computed(() => props.step)
const hops = [
  { t: 'You', d: '' },
  { t: 'Broker', d: 'takes the order' },
  { t: 'Exchange', d: 'matches a seller' },
  { t: 'Clearing house', d: 'guarantees both sides' },
  { t: 'Custodian', d: 'holds the share' },
]
</script>

<template>
  <div class="mf">
    <div class="row ink" :class="{ on: s >= 1 }">
      <template v-for="(h, i) in hops" :key="h.t">
        <div class="hop" :style="{ transitionDelay: `${i * 180}ms` }">
          <b>{{ h.t }}</b><span>{{ h.d }}</span>
        </div>
        <div v-if="i < hops.length - 1" class="link" :style="{ transitionDelay: `${i * 180 + 90}ms` }"><i class="pulse" /></div>
      </template>
      <div class="stamp loss" :class="{ on: s >= 3 }">Settles T+1<small>US stocks, since May 2024</small></div>
    </div>

    <div class="row chain" :class="{ on: s >= 2 }">
      <div class="hop"><b>You</b><span>sign once</span></div>
      <div class="link long"><i class="pulse fast" /></div>
      <div class="hop prog"><b>Swap program</b><span>checks, swaps, records</span></div>
      <div class="stamp gain" :class="{ on: s >= 3 }">Settles in the same transaction<small>a Solana slot is about 0.4s</small></div>
    </div>
  </div>
</template>

<style scoped>
.mf { display: grid; gap: 2.2rem; }
.row { display: flex; align-items: center; gap: 0; position: relative; }
.hop {
  border: 2px solid currentColor; border-radius: var(--r-md); background: #fff; padding: 0.45rem 0.7rem; min-width: 0;
  opacity: 0; transform: translateY(8px); transition: all 0.45s cubic-bezier(.2,.8,.2,1);
}
.row.on .hop, .row.on .link { opacity: 1; transform: none; }
.hop b { display: block; font-size: var(--fs-sm); color: var(--ink); white-space: nowrap; }
.hop span { display: block; font-size: var(--fs-2xs); color: var(--ink-2); white-space: nowrap; }
.hop.prog { background: var(--chain); } .hop.prog b, .hop.prog span { color: #fff; }
.link { flex: 1; min-width: 18px; height: 2px; background: currentColor; position: relative; opacity: 0; transition: opacity 0.4s; overflow: visible; }
.link.long { flex: 3; }
.pulse { position: absolute; top: -4px; left: 0; width: 10px; height: 10px; border-radius: 50%; background: currentColor; animation: travel 2.4s linear infinite; }
.pulse.fast { animation-duration: 0.8s; }
.stamp {
  margin-left: 1rem; font-weight: 800; font-size: var(--fs-md); font-stretch: 112%; line-height: 1.1;
  border: 3px solid currentColor; border-radius: var(--r-sm); padding: 0.3rem 0.6rem; transform: rotate(-4deg) scale(1.6); opacity: 0;
  transition: all 0.35s cubic-bezier(.3,1.5,.5,1); background: #fff; max-width: 200px;
}
.stamp.on { opacity: 1; transform: rotate(-4deg) scale(1); }
.stamp small { display: block; font-size: var(--fs-2xs); font-weight: 500; color: var(--ink-2); }
.ink { color: var(--ink); } .chain { color: var(--chain); } .loss { color: var(--loss); } .gain { color: var(--gain); }
@keyframes travel { from { left: 0; } to { left: calc(100% - 10px); } }
</style>
