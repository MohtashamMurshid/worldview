import { BaseConnector } from './BaseConnector'
import type { ConnectorResult } from '../orchestrator/types'
import type { WorldEntity } from '../../types/entities'

interface UsgsFeatureCollection {
  features: Array<{
    id: string
    properties: {
      mag: number
      place: string
      time: number
      title: string
      url: string
    }
    geometry: {
      coordinates: [number, number, number]
    }
  }>
}

const FALLBACK_EVENTS = [
  {
    id: 'seismic-fallback-1',
    mag: 5.6,
    place: 'South Pacific Ocean',
    timeOffsetMs: 1000 * 60 * 40,
    lon: -138.6,
    lat: -19.2,
    depthKm: 18,
  },
  {
    id: 'seismic-fallback-2',
    mag: 4.9,
    place: 'Central Chile',
    timeOffsetMs: 1000 * 60 * 130,
    lon: -71.4,
    lat: -30.8,
    depthKm: 26,
  },
]

export class SeismicConnector extends BaseConnector {
  id = 'seismic'
  source = 'usgs'
  pollMs = 90_000
  protected staleThresholdMs = 2 * 60 * 60_000

  async run(): Promise<ConnectorResult> {
    const started = performance.now()

    try {
      const response = await fetch(
        'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
      )
      if (!response.ok) {
        throw new Error(`USGS response ${response.status}`)
      }
      const json = (await response.json()) as UsgsFeatureCollection
      const entities = this.withQuality(
        json.features.slice(0, 140).map<Omit<WorldEntity, 'quality'>>((feature) => ({
          entityType: 'seismic_event',
          source: this.source,
          entityId: feature.id,
          label: feature.properties.title,
          position: {
            lon: feature.geometry.coordinates[0],
            lat: feature.geometry.coordinates[1],
            alt: 0,
          },
          timestamp: feature.properties.time,
          metadata: {
            magnitude: feature.properties.mag,
            place: feature.properties.place,
            depthKm: feature.geometry.coordinates[2],
            eventUrl: feature.properties.url,
          },
        })),
        'live',
      )
      return {
        entities,
        health: this.buildHealth({
          status: 'ok',
          latencyMs: Math.round(performance.now() - started),
          recordsIn: entities.length,
          lastUpdatedAt: Date.now(),
        }),
      }
    } catch (error) {
      const now = Date.now()
      const entities = this.withQuality(
        FALLBACK_EVENTS.map<Omit<WorldEntity, 'quality'>>((event) => ({
          entityType: 'seismic_event',
          source: this.source,
          entityId: event.id,
          label: `${event.mag.toFixed(1)}M - ${event.place}`,
          position: {
            lat: event.lat,
            lon: event.lon,
            alt: 0,
          },
          timestamp: now - event.timeOffsetMs,
          metadata: {
            magnitude: event.mag,
            place: event.place,
            depthKm: event.depthKm,
            eventUrl: 'https://earthquake.usgs.gov/',
          },
        })),
        'fallback',
      )
      return {
        entities,
        health: this.buildHealth({
          status: 'degraded',
          latencyMs: Math.round(performance.now() - started),
          recordsIn: entities.length,
          lastUpdatedAt: now,
          error:
            error instanceof Error
              ? `USGS unavailable: ${error.message}`
              : 'USGS unavailable; using fallback seismic events.',
        }),
      }
    }
  }
}
