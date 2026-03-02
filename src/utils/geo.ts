import type { GeoPosition } from '../types/entities'

const EARTH_RADIUS_KM = 6371

const toRad = (value: number) => (value * Math.PI) / 180

export const distanceKm = (a: GeoPosition, b: GeoPosition) => {
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)

  const haversine =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(haversine))
}

export const lerp = (start: number, end: number, t: number) => start + (end - start) * t

export const interpolatePath = (
  points: GeoPosition[],
  t: number,
): GeoPosition | null => {
  if (points.length === 0) return null
  if (points.length === 1) return points[0]

  const bounded = Math.max(0, Math.min(0.999, t))
  const totalSegments = points.length - 1
  const segmentFloat = bounded * totalSegments
  const segmentIndex = Math.floor(segmentFloat)
  const segmentT = segmentFloat - segmentIndex
  const from = points[segmentIndex]
  const to = points[Math.min(segmentIndex + 1, points.length - 1)]

  return {
    lat: lerp(from.lat, to.lat, segmentT),
    lon: lerp(from.lon, to.lon, segmentT),
    alt: lerp(from.alt ?? 0, to.alt ?? 0, segmentT),
  }
}
