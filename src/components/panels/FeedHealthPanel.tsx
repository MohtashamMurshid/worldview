import { useWorldviewStore } from '../../state/worldviewStore'

const statusClass = (status: string) => `status-${status}`

export const FeedHealthPanel = () => {
  const feedHealth = useWorldviewStore((state) => state.feedHealth)
  const rows = Object.values(feedHealth).sort((a, b) => a.source.localeCompare(b.source))

  return (
    <section className="hud-panel health-panel">
      <header className="hud-panel-title">Feed Health</header>
      <div className="health-list">
        {rows.map((health) => (
          <div key={health.source} className="health-row">
            <div>
              <strong>{health.source}</strong>
              <small>{health.recordsIn} records</small>
            </div>
            <div className={`status-pill ${statusClass(health.status)}`}>{health.status}</div>
          </div>
        ))}
        {rows.length === 0 ? <p className="muted">Waiting for connector telemetry...</p> : null}
      </div>
    </section>
  )
}
