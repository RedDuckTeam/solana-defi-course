<script setup lang="ts">
// A DeFi risk taxonomy you place yourself. Pick a risk, then a cell (likelihood × impact).
// "Show one analyst's view" fills in a reference placement to argue with, not the answer.
import { computed, reactive, ref } from 'vue'

interface Risk { id: string, name: string, cause: string, example: string, fix: string, ref: [number, number] }
const risks: Risk[] = [
  { id: 'code', name: 'Smart-contract bug', cause: 'Code does something its authors did not intend.', example: 'Cashio, Wormhole', fix: 'Audits, deposit caps, bug bounties, time in production.', ref: [1, 2] },
  { id: 'oracle', name: 'Oracle manipulation', cause: 'A price feed follows a market someone can push.', example: 'Mango, Loopscale', fix: 'Time-averaged prices, borrow caps on thin assets.', ref: [1, 2] },
  { id: 'keys', name: 'Key or signer compromise', cause: 'Keys leak, or signers are tricked into signing.', example: 'Drift, Slope', fix: 'Hardware keys, timelocks, simulate before signing.', ref: [1, 2] },
  { id: 'bridge', name: 'Bridge failure', cause: 'Wrapped assets are only as good as the bridge.', example: 'Wormhole', fix: 'Hold native assets; limit bridged exposure.', ref: [0, 2] },
  { id: 'depeg', name: 'Stablecoin depeg', cause: 'Reserves or redemptions come into doubt.', example: 'USDC fell to ~$0.88 in Mar 2023 (SVB)', fix: 'Know the issuer and the reserves; diversify.', ref: [1, 1] },
  { id: 'liq', name: 'Liquidation in a crash', cause: 'Collateral falls past the threshold.', example: 'Week 4 walkthrough', fix: 'Borrow less; watch the health factor.', ref: [2, 1] },
  { id: 'il', name: 'Impermanent loss', cause: 'Pool prices move away from your entry.', example: 'Week 3 table', fix: 'Correlated pairs; fees that outrun it.', ref: [2, 0] },
  { id: 'crunch', name: 'Withdrawal crunch', cause: 'Utilization near 100%: lenders cannot exit.', example: 'Lending markets in stress', fix: 'Check utilization before depositing.', ref: [1, 1] },
  { id: 'gov', name: 'Governance attack', cause: 'Votes bought or borrowed to pass a bad proposal.', example: 'Beanstalk, Ethereum, Apr 2022', fix: 'Timelocks, vote delays, quorum rules.', ref: [0, 2] },
  { id: 'supply', name: 'Supply-chain compromise', cause: 'A dependency ships malicious code.', example: '@solana/web3.js 1.95.6–7', fix: 'Pin versions, review updates, keep keys out of code.', ref: [0, 1] },
  { id: 'rug', name: 'Rug pull or insider', cause: 'The team can mint, freeze or drain.', example: 'Memecoin launches', fix: 'Check authorities and holders before buying.', ref: [2, 2] },
  { id: 'reg', name: 'Regulatory change', cause: 'Rules change who can access what.', example: 'Local rules on digital assets', fix: 'Know your jurisdiction; avoid one point of access.', ref: [1, 1] },
]
const placed = reactive<Record<string, [number, number] | undefined>>({})
const sel = ref<string>('oracle')
const levels = ['Low', 'Medium', 'High']
const place = (l: number, i: number) => { placed[sel.value] = [l, i]; const next = risks.find(r => !placed[r.id]); if (next) sel.value = next.id }
const fillRef = () => risks.forEach(r => (placed[r.id] = r.ref))
const clear = () => risks.forEach(r => (placed[r.id] = undefined))
const inCell = (l: number, i: number) => risks.filter(r => placed[r.id]?.[0] === l && placed[r.id]?.[1] === i)
const heat = (l: number, i: number) => ['g', 'g', 'w', 'g', 'w', 'l', 'w', 'l', 'l'][l * 3 + i]
const cur = computed(() => risks.find(r => r.id === sel.value)!)
</script>

<template>
  <div class="rm">
    <div class="list">
      <button v-for="r in risks" :key="r.id" class="rk" :class="{ sel: sel === r.id, done: placed[r.id] }" @click="sel = r.id">{{ r.name }}</button>
      <div class="acts">
        <button class="btn" @click="fillRef">Show one analyst's view</button>
        <button class="btn" @click="clear">Clear</button>
      </div>
    </div>
    <div class="right">
      <div class="grid">
        <span class="ylab">Likelihood</span>
        <template v-for="l in [2, 1, 0]" :key="l">
          <span class="lv">{{ levels[l] }}</span>
          <button v-for="i in [0, 1, 2]" :key="i" class="cell" :class="heat(l, i)" :aria-label="`Likelihood ${levels[l]}, impact ${levels[i]}`" @click="place(l, i)">
            <TransitionGroup name="pin">
              <span v-for="r in inCell(l, i)" :key="r.id" class="pin" :class="{ sel: sel === r.id }" @click.stop="sel = r.id">{{ r.name }}</span>
            </TransitionGroup>
          </button>
        </template>
        <span />
        <span v-for="i in [0, 1, 2]" :key="i" class="lv c">{{ levels[i] }}</span>
        <span /><span class="xlab">Impact</span>
      </div>
      <div class="detail">
        <b>{{ cur.name }}</b>
        <p><span>Cause</span>{{ cur.cause }}</p>
        <p><span>Example</span>{{ cur.example }}</p>
        <p><span>Mitigation</span>{{ cur.fix }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rm { display: grid; grid-template-columns: 210px minmax(0, 1fr); gap: 1rem; }
.list { display: flex; flex-direction: column; gap: 0.2rem; }
.rk { text-align: left; font-family: var(--font); font-size: var(--fs-xs); font-weight: 650; padding: 0.22rem 0.5rem; border: 1.5px solid var(--rule); border-radius: var(--r-sm); background: #fff; color: var(--ink); cursor: pointer; }
.rk.done { border-color: var(--muted); color: var(--muted); }
.rk.sel { border-color: var(--chain); background: var(--chain-soft); color: var(--ink); }
.acts { display: flex; gap: 0.3rem; margin-top: 0.3rem; flex-wrap: wrap; }
.acts .btn { font-size: var(--fs-2xs); padding: 0.2em 0.5em; }
.right { display: grid; grid-template-columns: minmax(0, 1fr) 190px; gap: 0.8rem; align-items: start; }
.grid { display: grid; grid-template-columns: 54px repeat(3, minmax(0, 1fr)); grid-template-rows: auto repeat(3, 92px) auto auto; gap: 4px; }
.ylab { grid-column: 1 / -1; font-size: var(--fs-2xs); color: var(--muted); }
.xlab { grid-column: 2 / -1; text-align: center; font-size: var(--fs-2xs); color: var(--muted); }
.lv { font-size: var(--fs-2xs); color: var(--ink-2); align-self: center; }
.lv.c { text-align: center; }
.cell { border: 0; border-radius: 6px; padding: 4px; display: flex; flex-wrap: wrap; align-content: flex-start; gap: 3px; cursor: pointer; overflow: hidden; }
.cell:hover { outline: 2px solid var(--chain); }
.cell.g { background: var(--gain-soft); } .cell.w { background: var(--warn-soft); } .cell.l { background: var(--loss-soft); }
.pin { font-size: var(--fs-2xs); font-weight: 650; background: #fff; border: 1px solid var(--ink); border-radius: 3px; padding: 0 4px; line-height: 1.5; color: var(--ink); }
.pin.sel { border-color: var(--chain); background: var(--chain); color: #fff; }
.pin-enter-active { transition: all 0.35s cubic-bezier(.3,1.6,.5,1); } .pin-enter-from { opacity: 0; transform: scale(0.4); }
.detail { border-left: 4px solid var(--chain); padding-left: 0.7rem; }
.detail b { font-size: var(--fs-base); }
.detail p { margin: 0.4rem 0 0; font-size: var(--fs-xs); line-height: 1.3; }
.detail span { display: block; font-size: var(--fs-2xs); color: var(--muted); }
</style>
