<script setup lang="ts">
// Take a transaction apart. Hover or click a part to see what it is.
// Example: sending 5 USDC to a friend who has never held USDC.
import { ref } from 'vue'

type Part = { id: string, t: string, d: string }
const parts: Record<string, Part> = {
  sig: { id: 'sig', t: 'Signatures', d: 'One per required signer. The first signature is also the transaction\'s ID, the thing you paste into an explorer. 5,000 lamports base fee each.' },
  header: { id: 'header', t: 'Header', d: 'Three small numbers: how many accounts must sign, and how many of those and of the rest are read-only.' },
  keys: { id: 'keys', t: 'Account list', d: 'Every account the transaction will touch, listed up front. This is what lets Solana run transactions in parallel.' },
  hash: { id: 'hash', t: 'Recent blockhash', d: 'A timestamp of sorts. If it is older than about 150 blocks (roughly a minute), the network rejects the transaction. Stops replays.' },
  ix1: { id: 'ix1', t: 'Instruction 1 · Compute Budget', d: 'Optional. Sets a compute limit and a priority fee so the transaction lands faster when the network is busy.' },
  ix2: { id: 'ix2', t: 'Instruction 2 · Create Bola\'s USDC account', d: 'Bola has no USDC account yet, so we create it. You pay its rent deposit (about 0.002 SOL). This is why your first send costs more.' },
  ix3: { id: 'ix3', t: 'Instruction 3 · Transfer 5 USDC', d: 'Calls the Token Program: move 5.000000 USDC from your token account to Bola\'s. Checks the mint and decimals.' },
}
const active = ref<Part>(parts.keys)
const keys = [
  { k: 'You', f: 'signer · writable' },
  { k: 'Your USDC account', f: 'writable' },
  { k: "Bola's USDC account", f: 'writable' },
  { k: 'Bola', f: 'read-only' },
  { k: 'USDC mint', f: 'read-only' },
  { k: 'Token Program', f: 'program' },
  { k: 'Associated Token Program', f: 'program' },
  { k: 'System Program', f: 'program' },
  { k: 'Compute Budget Program', f: 'program' },
]
</script>

<template>
  <div class="tx">
    <div class="paper">
      <div class="blk" :class="{ on: active.id === 'sig' }" @mouseenter="active = parts.sig" @click="active = parts.sig">
        <span class="tag">signatures</span><code>4Rf9…xT1q (yours)</code>
      </div>
      <div class="msg">
        <span class="tag dark">message</span>
        <div class="blk" :class="{ on: active.id === 'header' }" @mouseenter="active = parts.header" @click="active = parts.header"><span class="tag">header</span><code>1 · 0 · 6</code></div>
        <div class="blk" :class="{ on: active.id === 'keys' }" @mouseenter="active = parts.keys" @click="active = parts.keys">
          <span class="tag">accounts</span>
          <div class="keys"><span v-for="(k, i) in keys" :key="k.k"><b>{{ i }}</b> {{ k.k }} <em>{{ k.f }}</em></span></div>
        </div>
        <div class="blk" :class="{ on: active.id === 'hash' }" @mouseenter="active = parts.hash" @click="active = parts.hash"><span class="tag">recent blockhash</span><code>9sHc…4kLm</code></div>
        <div class="ixs">
          <div v-for="id in ['ix1', 'ix2', 'ix3']" :key="id" class="blk ix" :class="{ on: active.id === id }" @mouseenter="active = parts[id]" @click="active = parts[id]">
            <span class="tag">instruction {{ id.slice(2) }}</span>
          </div>
        </div>
      </div>
    </div>
    <Transition name="ex" mode="out-in">
      <div :key="active.id" class="explain">
        <b>{{ active.t }}</b>
        <p>{{ active.d }}</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tx { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: 1.2rem; align-items: start; }
.paper { border: 2px solid var(--ink); border-radius: var(--r-md); padding: 0.6rem; background: #fff; display: grid; gap: 0.45rem; }
.msg { border: 1.5px solid var(--ink-2); border-radius: var(--r-sm); padding: 0.45rem; display: grid; gap: 0.4rem; position: relative; padding-top: 1.4rem; }
.tag { display: block; font-size: var(--fs-2xs); font-weight: 700; color: var(--muted); margin-bottom: 0.15rem; }
.tag.dark { position: absolute; top: 0.3rem; left: 0.5rem; color: var(--ink); }
.blk { border: 1.5px solid var(--rule); border-radius: var(--r-sm); padding: 0.3rem 0.5rem; cursor: pointer; transition: all 0.2s; background: var(--paper); }
.blk.on { border-color: var(--chain); background: var(--chain-soft); box-shadow: 0 0 0 3px var(--chain-soft); }
.blk code { font-size: var(--fs-xs) !important; background: none !important; padding: 0 !important; }
.keys { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.05rem 0.8rem; }
.keys span { font-size: var(--fs-2xs); color: var(--ink); }
.keys b { color: var(--chain); }
.keys em { color: var(--muted); font-style: normal; }
.ixs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.4rem; }
.ix { text-align: center; }
.explain { border-left: 6px solid var(--chain); padding: 0.4rem 0 0.4rem 1rem; }
.explain b { font-size: var(--fs-md); display: block; margin-bottom: 0.3rem; }
.explain p { font-size: var(--fs-sm); color: var(--ink-2); margin: 0; }
.ex-enter-active, .ex-leave-active { transition: all 0.18s; }
.ex-enter-from { opacity: 0; transform: translateY(6px); } .ex-leave-to { opacity: 0; }
</style>
