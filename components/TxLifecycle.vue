<script setup lang="ts">
// The life of a transaction, one click per stage. A packet travels along the track.
import { computed } from 'vue'

const props = withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const stages = [
  { t: 'Build', d: 'The app lists the instructions and accounts.', who: 'app' },
  { t: 'Sign', d: 'Your wallet shows what it will do. You approve.', who: 'wallet' },
  { t: 'Send', d: 'Sent to an RPC node, then forwarded straight to the next leaders. No mempool.', who: 'rpc' },
  { t: 'Execute', d: 'The leader runs it in a ~400ms slot. All instructions succeed, or none do.', who: 'leader' },
  { t: 'Processed', d: 'In a block on one node. Could still be dropped.', who: 'status' },
  { t: 'Confirmed', d: 'Validators holding 2/3 of stake voted for the block.', who: 'status' },
  { t: 'Finalized', d: '31+ blocks built on top. Treat it as permanent.', who: 'status' },
]
const n = computed(() => Math.min(props.step, stages.length))
const pos = computed(() => n.value === 0 ? 0 : ((n.value - 1) / (stages.length - 1)) * 100)
</script>

<template>
  <div class="lc">
    <div class="track">
      <div class="fill" :style="{ width: `${pos}%` }" />
      <div class="packet" :class="{ final: n >= 7 }" :style="{ left: `${pos}%`, opacity: n ? 1 : 0 }">tx</div>
    </div>
    <div class="stages">
      <div v-for="(s, i) in stages" :key="s.t" class="st" :class="{ on: n > i, now: n === i + 1, status: s.who === 'status' }">
        <b>{{ s.t }}</b>
        <span>{{ s.d }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lc { padding-top: 1.6rem; }
.track { position: relative; height: 6px; background: var(--rule); border-radius: 3px; margin: 0 calc(100% / 14); }
.fill { position: absolute; inset: 0 auto 0 0; background: var(--chain); border-radius: 3px; transition: width 0.7s cubic-bezier(.3,.8,.3,1); }
.packet {
  position: absolute; top: -17px; transform: translateX(-50%); width: 40px; height: 40px; border-radius: 8px; background: var(--chain); color: #fff;
  display: grid; place-items: center; font-weight: 800; font-size: var(--fs-sm); transition: left 0.7s cubic-bezier(.3,.8,.3,1), background 0.4s, opacity 0.3s;
  box-shadow: 0 0 0 6px var(--chain-soft);
}
.packet.final { background: var(--gain); box-shadow: 0 0 0 6px var(--gain-soft); }
.stages { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 0.6rem; margin-top: 2.2rem; }
.st { opacity: 0.18; transition: all 0.4s; border-top: 4px solid var(--ink-2); padding-top: 0.4rem; }
.st.status { border-top-color: var(--gain); }
.st.on { opacity: 1; }
.st.now { transform: translateY(-4px); }
.st b { display: block; font-size: var(--fs-base); font-stretch: 110%; }
.st.status b { color: var(--gain); }
.st span { font-size: var(--fs-xs); color: var(--ink-2); line-height: 1.35; display: block; }
</style>
