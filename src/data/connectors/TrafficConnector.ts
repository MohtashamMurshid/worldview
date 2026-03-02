import { TRAFFIC_ROUTE_SEEDS } from '../static/traffic'
import { BaseConnector } from './BaseConnector'
import { interpolatePath } from '../../utils/geo'
import { randomBetween } from './helpers'
import type { ConnectorResult } from '../orchestrator/types'
import type { WorldEntity } from '../../types/entities'

export class TrafficConnector extends BaseConnector {
  id = 'traffic'
  source = 'osm-traffic-sim'
  pollMs = 2_000
  private progressByAgent: Record<string, number> = {}

  async run(): Promise<ConnectorResult> {
    const now = Date.now()
    const entities: Omit<WorldEntity, 'quality'>[] = []

    for (const route of TRAFFIC_ROUTE_SEEDS) {
      const agentsPerRoute = 7
      for (let index = 0; index < agentsPerRoute; index += 1) {
        const agentId = `${route.id}-agent-${index}`
        const progress = this.progressByAgent[agentId] ?? Math.random()
        const step = randomBetween(0.012, 0.03)
        const next = (progress + step) % 1
        this.progressByAgent[agentId] = next
        const position = interpolatePath(route.points, next)
        if (!position) continue

        entities.push({
          entityType: 'traffic_agent',
          source: this.source,
          entityId: agentId,
          label: `${route.city} Agent ${index + 1}`,
          position,
          heading: 0,
          speed: randomBetween(18, 65),
          timestamp: now,
          metadata: {
            routeId: route.id,
            city: route.city,
            intensity: index % 3 === 0 ? 'high' : index % 2 === 0 ? 'medium' : 'low',
          },
        })
      }
    }

    const normalized = this.withQuality(entities, 'fallback')
    return {
      entities: normalized,
      health: this.buildHealth({
        status: 'degraded',
        latencyMs: 0,
        recordsIn: normalized.length,
        lastUpdatedAt: now,
        error: 'Using deterministic road-network traffic simulation.',
      }),
    }
  }
}
