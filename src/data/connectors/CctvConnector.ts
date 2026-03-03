import { CCTV_SEEDS } from '../static/cctv'
import { BaseConnector } from './BaseConnector'
import type { ConnectorResult } from '../orchestrator/types'
import type { WorldEntity } from '../../types/entities'

export class CctvConnector extends BaseConnector {
  id = 'cctv'
  source = 'public-cctv'
  pollMs = 45_000

  async run(): Promise<ConnectorResult> {
    const now = Date.now()

    const entities = this.withQuality(
      CCTV_SEEDS.map<Omit<WorldEntity, 'quality'>>((camera) => {
        const status = Math.random() > 0.16 ? 'online' : 'offline'
        return {
          entityType: 'cctv_camera',
          source: this.source,
          entityId: camera.id,
          label: camera.name,
          position: camera.position,
          status,
          timestamp: now,
          metadata: {
            streamUrl: camera.streamUrl,
            provider: camera.provider,
            city: camera.city,
            lagMs: status === 'online' ? Math.round(Math.random() * 1400) : null,
          },
        }
      }),
      'fallback',
    )

    return {
      entities,
      health: this.buildHealth({
        status: 'degraded',
        latencyMs: 0,
        recordsIn: entities.length,
        lastUpdatedAt: now,
        error: 'CCTV endpoints are public and may intermittently fail to embed.',
      }),
    }
  }
}
