import { CustomDataSource, Math as CesiumMath, Cartesian3 } from 'cesium'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { useCesiumViewer } from './useCesiumViewer'
import { syncLayerEntities } from './layerRenderers'
import { useWorldviewStore, selectEntityById, selectFilteredEntities } from '../../state/worldviewStore'
import { getModeClassName, getModeStyle } from './postFx'

export interface WorldGlobeHandle {
  flyTo: (lat: number, lon: number, height?: number) => void
  focusEntity: (entityId: string) => void
}

export const WorldGlobe = forwardRef<WorldGlobeHandle>(function WorldGlobe(_props, ref) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const displayMode = useWorldviewStore((state) => state.displayMode)
  const displayTuning = useWorldviewStore((state) => state.displayTuning)
  const entitiesById = useWorldviewStore((state) => state.entitiesById)
  const layerSettings = useWorldviewStore((state) => state.layerSettings)
  const searchQuery = useWorldviewStore((state) => state.searchQuery)
  const selectedEntityId = useWorldviewStore((state) => state.selectedEntityId)
  const trackedEntityId = useWorldviewStore((state) => state.trackedEntityId)
  const selectEntity = useWorldviewStore((state) => state.selectEntity)
  const setMapCenter = useWorldviewStore((state) => state.setMapCenter)
  const trackedEntity = useWorldviewStore((state) => selectEntityById(state, trackedEntityId))
  const dataSource = useMemo(() => new CustomDataSource('worldview-layers'), [])
  
  const entities = useMemo(() => selectFilteredEntities({ 
    entitiesById, 
    layerSettings, 
    searchQuery, 
    newsFilter: useWorldviewStore.getState().newsFilter,
    seismicFilter: useWorldviewStore.getState().seismicFilter,
    flightFilter: useWorldviewStore.getState().flightFilter,
    mapCenter: useWorldviewStore.getState().mapCenter,
  } as any), [entitiesById, layerSettings, searchQuery])

  const viewer = useCesiumViewer({
    containerRef,
    onEntityPick: selectEntity,
    onMapCenterUpdate: setMapCenter,
  })

  useImperativeHandle(
    ref,
    () => ({
      flyTo: (lat, lon, height = 8000) => {
        if (!viewer) return
        viewer.camera.flyTo({
          destination: Cartesian3.fromDegrees(lon, lat, height),
          orientation: {
            heading: CesiumMath.toRadians(5),
            pitch: CesiumMath.toRadians(-35),
          },
          duration: 1.2,
        })
      },
      focusEntity: (entityId) => {
        if (!viewer) return
        const entity = dataSource.entities.getById(entityId)
        if (entity) {
          void viewer.flyTo(entity, {
            duration: 1.2,
            offset: {
              heading: CesiumMath.toRadians(0),
              pitch: CesiumMath.toRadians(-35),
              range: 7500,
            },
          })
        }
      },
    }),
    [dataSource.entities, viewer],
  )

  useEffect(() => {
    if (!viewer) return
    syncLayerEntities(viewer, dataSource, entities, selectedEntityId)
  }, [dataSource, entities, selectedEntityId, viewer])

  useEffect(() => {
    if (!viewer) return
    if (!trackedEntity) {
      return
    }

    const entity = dataSource.entities.getById(trackedEntity.entityId)
    if (!entity) return
    void viewer.flyTo(entity, {
      duration: 0.6,
      offset: {
        heading: CesiumMath.toRadians(0),
        pitch: CesiumMath.toRadians(-32),
        range: 7800,
      },
    })
  }, [dataSource.entities, trackedEntity, viewer])

  return (
    <div className={`viewport mode-shell ${getModeClassName(displayMode)}`} style={getModeStyle(displayTuning)}>
      <div className="viewport-grid-overlay" />
      <div ref={containerRef} className="globe-container" />
      <div className="viewport-noise-overlay" />
    </div>
  )
})
