import { useWorldviewStore } from '../../state/worldviewStore'

export const TimelinePanel = () => {
  const seismicFilter = useWorldviewStore((state) => state.seismicFilter)
  const setSeismicFilter = useWorldviewStore((state) => state.setSeismicFilter)
  const newsFilter = useWorldviewStore((state) => state.newsFilter)
  const setNewsFilter = useWorldviewStore((state) => state.setNewsFilter)
  const flightFilter = useWorldviewStore((state) => state.flightFilter)
  const setFlightFilter = useWorldviewStore((state) => state.setFlightFilter)

  return (
    <section className="hud-panel timeline-panel">
      <header className="hud-panel-title">Timeline / Area Filters</header>
      <div className="timeline-grid">
        <label>
          Seismic Window
          <select
            value={seismicFilter.timeWindow}
            onChange={(event) =>
              setSeismicFilter({ timeWindow: event.target.value as '1h' | '24h' | '7d' })
            }
          >
            <option value="1h">Last 1h</option>
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7d</option>
          </select>
        </label>

        <label>
          News Window
          <select
            value={newsFilter.timeWindow}
            onChange={(event) =>
              setNewsFilter({ timeWindow: event.target.value as '1h' | '6h' | '24h' | '7d' })
            }
          >
            <option value="1h">Last 1h</option>
            <option value="6h">Last 6h</option>
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7d</option>
          </select>
        </label>

        <label>
          News Radius (km)
          <input
            type="range"
            min={100}
            max={8000}
            step={100}
            value={newsFilter.radiusKm}
            onChange={(event) => setNewsFilter({ radiusKm: Number(event.target.value) })}
          />
          <small>{newsFilter.radiusKm} km around camera center</small>
        </label>

        <label>
          News Category
          <select
            value={newsFilter.category}
            onChange={(event) =>
              setNewsFilter({
                category: event.target.value as
                  | 'all'
                  | 'disaster'
                  | 'transport'
                  | 'conflict'
                  | 'infrastructure'
                  | 'weather'
                  | 'general',
              })
            }
          >
            <option value="all">All</option>
            <option value="disaster">Disaster</option>
            <option value="transport">Transport</option>
            <option value="conflict">Conflict</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="weather">Weather</option>
            <option value="general">General</option>
          </select>
        </label>

        <label>
          Flight Callsign
          <input
            value={flightFilter.callsign}
            onChange={(event) => setFlightFilter({ callsign: event.target.value })}
            placeholder="e.g. AAL"
            className="hud-input"
          />
        </label>

        <label>
          Minimum Altitude (m)
          <input
            type="range"
            min={0}
            max={13_500}
            step={100}
            value={flightFilter.altitudeRange[0]}
            onChange={(event) =>
              setFlightFilter({
                altitudeRange: [
                  Number(event.target.value),
                  Math.max(Number(event.target.value), flightFilter.altitudeRange[1]),
                ],
              })
            }
          />
          <small>{flightFilter.altitudeRange[0]} m</small>
        </label>

        <label>
          Minimum Speed (kts)
          <input
            type="range"
            min={0}
            max={700}
            step={10}
            value={flightFilter.speedRange[0]}
            onChange={(event) =>
              setFlightFilter({
                speedRange: [
                  Number(event.target.value),
                  Math.max(Number(event.target.value), flightFilter.speedRange[1]),
                ],
              })
            }
          />
          <small>{flightFilter.speedRange[0]} kts</small>
        </label>
      </div>
    </section>
  )
}
