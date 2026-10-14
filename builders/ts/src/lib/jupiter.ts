// Pulling a readable route out of a Jupiter quote response (week 1).
// API shapes change. Read the full JSON first; this handles the common shapes defensively.

export type Leg = { label: string, percent?: number }

export function routeLegs(order: unknown): Leg[] {
  const o = order as Record<string, any>
  const plan: any[] = o?.routePlan ?? o?.quote?.routePlan ?? o?.route?.routePlan ?? []
  return plan.map(step => ({
    label: step?.swapInfo?.label ?? step?.label ?? step?.swapInfo?.ammKey ?? 'unknown venue',
    percent: typeof step?.percent === 'number' ? step.percent : typeof step?.bps === 'number' ? step.bps / 100 : undefined,
  }))
}
