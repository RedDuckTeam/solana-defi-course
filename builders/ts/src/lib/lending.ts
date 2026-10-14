// Over-collateralised lending maths (week 4). Pure functions, no network.
// The market settings are an example market, matching the deck. Real markets publish their own.

export type Market = { maxLtv: number, liqThreshold: number, closeFactor: number, liqBonus: number }
export const EXAMPLE_MARKET: Market = { maxLtv: 0.7, liqThreshold: 0.8, closeFactor: 0.5, liqBonus: 0.05 }

export type Position = { collateral: number, price: number, debt: number }

export const collateralValue = (p: Position) => p.collateral * p.price
export const ltv = (p: Position) => p.debt / collateralValue(p)
export const healthFactor = (p: Position, m = EXAMPLE_MARKET) => (collateralValue(p) * m.liqThreshold) / p.debt
/** The collateral price at which the health factor reaches exactly 1. */
export const liquidationPrice = (p: Position, m = EXAMPLE_MARKET) => p.debt / (p.collateral * m.liqThreshold)
/** How much more can be borrowed before hitting max LTV. */
export const borrowRoom = (p: Position, m = EXAMPLE_MARKET) => Math.max(0, collateralValue(p) * m.maxLtv - p.debt)

export type Liquidation = { repaid: number, seized: number, profit: number, after: Position }

/** One liquidation: a bot repays up to closeFactor of the debt and takes that value plus the bonus in collateral. */
export function liquidate(p: Position, m = EXAMPLE_MARKET): Liquidation | null {
  if (healthFactor(p, m) >= 1) return null
  const repaid = p.debt * m.closeFactor
  const seizedValue = repaid * (1 + m.liqBonus)
  const seized = Math.min(p.collateral, seizedValue / p.price)
  return {
    repaid,
    seized,
    profit: seized * p.price - repaid,
    after: { collateral: p.collateral - seized, price: p.price, debt: p.debt - repaid },
  }
}
