import { LANDMARK_SEEDS } from '../static/landmarks'
import { BaseConnector } from './BaseConnector'
import type { ConnectorResult } from '../orchestrator/types'
import type { WorldEntity } from '../../types/entities'

export class LandmarksConnector extends BaseConnector {
  id = 'landmarks'
  source = 'osm-landmarks'
  pollMs = 5 * 60_000

  async run(): Promise<ConnectorResult> {
    const now = Date.now()
    const entities = this.withQuality(
      LANDMARK_SEEDS.map<Omit<WorldEntity, 'quality'>>((landmark) => ({
        entityType: 'landmark',
        source: this.source,
        entityId: landmark.id,
        label: landmark.name,
        position: landmark.position,
        timestamp: now,
        metadata: {
          city: landmark.city,
          country: landmark.country,
          category: 'landmark',
        },
      })),
      'fallback',
    )

    return {
      entities,
      health: this.buildHealth({
        status: 'degraded',
        latencyMs: 0,
        recordsIn: entities.length,
        lastUpdatedAt: now,
        error: 'Using curated OSM-compatible landmark dataset.',
      }),
    }
  }
}
