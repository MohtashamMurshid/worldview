import { BaseConnector } from './BaseConnector'
import { MILITARY_FLIGHT_SEEDS } from '../static/flights'
import { cycleCoordinate, randomBetween } from './helpers'
import type { ConnectorResult } from '../orchestrator/types'
import type { WorldEntity } from '../../types/entities'

interface AdsbAircraft {
  hex: string
  call?: string
  lat?: number
  lon?: number
  alt_baro?: number
  gs?: number
  track?: number
  type?: string
}

interface AdsbResponse {
  now: number
  ac: AdsbAircraft[]
}

export class AdsbConnector extends BaseConnector {
  id = 'flights-military'
  source = 'adsbexchange'
  pollMs = 14_000

  private fallbackPositions = Object.fromEntries(
    MILITARY_FLIGHT_SEEDS.map((seed) => [seed.id, { ...seed.position }]),
  )

  async run(): Promise<ConnectorResult> {
    const apiKey = import.meta.env.VITE_ADSB_API_KEY as string | undefined
    const started = performance.now()

    if (apiKey) {
      try {
        const response = await fetch('https://api.adsbexchange.com/v2/lat/-89/89/lon/-179/179/', {
          headers: {
            'api-auth': apiKey,
          },
        })
        if (!response.ok) {
          throw new Error(`ADS-B response ${response.status}`)
        }
        const json = (await response.json()) as AdsbResponse
        const entities = this.withQuality(
          (json.ac ?? [])
            .filter((flight) => flight.lat != null && flight.lon != null)
            .slice(0, 120)
            .map<Omit<WorldEntity, 'quality'>>((flight) => ({
              entityType: 'aircraft_military',
              source: this.source,
              entityId: flight.hex,
              label: (flight.call ?? flight.hex).trim(),
              position: {
                lat: flight.lat ?? 0,
                lon: flight.lon ?? 0,
                alt: flight.alt_baro ? flight.alt_baro * 0.3048 : undefined,
              },
              heading: flight.track,
              speed: flight.gs,
              status: 'airborne',
              timestamp: Date.now(),
              metadata: {
                callsign: flight.call,
                aircraftType: flight.type,
                altitudeFt: flight.alt_baro,
                speedKt: flight.gs,
              },
            })),
          'live',
        )
        if (entities.length > 0) {
          return {
            entities,
            health: this.buildHealth({
              status: 'ok',
              latencyMs: Math.round(performance.now() - started),
              recordsIn: entities.length,
              lastUpdatedAt: Date.now(),
            }),
          }
        }
      } catch (error) {
        return this.buildFallback(error, started)
      }
    }

    return this.buildFallback(
      new Error('No ADS-B API key configured; using military fallback tracks.'),
      started,
    )
  }

  private buildFallback(error: unknown, started: number): ConnectorResult {
    const now = Date.now()
    const entities = this.withQuality(
      MILITARY_FLIGHT_SEEDS.map<Omit<WorldEntity, 'quality'>>((seed) => {
        const current = this.fallbackPositions[seed.id]
        current.lon = cycleCoordinate(
          current.lon + randomBetween(0.08, 0.26) * Math.cos((seed.heading * Math.PI) / 180),
          -180,
          180,
        )
        current.lat = cycleCoordinate(
          current.lat + randomBetween(0.04, 0.08) * Math.sin((seed.heading * Math.PI) / 180),
          -85,
          85,
        )

        return {
          entityType: 'aircraft_military',
          source: this.source,
          entityId: seed.id,
          label: seed.callsign,
          position: { ...current },
          heading: seed.heading,
          speed: seed.speedKts,
          status: 'airborne',
          timestamp: now,
          metadata: {
            callsign: seed.callsign,
            altitudeM: seed.altitudeM,
            speedKts: seed.speedKts,
            aircraftType: 'Military',
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
          error instanceof Error ? error.message : 'ADS-B unavailable; fallback military tracks in use.',
      }),
    }
  }
}
