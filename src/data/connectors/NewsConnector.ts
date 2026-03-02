import { NEWS_SEEDS } from '../static/news'
import { BaseConnector } from './BaseConnector'
import type { ConnectorResult } from '../orchestrator/types'
import type { WorldEntity } from '../../types/entities'

interface EonetResponse {
  events: Array<{
    id: string
    title: string
    link: string
    categories: Array<{ title: string }>
    geometry: Array<{
      date: string
      coordinates: [number, number]
    }>
    sources?: Array<{ id: string; url: string }>
  }>
}

const toCategory = (
  value: string,
): 'disaster' | 'transport' | 'conflict' | 'infrastructure' | 'weather' | 'general' => {
  const normalized = value.toLowerCase()
  if (normalized.includes('storm') || normalized.includes('weather')) return 'weather'
  if (normalized.includes('wildfire') || normalized.includes('volcano')) return 'disaster'
  if (normalized.includes('earthquake')) return 'disaster'
  return 'general'
}

export class NewsConnector extends BaseConnector {
  id = 'news'
  source = 'area-news'
  pollMs = 150_000
  protected staleThresholdMs = 7 * 24 * 60 * 60_000

  async run(): Promise<ConnectorResult> {
    const started = performance.now()
    try {
      const response = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=100')
      if (!response.ok) {
        throw new Error(`EONET response ${response.status}`)
      }
      const payload = (await response.json()) as EonetResponse
      const entities = this.withQuality(
        payload.events
          .map<Omit<WorldEntity, 'quality'> | null>((event) => {
            const latestGeometry = event.geometry[event.geometry.length - 1]
            if (!latestGeometry) return null

            return {
              entityType: 'news_item',
              source: this.source,
              entityId: `eonet-${event.id}`,
              label: event.title,
              position: {
                lon: latestGeometry.coordinates[0],
                lat: latestGeometry.coordinates[1],
                alt: 0,
              },
              timestamp: new Date(latestGeometry.date).getTime(),
              metadata: {
                headline: event.title,
                summary: `Natural event tracked by NASA EONET: ${event.title}`,
                url: event.link,
                source: event.sources?.[0]?.id ?? 'EONET',
                publishedAt: latestGeometry.date,
                category: toCategory(event.categories[0]?.title ?? 'general'),
                geoResolution: 'explicit',
                relevanceScore: 0.7,
                relatedEntityIds: [],
              },
            }
          })
          .filter((entity): entity is Omit<WorldEntity, 'quality'> => Boolean(entity)),
        'live',
      )

      if (entities.length === 0) {
        throw new Error('EONET returned no events')
      }

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
      const entities = this.withQuality(
        NEWS_SEEDS.map<Omit<WorldEntity, 'quality'>>((seed) => ({
          entityType: 'news_item',
          source: this.source,
          entityId: seed.id,
          label: seed.headline,
          position: seed.position,
          timestamp: seed.publishedAt,
          metadata: {
            headline: seed.headline,
            summary: seed.summary,
            url: seed.url,
            source: seed.source,
            publishedAt: new Date(seed.publishedAt).toISOString(),
            category: seed.category,
            geoResolution: 'explicit',
            relevanceScore: 0.64,
            relatedEntityIds: [],
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
          lastUpdatedAt: Date.now(),
          error:
            error instanceof Error
              ? `Area news feed unavailable: ${error.message}`
              : 'Area news feed unavailable; using fallback open-data digest.',
        }),
      }
    }
  }
}
