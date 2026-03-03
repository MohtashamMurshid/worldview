import { useMemo } from 'react'
import { getFilteredEntities, useWorldviewStore } from '../../state/worldviewStore'

export const TopTelemetryBar = () => {
  const displayMode = useWorldviewStore((state) => state.displayMode)
  const entitiesById = useWorldviewStore((state) => state.entitiesById)
  const layerSettings = useWorldviewStore((state) => state.layerSettings)
  const searchQuery = useWorldviewStore((state) => state.searchQuery)
  const newsFilter = useWorldviewStore((state) => state.newsFilter)
  const seismicFilter = useWorldviewStore((state) => state.seismicFilter)
  const flightFilter = useWorldviewStore((state) => state.flightFilter)
  const mapCenter = useWorldviewStore((state) => state.mapCenter)

  const counts = useMemo(() => {
    const entities = getFilteredEntities({
      entitiesById,
      layerSettings,
      searchQuery,
      newsFilter,
      seismicFilter,
      flightFilter,
      mapCenter,
    })
    return {
      satellite: entities.filter((e) => e.entityType === 'satellite').length,
      aircraft_commercial: entities.filter((e) => e.entityType === 'aircraft_commercial').length,
      aircraft_military: entities.filter((e) => e.entityType === 'aircraft_military').length,
      seismic_event: entities.filter((e) => e.entityType === 'seismic_event').length,
      news_item: entities.filter((e) => e.entityType === 'news_item').length,
    }
  }, [entitiesById, flightFilter, layerSettings, mapCenter, newsFilter, searchQuery, seismicFilter])

  return (
    <header className="top-telemetry">
      <div className="brand-block">
        <h1>WORLDVIEW</h1>
        <small>No place left behind</small>
      </div>
      <div className="telemetry-metrics">
        <span>SAT {counts.satellite}</span>
        <span>COM {counts.aircraft_commercial}</span>
        <span>MIL {counts.aircraft_military}</span>
        <span>EQ {counts.seismic_event}</span>
        <span>NEWS {counts.news_item}</span>
      </div>
      <div className="mode-indicator">ACTIVE STYLE · {displayMode.toUpperCase()}</div>
    </header>
  )
}
