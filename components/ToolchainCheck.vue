<script setup lang="ts">
// Will my program still deploy after Solana moves to sBPFv3? Pick a framework and version.
// Supported minimums from the course handbook (checked 11 Oct 2026): Anchor 0.30.2, 0.31.2,
// 0.32.2 or 1.2.0+, Pinocchio 0.10, Quasar 0.1.0.
import { computed, ref } from 'vue'

const options: Record<string, { v: string, ok: boolean, say: string }[]> = {
  Anchor: [
    { v: '0.29.0', ok: false, say: 'Old tutorials pin this. It will not deploy once SIMD-0500 is active.' },
    { v: '0.30.1', ok: false, say: 'Upgrade to the 0.30.2 patch at minimum.' },
    { v: '0.30.2', ok: true, say: 'Minimum supported on the 0.30 line.' },
    { v: '0.31.1', ok: false, say: 'Upgrade to 0.31.2.' },
    { v: '0.31.2', ok: true, say: 'Minimum supported on the 0.31 line.' },
    { v: '0.32.2', ok: true, say: 'Minimum supported on the 0.32 line.' },
    { v: '1.0.x', ok: false, say: 'On the 1.x line, 1.2.0 is the minimum.' },
    { v: '1.2.1', ok: true, say: 'Latest as of 6 Oct 2026. Start here.' },
  ],
  Pinocchio: [
    { v: '0.9', ok: false, say: 'Upgrade to 0.10.' },
    { v: '0.10', ok: true, say: 'Minimum supported.' },
  ],
  Quasar: [{ v: '0.1.0', ok: true, say: 'Minimum supported.' }],
}
const fw = ref('Anchor')
const ver = ref('0.29.0')
const pick = (f: string) => { fw.value = f; ver.value = options[f][0].v }
const cur = computed(() => options[fw.value].find(o => o.v === ver.value)!)
</script>

<template>
  <div class="tc widget">
    <div class="pick">
      <div class="fws">
        <button v-for="f in Object.keys(options)" :key="f" :class="{ sel: fw === f }" @click="pick(f)">{{ f }}</button>
      </div>
      <div class="vers">
        <button v-for="o in options[fw]" :key="o.v" class="mono" :class="{ sel: ver === o.v, ok: o.ok }" @click="ver = o.v">{{ o.v }}</button>
      </div>
    </div>
    <Transition name="res" mode="out-in">
      <div :key="fw + ver" class="res" :class="cur.ok ? 'gain' : 'loss'">
        <b class="readout">{{ cur.ok ? 'Deploys after sBPFv3' : 'Will not deploy' }}</b>
        <p>{{ fw }} {{ ver }}: {{ cur.say }}</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tc { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 1.2rem; align-items: center; }
.fws, .vers { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.vers { margin-top: 0.6rem; }
button.sel { background: var(--ink) !important; color: #fff !important; }
.vers button.ok { border-color: var(--gain); }
.vers button.ok.sel { background: var(--gain) !important; border-color: var(--gain); }
.vers button:not(.ok).sel { background: var(--loss) !important; border-color: var(--loss); }
.res { border-left: 6px solid; padding: 0.4rem 0.9rem; }
.res.gain { border-color: var(--gain); } .res.loss { border-color: var(--loss); }
.res b { font-size: var(--fs-xl); }
.res.gain b { color: var(--gain); } .res.loss b { color: var(--loss); }
.res p { margin: 0.2rem 0 0; font-size: var(--fs-sm); }
.res-enter-active, .res-leave-active { transition: all 0.22s; }
.res-enter-from { opacity: 0; transform: translateX(12px); } .res-leave-to { opacity: 0; transform: translateX(-12px); }
</style>
