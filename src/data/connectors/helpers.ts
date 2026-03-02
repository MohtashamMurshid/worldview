export const randomBetween = (min: number, max: number) =>
  min + Math.random() * (max - min)

export const cycleCoordinate = (value: number, min: number, max: number): number => {
  if (value > max) return min + (value - max)
  if (value < min) return max - (min - value)
  return value
}
