import { freshnessMs, isStale } from '../orchestrator/staleness'
import type { ConnectorResult, DataConnector } from '../orchestrator/types'
import type { FeedHealth, WorldEntity } from '../../types/entities'

export abstract class BaseConnector implements DataConnector {
  abstract id: string
  abstract source: string
  abstract pollMs: number
  protected staleThresholdMs = 60_000

  abstract run(): Promise<ConnectorResult>

  protected buildHealth(partial: Partial<FeedHealth>): FeedHealth {
    return {
      source: this.source,
      status: partial.status ?? 'idle',
      latencyMs: partial.latencyMs ?? 0,
      recordsIn: partial.recordsIn ?? 0,
      lastUpdatedAt: partial.lastUpdatedAt ?? null,
      error: partial.error,
    }
  }

  protected withQuality(
    entities: Omit<WorldEntity, 'quality'>[],
    availability: 'live' | 'fallback',
  ): WorldEntity[] {
    return entities.map((entity) => ({
      ...entity,
      quality: {
        freshnessMs: freshnessMs(entity.timestamp),
        confidence: availability === 'live' ? 0.95 : 0.75,
        availability,
        stale: isStale(entity.timestamp, this.staleThresholdMs),
      },
    }))
  }
}
