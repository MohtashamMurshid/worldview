import { useEffect, useMemo, useRef } from 'react'
import { getFilteredEntities, useWorldviewStore } from '../../state/worldviewStore'

interface SearchPanelProps {
  onFocusEntity: (entityId: string) => void
}

export const SearchPanel = ({ onFocusEntity }: SearchPanelProps) => {
  const searchQuery = useWorldviewStore((state) => state.searchQuery)
  const setSearchQuery = useWorldviewStore((state) => state.setSearchQuery)
  const selectEntity = useWorldviewStore((state) => state.selectEntity)
  const entitiesById = useWorldviewStore((state) => state.entitiesById)
  const layerSettings = useWorldviewStore((state) => state.layerSettings)
  const newsFilter = useWorldviewStore((state) => state.newsFilter)
  const seismicFilter = useWorldviewStore((state) => state.seismicFilter)
  const flightFilter = useWorldviewStore((state) => state.flightFilter)
  const mapCenter = useWorldviewStore((state) => state.mapCenter)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const entities = useMemo(() => {
    return getFilteredEntities({
      entitiesById,
      layerSettings,
      searchQuery,
      newsFilter,
      seismicFilter,
      flightFilter,
      mapCenter,
    })
  }, [
    entitiesById,
    flightFilter,
    layerSettings,
    mapCenter,
    newsFilter,
    searchQuery,
    seismicFilter,
  ])

  const quickResults = useMemo(() => entities.slice(0, 8), [entities])

  useEffect(() => {
    const focusHandler = () => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
    window.addEventListener('worldview:focus-search', focusHandler)
    return () => window.removeEventListener('worldview:focus-search', focusHandler)
  }, [])

  return (
    <section className="hud-panel search-panel">
      <header className="hud-panel-title">Search / Inspect</header>
      <input
        ref={inputRef}
        className="hud-input"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="callsign, landmark, location..."
      />
      {searchQuery ? (
        <div className="search-results">
          {quickResults.map((entity) => (
            <button
              key={entity.entityId}
              className="search-row"
              onClick={() => {
                selectEntity(entity.entityId)
                onFocusEntity(entity.entityId)
              }}
            >
              <span>{entity.label}</span>
              <small>{entity.entityType}</small>
            </button>
          ))}
          {quickResults.length === 0 ? <p className="muted">No matching entities.</p> : null}
        </div>
      ) : (
        <p className="muted">Type to filter all visible layers globally.</p>
      )}
    </section>
  )
}
