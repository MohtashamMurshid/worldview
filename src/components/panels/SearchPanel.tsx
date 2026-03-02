import { useMemo } from 'react'
import { selectFilteredEntities, useWorldviewStore } from '../../state/worldviewStore'

interface SearchPanelProps {
  onFocusEntity: (entityId: string) => void
}

export const SearchPanel = ({ onFocusEntity }: SearchPanelProps) => {
  const searchQuery = useWorldviewStore((state) => state.searchQuery)
  const setSearchQuery = useWorldviewStore((state) => state.setSearchQuery)
  const selectEntity = useWorldviewStore((state) => state.selectEntity)
  const entitiesById = useWorldviewStore((state) => state.entitiesById)
  
  const entities = useMemo(() => {
    return Object.values(entitiesById).filter((entity) => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      const target = `${entity.label} ${entity.entityId} ${JSON.stringify(entity.metadata)}`.toLowerCase()
      return target.includes(query)
    })
  }, [entitiesById, searchQuery])

  const quickResults = useMemo(() => entities.slice(0, 8), [entities])

  return (
    <section className="hud-panel search-panel">
      <header className="hud-panel-title">Search / Inspect</header>
      <input
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
