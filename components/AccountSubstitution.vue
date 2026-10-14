<script setup lang="ts">
// Why "missing account checks" is the classic Solana bug: the caller supplies every account.
withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const nodes = [
  { id: 'tx', x: 10, y: 90, title: 'Transaction', sub: 'lists every account', tone: 'chain' },
  { id: 'signer', x: 230, y: 10, title: 'Signer', sub: 'you', tone: 'ink' },
  { id: 'vault', x: 230, y: 90, title: 'Vault', sub: "the pool's USDC", tone: 'ink' },
  { id: 'feed', x: 230, y: 170, title: 'Price feed', sub: 'the real oracle', tone: 'ink' },
  { id: 'fake', x: 230, y: 255, title: 'Price feed', sub: 'look-alike, attacker-made', tone: 'loss', fake: true, at: 1 },
  { id: 'prog', x: 480, y: 90, title: 'Program', sub: 'no checks', tone: 'chain', badAt: 2, stamp: { at: 2, text: 'ACCEPTED' } },
  { id: 'out', x: 715, y: 90, title: 'Vault drained', sub: 'fake price, real money', tone: 'loss', at: 2 },
  { id: 'safe', x: 715, y: 235, title: 'Program', sub: 'checks owner, address, signer', tone: 'gain', at: 3, stamp: { at: 3, text: 'REJECTED', tone: 'gain' } },
]
const edges = [
  { from: 'tx', to: 'signer', at: 0, tone: 'chain', fromSide: 'r', toSide: 'l' },
  { from: 'tx', to: 'vault', at: 0, tone: 'chain', fromSide: 'r', toSide: 'l' },
  { from: 'tx', to: 'feed', at: 0, tone: 'chain', fromSide: 'r', toSide: 'l' },
  { from: 'signer', to: 'prog', at: 0, tone: 'ink', fromSide: 'r', toSide: 'l' },
  { from: 'vault', to: 'prog', at: 0, tone: 'ink', fromSide: 'r', toSide: 'l' },
  { from: 'feed', to: 'prog', at: 0, tone: 'ink', fromSide: 'r', toSide: 'l' },
  { from: 'fake', to: 'prog', at: 1, tone: 'loss', label: 'swapped in', fromSide: 'r', toSide: 'b' },
  { from: 'prog', to: 'out', at: 2, tone: 'loss' },
  { from: 'fake', to: 'safe', at: 3, tone: 'loss', fromSide: 'r', toSide: 'l' },
]
const captions = [
  'On Solana the transaction hands the program every account it will read or write.',
  'Anyone can build a transaction. An attacker swaps one account for a look-alike.',
  'If the program never checks who owns that account, it trusts the fake.',
  'The fix: check owner, address and signer before reading a single byte.',
]
</script>

<template>
  <FlowReplay :nodes="nodes" :edges="edges" :captions="captions" :step="step" :height="315" />
</template>
