export type WorldEntityType =
  | 'satellite'
  | 'aircraft_commercial'
  | 'aircraft_military'
  | 'cctv_camera'
  | 'seismic_event'
  | 'traffic_agent'
  | 'landmark'
  | 'news_item'

export type FeedHealthStatus = 'ok' | 'degraded' | 'down' | 'idle'

export interface GeoPosition {
  lat: number
  lon: number
  alt?: number
}

export interface EntityQuality {
  freshnessMs: number
  confidence: number
  availability: 'live' | 'fallback'
  stale: boolean
}

export interface WorldEntity {
  entityType: WorldEntityType
  source: string
  entityId: string
  label: string
  position: GeoPosition
  heading?: number
  speed?: number
  status?: string
  timestamp: number
  metadata: Record<string, unknown>
  quality: EntityQuality
}

export interface FeedHealth {
  source: string
  status: FeedHealthStatus
  latencyMs: number
  recordsIn: number
  lastUpdatedAt: number | null
  error?: string
}

export interface NewsFilter {
  radiusKm: number
  timeWindow: '1h' | '6h' | '24h' | '7d'
  category: 'all' | 'disaster' | 'transport' | 'conflict' | 'infrastructure' | 'weather' | 'general'
}

export interface SeismicFilter {
  timeWindow: '1h' | '24h' | '7d'
}

export interface FlightFilter {
  callsign: string
  altitudeRange: [number, number]
  speedRange: [number, number]
}
