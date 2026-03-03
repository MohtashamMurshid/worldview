export const minutesToMs = (minutes: number) => minutes * 60_000
export const secondsToMs = (seconds: number) => seconds * 1_000

export const subtractWindowMs = (window: '1h' | '6h' | '24h' | '7d') => {
  const now = Date.now()
  switch (window) {
    case '1h':
      return now - 60 * 60_000
    case '6h':
      return now - 6 * 60 * 60_000
    case '24h':
      return now - 24 * 60 * 60_000
    case '7d':
      return now - 7 * 24 * 60 * 60_000
    default:
      return now
  }
}

export const ageMs = (timestamp: number) => Math.max(0, Date.now() - timestamp)
