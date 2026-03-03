import type { DataConnector, OrchestratorCallbacks } from './types'
import type { FeedHealth } from '../../types/entities'

export class RealtimeDataOrchestrator {
  private timers = new Map<string, number>()
  private isRunning = false
  private connectors: DataConnector[] = []
  private callbacks: OrchestratorCallbacks

  constructor(connectors: DataConnector[], callbacks: OrchestratorCallbacks) {
    this.connectors = connectors
    this.callbacks = callbacks
  }

  start() {
    if (this.isRunning) return
    this.isRunning = true

    this.connectors.forEach((connector) => {
      this.runConnector(connector)
      const timer = window.setInterval(() => {
        this.runConnector(connector)
      }, connector.pollMs)
      this.timers.set(connector.id, timer)
    })
  }

  stop() {
    this.isRunning = false
    this.timers.forEach((timer) => window.clearInterval(timer))
    this.timers.clear()
  }

  private async runConnector(connector: DataConnector) {
    try {
      const result = await connector.run()
      this.callbacks.onEntitiesUpdate(connector.source, result.entities)
      this.callbacks.onFeedHealthUpdate(connector.source, result.health)
    } catch (error) {
      const health: FeedHealth = {
        source: connector.source,
        status: 'down',
        latencyMs: 0,
        recordsIn: 0,
        lastUpdatedAt: Date.now(),
        error: error instanceof Error ? error.message : 'Connector crashed unexpectedly',
      }
      this.callbacks.onFeedHealthUpdate(connector.source, health)
    }
  }
}
