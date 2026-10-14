<script setup lang="ts">
// Everything on Solana is an account with the same five fields.
// Pick an account type and see how the fields change.
import { computed, ref } from 'vue'

const kinds = [
  {
    k: 'Your wallet', note: 'Just SOL. No data. Owned by the System Program, which only lets your key move it.',
    f: { lamports: '2,500,000,000 (2.5 SOL)', data: 'empty', owner: 'System Program', executable: 'false' },
  },
  {
    k: 'A token mint', note: 'Defines a token: total supply, decimals, who may mint more, who may freeze.',
    f: { lamports: '1,461,600 (rent deposit)', data: 'supply · decimals 6 · mint authority · freeze authority', owner: 'Token Program', executable: 'false' },
  },
  {
    k: 'Your token account', note: 'Holds your balance of one token. Its "owner" field inside the data is you.',
    f: { lamports: '2,039,280 (rent deposit)', data: 'mint · owner = you · amount 25.00', owner: 'Token Program', executable: 'false' },
  },
  {
    k: 'A program', note: 'Code. It has no balance of its own to spend and keeps its state in other accounts.',
    f: { lamports: 'rent deposit', data: 'compiled program (or a pointer to it)', owner: 'BPF Loader', executable: 'true' },
  },
]
const i = ref(0)
const cur = computed(() => kinds[i.value])
const rows = ['lamports', 'data', 'owner', 'executable'] as const
const hint: Record<string, string> = {
  lamports: 'SOL balance, in billionths',
  data: 'bytes the owner program reads',
  owner: 'the only program allowed to change it',
  executable: 'is this account code?',
}
</script>

<template>
  <div class="aa widget">
    <div class="tabs" role="tablist">
      <button v-for="(x, n) in kinds" :key="x.k" role="tab" :aria-selected="i === n" :class="{ on: i === n }" @click="i = n">{{ x.k }}</button>
    </div>
    <div class="card">
      <div class="addr"><span class="muted">address</span> <code>a public key, like 7xKp…Qm2a</code></div>
      <Transition name="sw" mode="out-in">
        <div :key="i" class="fields">
          <div v-for="r in rows" :key="r" class="row" :class="{ hi: r === 'owner' || (r === 'executable' && cur.f.executable === 'true') }">
            <b>{{ r }}</b><span class="v">{{ cur.f[r] }}</span><span class="h">{{ hint[r] }}</span>
          </div>
        </div>
      </Transition>
    </div>
    <p class="note">{{ cur.note }}</p>
  </div>
</template>

<style scoped>
.tabs { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.7rem; }
.tabs button.on { background: var(--chain); color: #fff; border-color: var(--chain); }
.card { border: 2px solid var(--ink); border-radius: var(--r-md); overflow: hidden; }
.addr { background: var(--ink); color: #fff; padding: 0.4rem 0.8rem; font-size: var(--fs-sm); }
.addr code { background: transparent !important; color: #c9b8ff !important; }
.fields { padding: 0.2rem 0; }
.row { display: grid; grid-template-columns: 120px minmax(0, 1.4fr) minmax(0, 1fr); gap: 1rem; padding: 0.45rem 0.8rem; border-bottom: 1px solid var(--rule); align-items: baseline; }
.row:last-child { border-bottom: 0; }
.row b { font-family: var(--mono); font-size: var(--fs-sm); color: var(--chain); }
.row .v { font-size: var(--fs-sm); font-weight: 650; }
.row .h { font-size: var(--fs-xs); color: var(--muted); }
.row.hi { background: var(--chain-soft); }
.note { font-size: var(--fs-sm); color: var(--ink-2); margin: 0.6rem 0 0; }
.sw-enter-active, .sw-leave-active { transition: all 0.2s; }
.sw-enter-from { opacity: 0; transform: translateX(12px); } .sw-leave-to { opacity: 0; transform: translateX(-12px); }
</style>
