import { BaseConnector } from './BaseConnector'
import { COMMERCIAL_FLIGHT_SEEDS } from '../static/flights'
import { cycleCoordinate, randomBetween } from './helpers'
import type { ConnectorResult } from '../orchestrator/types'
import type { WorldEntity } from '../../types/entities'

interface OpenSkyResponse {
  time: number
  states: Array<
    [
      string,
      string | null,
      string | null,
      number | null,
      number | null,
      number | null,
      number | null,
      number | null,
      boolean | null,
      number | null,
      number | null,
      number | null,
      number[] | null,
      number | null,
      string | null,
      boolean | null,
      number
    ]
  >
}

export class OpenSkyConnector extends BaseConnector {
  id = 'flights-commercial'
  source = 'opensky'
  pollMs = 10_000

  private fallbackPositions = Object.fromEntries(
    COMMERCIAL_FLIGHT_SEEDS.map((seed) => [seed.id, { ...seed.position }]),
  )

  async run(): Promise<ConnectorResult> {
    const started = performance.now()

    try {
      const response = await fetch('https://opensky-network.org/api/states/all')
      if (!response.ok) {
        throw new Error(`OpenSky response ${response.status}`)
      }
      const payload = (await response.json()) as OpenSkyResponse
      const now = Date.now()
      const entities = this.withQuality(
        (payload.states ?? [])
          .filter((state) => state[5] != null && state[6] != null)
          .slice(0, 300)
          .map<Omit<WorldEntity, 'quality'>>((state) => ({
            entityType: 'aircraft_commercial',
            source: this.source,
            entityId: state[0],
            label: (state[1] ?? state[0]).trim(),
            position: {
              lon: state[5] ?? 0,
              lat: state[6] ?? 0,
              alt: state[7] ?? undefined,
            },
            heading: state[10] ?? undefined,
            speed: state[9] ?? undefined,
            status: state[8] ? 'airborne' : 'ground',
            timestamp: (state[3] ?? payload.time) * 1000,
            metadata: {
              callsign: (state[1] ?? '').trim(),
              country: state[2],
              altitudeM: state[7],
              velocity: state[9],
              verticalRate: state[11],
              squawk: state[14],
            },
          })),
        'live',
      )

      if (entities.length < 10) {
        throw new Error('OpenSky returned too few records.')
      }

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
      const now = Date.now()
      const entities = this.withQuality(
        COMMERCIAL_FLIGHT_SEEDS.map<Omit<WorldEntity, 'quality'>>((seed) => {
          const current = this.fallbackPositions[seed.id]
          current.lon = cycleCoordinate(
            current.lon + randomBetween(0.1, 0.35) * Math.cos((seed.heading * Math.PI) / 180),
            -180,
            180,
          )
          current.lat = cycleCoordinate(
            current.lat + randomBetween(0.05, 0.12) * Math.sin((seed.heading * Math.PI) / 180),
            -85,
            85,
          )

          return {
            entityType: 'aircraft_commercial',
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
              ? `OpenSky unavailable: ${error.message}`
              : 'OpenSky unavailable, running fallback commercial tracks.',
        }),
      }
    }
  }
}
