export const isStale = (timestamp: number, staleThresholdMs: number) =>
  Date.now() - timestamp > staleThresholdMs

export const freshnessMs = (timestamp: number) => Math.max(0, Date.now() - timestamp)
