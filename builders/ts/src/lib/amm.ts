// Constant-product AMM maths (week 3). Pure functions, no network.
// Uses numbers for teaching clarity. Real programs use integers (u64/u128) and round down.

export type Pool = { x: number, y: number }

/** Output of selling `dx` of X into the pool, with an LP fee in basis points (30 = 0.3%). */
export function swapOut(pool: Pool, dx: number, feeBps = 0): number {
  if (dx <= 0) return 0
  const dxAfterFee = dx * (1 - feeBps / 10_000)
  const k = pool.x * pool.y
  return pool.y - k / (pool.x + dxAfterFee)
}

/** The pool after the swap. The full dx stays in the pool, so k grows when there is a fee. */
export function poolAfter(pool: Pool, dx: number, feeBps = 0): Pool {
  return { x: pool.x + dx, y: pool.y - swapOut(pool, dx, feeBps) }
}

/** Spot price of X in Y before a trade. */
export const spotPrice = (pool: Pool) => pool.y / pool.x

/** How much worse the trader's average price is than the spot price, as a fraction. */
export function priceImpact(pool: Pool, dx: number, feeBps = 0): number {
  const avg = swapOut(pool, dx, feeBps) / dx
  return 1 - avg / spotPrice(pool)
}

/** A deposit's share of the pool after adding (dx, dy) at the current ratio. */
export function lpShare(pool: Pool, dx: number): number {
  return dx / (pool.x + dx)
}

/** Impermanent loss for a 50/50 constant-product position when the price ratio moves by r. */
export const impermanentLoss = (r: number) => (2 * Math.sqrt(r)) / (1 + r) - 1

/** Value of holding vs being an LP, starting from `x` tokens of A at price p0 and the matching amount of B. */
export function holdVsLp(tokensA: number, p0: number, r: number) {
  const startValue = 2 * tokensA * p0
  const p1 = p0 * r
  const hold = tokensA * p1 + tokensA * p0
  const lp = startValue * Math.sqrt(r)
  return { hold, lp, loss: lp / hold - 1 }
}
