import { useMemo } from 'react'
import { selectFilteredEntities, useWorldviewStore } from '../../state/worldviewStore'

interface NewsPanelProps {
  onFocusEntity: (entityId: string) => void
}

export const NewsPanel = ({ onFocusEntity }: NewsPanelProps) => {
  const entitiesById = useWorldviewStore((state) => state.entitiesById)

  const newsItems = useMemo(
    () =>
      Object.values(entitiesById)
        .filter((entity) => entity.entityType === 'news_item')
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 6),
    [entitiesById],
  )

  return (
    <section className="hud-panel news-panel">
      <header className="hud-panel-title">Area News</header>
      <div className="news-list">
        {newsItems.map((news) => (
          <article key={news.entityId} className="news-item">
            <button className="news-focus" onClick={() => onFocusEntity(news.entityId)}>
              {news.label}
            </button>
            <p>{String(news.metadata.summary ?? '').slice(0, 90)}</p>
            <small>
              {String(news.metadata.category ?? 'general')} ·{' '}
              {new Date(news.timestamp).toLocaleString()}
            </small>
          </article>
        ))}
        {newsItems.length === 0 ? <p className="muted">No area news in selected filters.</p> : null}
      </div>
    </section>
  )
}
