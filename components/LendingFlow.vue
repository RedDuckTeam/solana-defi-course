<script setup lang="ts">
// Money flow through a lending pool, one arrow per click.
// 1 lenders supply USDC, 2 a borrower locks SOL as collateral, 3 borrows USDC,
// 4 interest flows back to lenders, 5 the protocol keeps a reserve cut, 6 a liquidator watches.
withDefaults(defineProps<{ step?: number }>(), { step: 99 })
</script>

<template>
  <svg viewBox="0 0 860 330" width="860" height="330" class="lf" role="img" aria-label="Lending pool money flow">
    <defs>
      <marker id="lfa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="context-stroke" />
      </marker>
    </defs>

    <g class="node" :class="{ on: step >= 1 }"><rect x="20" y="120" width="170" height="80" rx="12" /><text x="105" y="155">Lenders</text><text x="105" y="178" class="s">supply USDC</text></g>
    <g class="node pool on"><rect x="340" y="100" width="180" height="120" rx="14" /><text x="430" y="150">Lending pool</text><text x="430" y="174" class="s">a program, not a bank</text></g>
    <g class="node" :class="{ on: step >= 2 }"><rect x="670" y="120" width="170" height="80" rx="12" /><text x="755" y="155">Borrower</text><text x="755" y="178" class="s">has SOL, wants USDC</text></g>
    <g class="node prot" :class="{ on: step >= 5 }"><rect x="350" y="262" width="160" height="56" rx="10" /><text x="430" y="296">Protocol reserve</text></g>
    <g class="node liq" :class="{ on: step >= 6 }"><rect x="350" y="8" width="160" height="56" rx="10" /><text x="430" y="42">Liquidator bot</text></g>

    <g :class="['ar', 'chain', { on: step >= 1 }]"><path d="M190,140 L338,140" marker-end="url(#lfa)" /><text x="264" y="130">USDC</text></g>
    <g :class="['ar', 'ink', { on: step >= 2 }]"><path d="M670,140 L522,140" marker-end="url(#lfa)" /><text x="596" y="130">SOL locked</text></g>
    <g :class="['ar', 'chain', { on: step >= 3 }]"><path d="M522,182 L670,182" marker-end="url(#lfa)" /><text x="596" y="200">USDC loan</text></g>
    <g :class="['ar', 'gain', { on: step >= 4 }]"><path d="M338,182 L190,182" marker-end="url(#lfa)" /><text x="264" y="200">interest</text></g>
    <g :class="['ar', 'gain', { on: step >= 5 }]"><path d="M430,222 L430,260" marker-end="url(#lfa)" /><text x="440" y="246" class="l">reserve cut</text></g>
    <g :class="['ar', 'loss', { on: step >= 6 }]"><path d="M430,64 L430,98" marker-end="url(#lfa)" stroke-dasharray="5 4" /><text x="440" y="86" class="l">watches every position</text></g>
  </svg>
</template>

<style scoped>
.lf { display: block; margin: 0 auto; }
.node { opacity: 0.12; transition: opacity 0.5s; }
.node.on { opacity: 1; }
.node rect { fill: #fff; stroke: var(--ink); stroke-width: 2; }
.node.pool rect { fill: var(--chain-soft); stroke: var(--chain); stroke-width: 2.5; }
.node.prot rect { fill: var(--gain-soft); stroke: var(--gain); }
.node.liq rect { fill: var(--loss-soft); stroke: var(--loss); }
.node text { text-anchor: middle; font-family: var(--font); font-weight: 750; font-size: var(--fs-md); fill: var(--ink); }
.node text.s { font-size: var(--fs-xs); font-weight: 500; fill: var(--ink-2); }
.ar { opacity: 0; transition: opacity 0.5s; }
.ar.on { opacity: 1; }
.ar path { fill: none; stroke-width: 3; stroke-dashoffset: 0; }
.ar.on path:not([stroke-dasharray]) { stroke-dasharray: 160; animation: draw 0.7s ease-out; }
.ar text { font-family: var(--font); font-size: var(--fs-xs); font-weight: 700; text-anchor: middle; }
.ar text.l { text-anchor: start; }
.chain path { stroke: var(--chain); } .chain text { fill: var(--chain); }
.ink path { stroke: var(--ink); } .ink text { fill: var(--ink); }
.gain path { stroke: var(--gain); } .gain text { fill: var(--gain); }
.loss path { stroke: var(--loss); } .loss text { fill: var(--loss); }
@keyframes draw { from { stroke-dashoffset: 160; } to { stroke-dashoffset: 0; } }
</style>
