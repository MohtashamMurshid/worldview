import { useEffect, useMemo } from 'react'
import { RealtimeDataOrchestrator } from '../data/orchestrator/RealtimeDataOrchestrator'
import { AdsbConnector } from '../data/connectors/AdsbConnector'
import { CctvConnector } from '../data/connectors/CctvConnector'
import { LandmarksConnector } from '../data/connectors/LandmarksConnector'
import { NewsConnector } from '../data/connectors/NewsConnector'
import { OpenSkyConnector } from '../data/connectors/OpenSkyConnector'
import { SatelliteConnector } from '../data/connectors/SatelliteConnector'
import { SeismicConnector } from '../data/connectors/SeismicConnector'
import { TrafficConnector } from '../data/connectors/TrafficConnector'
import { useWorldviewStore } from '../state/worldviewStore'

export const useRealtimeOrchestrator = () => {
  const setSourceEntities = useWorldviewStore((state) => state.setSourceEntities)
  const setFeedHealth = useWorldviewStore((state) => state.setFeedHealth)

  const orchestrator = useMemo(
    () =>
      new RealtimeDataOrchestrator(
        [
          new LandmarksConnector(),
          new SatelliteConnector(),
          new OpenSkyConnector(),
          new AdsbConnector(),
          new TrafficConnector(),
          new CctvConnector(),
          new SeismicConnector(),
          new NewsConnector(),
        ],
        {
          onEntitiesUpdate: setSourceEntities,
          onFeedHealthUpdate: setFeedHealth,
        },
      ),
    [setFeedHealth, setSourceEntities],
  )

  useEffect(() => {
    orchestrator.start()
    return () => orchestrator.stop()
  }, [orchestrator])
}
