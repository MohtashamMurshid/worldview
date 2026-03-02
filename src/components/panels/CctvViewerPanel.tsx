import { selectEntityById, useWorldviewStore } from '../../state/worldviewStore'

export const CctvViewerPanel = () => {
  const selectedEntityId = useWorldviewStore((state) => state.selectedEntityId)
  const selectedEntity = useWorldviewStore((state) => selectEntityById(state, selectedEntityId))
  const isCamera = selectedEntity?.entityType === 'cctv_camera'

  if (!isCamera || !selectedEntity) {
    return (
      <section className="hud-panel cctv-panel">
        <header className="hud-panel-title">CCTV Viewer</header>
        <p className="muted">Select a CCTV marker to open a live feed panel.</p>
      </section>
    )
  }

  const streamUrl = String(selectedEntity.metadata.streamUrl ?? '')
  const status = String(selectedEntity.status ?? 'offline')
  const canEmbed = streamUrl.startsWith('https://www.youtube.com/embed/')

  return (
    <section className="hud-panel cctv-panel">
      <header className="hud-panel-title">
        CCTV Viewer · <span className={`status-pill status-${status}`}>{status}</span>
      </header>
      <h4>{selectedEntity.label}</h4>
      {status === 'online' && canEmbed ? (
        <iframe
          title={selectedEntity.label}
          src={streamUrl}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="muted-block">
          Feed unavailable or embedding blocked. Open in new tab for direct provider playback.
        </div>
      )}
      <a href={streamUrl} target="_blank" rel="noreferrer" className="hud-chip">
        Open stream source
      </a>
    </section>
  )
}
