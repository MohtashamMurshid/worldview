import {
  createGooglePhotorealistic3DTileset,
  createWorldTerrainAsync,
  Ion,
  Cartesian2,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Viewer,
} from 'cesium'
import { useEffect, useState, type MutableRefObject } from 'react'

interface UseCesiumViewerParams {
  containerRef: MutableRefObject<HTMLDivElement | null>
  onEntityPick: (entityId: string | null) => void
  onMapCenterUpdate: (lat: number, lon: number) => void
}

export const useCesiumViewer = ({
  containerRef,
  onEntityPick,
  onMapCenterUpdate,
}: UseCesiumViewerParams) => {
  const [viewer, setViewer] = useState<Viewer | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ionToken = import.meta.env.VITE_CESIUM_ION_TOKEN as string | undefined
    if (ionToken) {
      Ion.defaultAccessToken = ionToken
    }

    const cesiumViewer = new Viewer(container, {
      animation: false,
      timeline: false,
      selectionIndicator: false,
      geocoder: false,
      sceneModePicker: false,
      homeButton: false,
      baseLayerPicker: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      infoBox: false,
      shouldAnimate: true,
    })

    cesiumViewer.scene.globe.enableLighting = true
    cesiumViewer.scene.globe.depthTestAgainstTerrain = false
    cesiumViewer.scene.fog.enabled = true
    cesiumViewer.scene.globe.showGroundAtmosphere = true

    void createWorldTerrainAsync()
      .then((terrainProvider) => {
        cesiumViewer.terrainProvider = terrainProvider
      })
      .catch(() => {
        // terrain fallback handled by Cesium defaults
      })

    const useGoogleTiles = String(import.meta.env.VITE_USE_GOOGLE_3D_TILES ?? 'false') === 'true'
    if (useGoogleTiles && ionToken) {
      void createGooglePhotorealistic3DTileset()
        .then((tileset) => {
          cesiumViewer.scene.primitives.add(tileset)
        })
        .catch(() => {
          // gracefully keep default globe if unavailable
        })
    }

    let lastMapCenterUpdateAt = 0
    let lastLat = Number.NaN
    let lastLon = Number.NaN
    const cameraChanged = () => {
      const now = Date.now()
      if (now - lastMapCenterUpdateAt < 250) return
      const position = cesiumViewer.camera.positionCartographic
      const lat = (position.latitude * 180) / Math.PI
      const lon = (position.longitude * 180) / Math.PI
      if (!Number.isNaN(lastLat) && Math.abs(lat - lastLat) < 0.01 && Math.abs(lon - lastLon) < 0.01) {
        return
      }
      lastMapCenterUpdateAt = now
      lastLat = lat
      lastLon = lon
      onMapCenterUpdate(lat, lon)
    }
    cesiumViewer.camera.changed.addEventListener(cameraChanged)

    const eventHandler = new ScreenSpaceEventHandler(cesiumViewer.scene.canvas)
    eventHandler.setInputAction((movement: { position: Cartesian2 }) => {
      const picked = cesiumViewer.scene.pick(movement.position)
      const pickedEntityId = picked?.id?.id
      onEntityPick(typeof pickedEntityId === 'string' ? pickedEntityId : null)
    }, ScreenSpaceEventType.LEFT_CLICK)

    setViewer(cesiumViewer)

    return () => {
      eventHandler.destroy()
      cesiumViewer.camera.changed.removeEventListener(cameraChanged)
      cesiumViewer.destroy()
    }
  }, [containerRef, onEntityPick, onMapCenterUpdate])

  return viewer
}
