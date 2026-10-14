<script setup lang="ts">
// @solana/web3.js, 2 Dec 2024: a hijacked npm publish account shipped two backdoored versions.
withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const nodes = [
  { id: 'npm', x: 10, y: 70, title: 'npm publish account', sub: "maintainer's access", tone: 'ink', badAt: 1 },
  { id: 'atk', x: 10, y: 225, title: 'Attacker', sub: 'takes over the account', tone: 'loss', at: 1 },
  { id: 'pkg', x: 235, y: 145, w: 185, title: '@solana/web3.js', sub: '1.95.6 and 1.95.7, backdoored', tone: 'loss', at: 2 },
  { id: 'apps', x: 480, y: 70, title: 'Bots and backends', sub: 'update, load private keys', tone: 'ink', at: 3, badAt: 4 },
  { id: 'keys', x: 715, y: 70, title: 'Keys sent out', sub: 'funds drained', tone: 'loss', at: 4 },
  { id: 'wallets', x: 235, y: 255, title: 'Phantom, Solflare', sub: 'not affected', tone: 'gain', at: 5 },
  { id: 'fix', x: 715, y: 225, title: '1.95.8', sub: 'clean, ~5 hours later', tone: 'gain', at: 5 },
]
const edges = [
  { from: 'atk', to: 'npm', at: 1, label: 'compromise', tone: 'loss' },
  { from: 'npm', to: 'pkg', at: 2, label: 'publish', tone: 'loss' },
  { from: 'pkg', to: 'apps', at: 3, label: 'npm install', tone: 'loss', fromSide: 'r', toSide: 'l' },
  { from: 'apps', to: 'keys', at: 4, tone: 'loss' },
  { from: 'pkg', to: 'fix', at: 5, label: 'pulled, replaced', tone: 'gain' },
]
const captions = [
  'Every app runs code it did not write. web3.js was the standard Solana JavaScript library.',
  '2 Dec 2024. An attacker gains control of a publish account on npm.',
  'They ship versions 1.95.6 and 1.95.7 with a hidden backdoor.',
  'Projects that update pull the bad version in automatically.',
  'Anything that loaded a private key in code sent it to the attacker.',
  'About five hours later the bad versions are gone. Wallet apps were not hit.',
]
const tally = [{ at: 4, label: 'lost', value: '~$160–190K' }]
</script>

<template>
  <FlowReplay :nodes="nodes" :edges="edges" :captions="captions" :tally="tally" :step="step" :height="320" />
</template>
