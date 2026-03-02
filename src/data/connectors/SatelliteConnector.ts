import { SATELLITE_SEEDS } from '../static/satellites'
import { BaseConnector } from './BaseConnector'
import type { ConnectorResult } from '../orchestrator/types'
import type { GeoPosition, WorldEntity } from '../../types/entities'

interface IssResponse {
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  timestamp: number
  name: string
  id: number
}

const buildOrbitPoint = (
  nowSeconds: number,
  inclination: number,
  phaseOffset: number,
  altitudeKm: number,
  offset: number,
): GeoPosition => {
  const periodSeconds = 92 * 60
  const phase = ((nowSeconds + offset) / periodSeconds + phaseOffset) * 2 * Math.PI
  const lat = Math.sin(phase) * inclination
  const lon = ((((phase * 180) / Math.PI) * 3.8 + 180) % 360) - 180
  return {
    lat,
    lon,
    alt: altitudeKm * 1000,
  }
}

export class SatelliteConnector extends BaseConnector {
  id = 'satellites'
  source = 'sat-telemetry'
  pollMs = 6_000

  async run(): Promise<ConnectorResult> {
    const started = performance.now()
    try {
      const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544')
      if (!response.ok) {
        throw new Error(`ISS response ${response.status}`)
      }
      const payload = (await response.json()) as IssResponse
      const now = Date.now()
      const orbitPath = Array.from({ length: 32 }).map((_, index) =>
        buildOrbitPoint(
          payload.timestamp,
          51.6,
          0.1,
          payload.altitude,
          (index - 16) * 120,
        ),
      )
      const issEntity: Omit<WorldEntity, 'quality'> = {
        entityType: 'satellite',
        source: this.source,
        entityId: `iss-${payload.id}`,
        label: payload.name,
        position: {
          lat: payload.latitude,
          lon: payload.longitude,
          alt: payload.altitude * 1000,
        },
        speed: payload.velocity / 1000,
        status: 'active',
        timestamp: now,
        metadata: {
          noradId: payload.id,
          orbitPath,
          altitudeKm: payload.altitude,
          velocityKmh: payload.velocity,
        },
      }
      const entities = this.withQuality([issEntity], 'live')
      return {
        entities,
        health: this.buildHealth({
          status: 'ok',
          latencyMs: Math.round(performance.now() - started),
          recordsIn: entities.length,
          lastUpdatedAt: now,
        }),
      }
    } catch (error) {
      const nowSeconds = Date.now() / 1000
      const now = Date.now()

      const entities = this.withQuality(
        SATELLITE_SEEDS.map<Omit<WorldEntity, 'quality'>>((satellite) => {
          const position = buildOrbitPoint(
            nowSeconds,
            satellite.inclination,
            satellite.phaseOffset,
            satellite.altitudeKm,
            0,
          )
          const orbitPath = Array.from({ length: 36 }).map((_, index) =>
            buildOrbitPoint(
              nowSeconds,
              satellite.inclination,
              satellite.phaseOffset,
              satellite.altitudeKm,
              (index - 18) * 150,
            ),
          )

          return {
            entityType: 'satellite',
            source: this.source,
            entityId: satellite.id,
            label: satellite.name,
            position,
            speed: satellite.speedKms,
            status: 'active',
            timestamp: now,
            metadata: {
              inclination: satellite.inclination,
              altitudeKm: satellite.altitudeKm,
              velocityKms: satellite.speedKms,
              orbitPath,
            },
          }
        }),
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
              ? `Satellite live feed unavailable: ${error.message}`
              : 'Satellite live feed unavailable; using deterministic orbital model.',
        }),
      }
    }
  }
}
