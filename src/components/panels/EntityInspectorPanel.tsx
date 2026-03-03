import { useMemo } from 'react'
import { selectEntityById, useWorldviewStore } from '../../state/worldviewStore'

interface EntityInspectorPanelProps {
  onCenterEntity: (entityId: string) => void
}

const prettyValue = (value: unknown): string => {
  if (value == null) return '-'
  if (typeof value === 'number') return Number.isInteger(value) ? value.toString() : value.toFixed(2)
  if (typeof value === 'string') return value
  return JSON.stringify(value)
}

export const EntityInspectorPanel = ({ onCenterEntity }: EntityInspectorPanelProps) => {
  const selectedEntityId = useWorldviewStore((state) => state.selectedEntityId)
  const trackEntity = useWorldviewStore((state) => state.trackEntity)
  const trackedEntityId = useWorldviewStore((state) => state.trackedEntityId)
  const selectedEntity = useWorldviewStore((state) => selectEntityById(state, selectedEntityId))

  const metadataEntries = useMemo(() => {
    if (!selectedEntity) return []
    return Object.entries(selectedEntity.metadata).slice(0, 7)
  }, [selectedEntity])

  if (!selectedEntity) {
    return (
      <section className="hud-panel inspector-panel">
        <header className="hud-panel-title">Inspector</header>
        <p className="muted">Select an entity from the globe to inspect telemetry.</p>
      </section>
    )
  }

  const isTracked = trackedEntityId === selectedEntity.entityId

  return (
    <section className="hud-panel inspector-panel">
      <header className="hud-panel-title">Inspector / {selectedEntity.entityType}</header>
      <h3>{selectedEntity.label}</h3>
      <p className="muted">
        {selectedEntity.position.lat.toFixed(3)}°, {selectedEntity.position.lon.toFixed(3)}°
      </p>

      <div className="inspector-actions">
        <button className="hud-chip" onClick={() => onCenterEntity(selectedEntity.entityId)}>
          Center
        </button>
        <button
          className={`hud-chip ${isTracked ? 'active' : ''}`}
          onClick={() => trackEntity(isTracked ? null : selectedEntity.entityId)}
        >
          {isTracked ? 'Unfollow' : 'Follow'}
        </button>
        {typeof selectedEntity.metadata.url === 'string' ? (
          <a
            className="hud-chip"
            href={selectedEntity.metadata.url}
            target="_blank"
            rel="noreferrer"
          >
            Source
          </a>
        ) : null}
      </div>

      <ul className="metadata-list">
        {metadataEntries.map(([key, value]) => (
          <li key={key}>
            <span>{key}</span>
            <strong>{prettyValue(value)}</strong>
          </li>
        ))}
      </ul>
    </section>
  )
}
