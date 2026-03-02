import type { FeedHealth, WorldEntity } from '../../types/entities'

export interface ConnectorResult {
  entities: WorldEntity[]
  health: FeedHealth
}

export interface DataConnector {
  id: string
  source: string
  pollMs: number
  run(): Promise<ConnectorResult>
}

export interface OrchestratorSnapshot {
  entitiesBySource: Record<string, WorldEntity[]>
  feedHealth: Record<string, FeedHealth>
}

export interface OrchestratorCallbacks {
  onEntitiesUpdate: (source: string, entities: WorldEntity[]) => void
  onFeedHealthUpdate: (source: string, health: FeedHealth) => void
}
