<script setup lang="ts">
// The EVM to Solana translation table as flip cards.
// Click a card (or "Flip all") to turn the Ethereum term into its Solana equivalent.
import { reactive } from 'vue'

const rows = [
  { evm: 'MetaMask', sol: 'Phantom, Solflare, Backpack', why: 'All speak the wallet standard, so any Solana app works with any of them.' },
  { evm: 'Sepolia testnet', sol: 'Devnet', why: 'api.devnet.solana.com. Solana "testnet" is for validators, not you.' },
  { evm: 'Etherscan', sol: 'Orb, Solscan, explorer.solana.com', why: 'Add ?cluster=devnet to the URL to see devnet.' },
  { evm: 'ERC-20 contract', sol: 'Mint account + token accounts', why: 'One shared token program. Your balance sits in your own token account.' },
  { evm: 'Gas', sol: 'Base fee + priority fee + rent', why: 'Fractions of a cent. Rent is a refundable deposit for storage.' },
  { evm: 'Uniswap', sol: 'Raydium, Orca, Meteora + Jupiter', why: 'Uniswap has no pools on Solana. Its app swaps Solana tokens through Jupiter (since Oct 2025).' },
  { evm: 'Aave, Compound', sol: 'Kamino, Jupiter Lend, Save, Project 0', why: 'Same mechanics: collateral, LTV, liquidation.' },
  { evm: 'MakerDAO / DAI', sol: 'USDC, USDT, PYUSD, USDG', why: 'Solana money is mostly fiat-backed stablecoins.' },
  { evm: 'Chainlink', sol: 'Pyth, Switchboard', why: 'Pyth is pull: the app fetches a signed price and posts it in the same transaction.' },
  { evm: 'Solidity + Foundry', sol: 'Rust + Anchor + LiteSVM / Surfpool', why: 'Anchor 1.x ships Surfpool as the default test validator.' },
  { evm: 'Reentrancy', sol: 'Missing account checks', why: 'Every account is an input. "Is this the real account?" is the core security question.' },
]
const flipped = reactive(rows.map(() => false))
const all = () => { const v = !flipped.every(Boolean); flipped.forEach((_, i) => (flipped[i] = v)) }
</script>

<template>
  <div class="map">
    <div class="grid">
      <button v-for="(r, i) in rows" :key="r.evm" class="card" :class="{ on: flipped[i] }" :aria-pressed="flipped[i]" @click="flipped[i] = !flipped[i]">
        <span class="face front"><small>Ethereum</small>{{ r.evm }}</span>
        <span class="face back"><small>Solana</small>{{ r.sol }}<em>{{ r.why }}</em></span>
      </button>
    </div>
    <button class="btn flipall" @click="all">Flip all</button>
  </div>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.5rem; }
.card { position: relative; height: 92px; perspective: 800px; border: 0; background: none; padding: 0; cursor: pointer; font-family: var(--font); }
.face {
  position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; gap: 0.15rem;
  padding: 0.4rem 0.7rem; border-radius: var(--r-md); border: 1.5px solid var(--ink); text-align: left;
  backface-visibility: hidden; transition: transform 0.55s cubic-bezier(.3,.7,.3,1.2);
  font-size: var(--fs-base); font-weight: 700; font-stretch: 108%;
}
.front { background: #fff; color: var(--ink); }
.back { background: var(--chain); color: #fff; border-color: var(--chain); transform: rotateY(180deg); font-size: var(--fs-sm); }
.on .front { transform: rotateY(-180deg); }
.on .back { transform: rotateY(0); }
small { font-size: var(--fs-2xs); font-weight: 500; opacity: 0.75; }
em { font-style: normal; font-weight: 400; font-size: var(--fs-2xs); line-height: 1.3; opacity: 0.92; }
.flipall { margin-top: 0.7rem; }
</style>
