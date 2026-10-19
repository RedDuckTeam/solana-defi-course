<script setup lang="ts">
// Where a wallet's balance of one token lives: the Associated Token Account.
// Its address is a PDA of the ATA program, seeds [wallet, token program, mint],
// found in the browser with the same search as find_program_address. Nothing is sent anywhere.
import bs58 from 'bs58'
import nacl from 'tweetnacl'
import { computed, ref } from 'vue'

const ATA_PROGRAM = bs58.decode('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')
const PROGRAMS = {
  'SPL Token': 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  'Token-2022': 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
}
type Program = keyof typeof PROGRAMS

const wallet = ref('FMRdS88hFvmndwhPdJzQREohZ967ePQKC71S8FcGA7ci')
const DEVNET_USDC = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
const mint = ref(DEVNET_USDC)
const program = ref<Program>('SPL Token')

// SHA-256 by hand because crypto.subtle is missing on plain http, which is how
// mentees on the same Wi-Fi open the deck (npm run teach).
// K and H0 are the fractional bits of the cube and square roots of the first primes (FIPS 180-4).
const K: number[] = []
const H0: number[] = []
for (let n = 2; K.length < 64; n++) {
  if (!Array.from({ length: n - 2 }, (_, i) => i + 2).every(d => n % d)) continue
  const frac = (x: number) => ((x - Math.floor(x)) * 2 ** 32) >>> 0
  if (H0.length < 8) H0.push(frac(n ** (1 / 2)))
  K.push(frac(n ** (1 / 3)))
}
const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n))

function sha256(data: Uint8Array): Uint8Array {
  const block = new Uint8Array(Math.ceil((data.length + 9) / 64) * 64)
  block.set(data)
  block[data.length] = 0x80
  const view = new DataView(block.buffer)
  view.setUint32(block.length - 4, data.length * 8)
  const h = [...H0]
  const w = new Uint32Array(64)
  for (let off = 0; off < block.length; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = view.getUint32(off + i * 4)
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3)
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10)
      w[i] = w[i - 16] + s0 + w[i - 7] + s1
    }
    let [a, b, c, d, e, f, g, k] = h
    for (let i = 0; i < 64; i++) {
      const t1 = (k + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0
      const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0
      k = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0
    }
    ;[a, b, c, d, e, f, g, k].forEach((x, i) => { h[i] = (h[i] + x) | 0 })
  }
  const out = new DataView(new ArrayBuffer(32))
  h.forEach((x, i) => out.setUint32(i * 4, x >>> 0))
  return new Uint8Array(out.buffer)
}

const P = 2n ** 255n - 19n
const mod = (a: bigint) => ((a % P) + P) % P
function modPow(base: bigint, exp: bigint): bigint {
  let r = 1n
  base = mod(base)
  for (; exp > 0n; exp >>= 1n) {
    if (exp & 1n) r = (r * base) % P
    base = (base * base) % P
  }
  return r
}
const D = mod(-121665n * modPow(121666n, P - 2n))

// A point is on Ed25519 iff x² = (y² - 1) / (d·y² + 1) is a square mod p (Euler's criterion).
function isOnCurve(bytes: Uint8Array): boolean {
  let y = 0n
  for (let i = 31; i >= 0; i--) y = (y << 8n) | BigInt(bytes[i])
  y &= (1n << 255n) - 1n
  const y2 = mod(y * y)
  const x2 = mod((y2 - 1n) * modPow(D * y2 + 1n, P - 2n))
  return modPow(x2, (P - 1n) / 2n) <= 1n
}

const MARKER = new TextEncoder().encode('ProgramDerivedAddress')
function findProgramAddress(seeds: Uint8Array[], programId: Uint8Array) {
  for (let bump = 255; bump >= 0; bump--) {
    const hash = sha256(Uint8Array.from([...seeds, [bump], programId, MARKER].flatMap(s => [...s])))
    if (!isOnCurve(hash)) return { address: bs58.encode(hash), bump }
  }
  throw new Error('No bump gives an off-curve address')
}

function decode(text: string): Uint8Array | null {
  // 32 bytes never need more than 44 characters; this also stops huge pastes.
  if (text.length > 44) return null
  try {
    const bytes = bs58.decode(text)
    return bytes.length === 32 ? bytes : null
  } catch {
    return null
  }
}

const walletBytes = computed(() => decode(wallet.value.trim()))
const mintBytes = computed(() => decode(mint.value.trim()))
const ata = computed(() => walletBytes.value && mintBytes.value
  ? findProgramAddress([walletBytes.value, bs58.decode(PROGRAMS[program.value]), mintBytes.value], ATA_PROGRAM)
  : null)

function newWallet() { wallet.value = bs58.encode(nacl.sign.keyPair().publicKey) }
</script>

<template>
  <div class="ata widget">
    <div class="col">
      <div class="field">
        <div class="head"><label>Wallet (owner)</label><button @click="newWallet">New wallet</button></div>
        <input v-model="wallet" type="text" aria-label="Wallet address" spellcheck="false" :class="{ invalid: !walletBytes }" />
      </div>
      <div class="field">
        <label>Mint <span v-if="mint.trim() === DEVNET_USDC" class="muted">Circle's devnet USDC</span></label>
        <input v-model="mint" type="text" aria-label="Mint address" spellcheck="false" :class="{ invalid: !mintBytes }" />
      </div>
      <div class="field">
        <label>Token program</label>
        <div class="toggle" role="group" aria-label="Token program">
          <button v-for="(_, name) in PROGRAMS" :key="name" :class="{ on: program === name }" :aria-pressed="program === name" @click="program = name">{{ name }}</button>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="field">
        <label>Token account (ATA)</label>
        <code class="val" :class="{ bad: !ata }" aria-live="polite">{{ ata ? ata.address : 'Not a valid address. Paste 32 bytes in base58.' }}</code>
      </div>
      <p v-if="ata" class="fs-xs">Bump {{ ata.bump }}: off the curve, so no secret key exists. Only the program can sign for it.</p>
      <p class="fs-xs ink-2">Same wallet, same mint, other program: a different address.</p>
      <p class="fs-2xs muted">Seeds: wallet, token program, mint. Computed in your browser. Based on a PLGRND flow (plgrnd.io).</p>
    </div>
  </div>
</template>

<style scoped>
.ata { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.4rem; }
.col { display: grid; gap: 0.6rem; align-content: start; }
.col p { margin: 0; line-height: 1.35; }
.field { display: grid; gap: 0.2rem; }
.field label, .head { display: flex; justify-content: space-between; align-items: baseline; }
.head button { font-size: var(--fs-2xs); padding: 0.1em 0.6em; }
.field label span { font-size: var(--fs-2xs); }
.widget input.invalid { border-color: var(--loss); background: var(--loss-soft); }
.toggle { display: flex; gap: 0.4rem; }
.toggle button.on { background: var(--chain); border-color: var(--chain); color: #fff; }
.val { display: block; font-family: var(--mono); font-size: var(--fs-sm) !important; background: var(--chain-soft) !important; color: var(--chain) !important; padding: calc(0.3em + 1.5px) 0.6em !important; border-radius: var(--r-sm); word-break: break-all; }
.val.bad { background: var(--loss-soft) !important; color: var(--loss) !important; font-family: var(--font); }
</style>
