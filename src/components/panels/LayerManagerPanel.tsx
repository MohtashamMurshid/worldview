import { useWorldviewStore } from '../../state/worldviewStore'
import type { LayerId } from '../../types/layers'

const orderedLayerIds: LayerId[] = [
  'satellites',
  'flightsCommercial',
  'flightsMilitary',
  'cctv',
  'traffic',
  'seismic',
  'news',
  'landmarks',
]

export const LayerManagerPanel = () => {
  const layerSettings = useWorldviewStore((state) => state.layerSettings)
  const setLayerVisibility = useWorldviewStore((state) => state.setLayerVisibility)
  const setLayerOpacity = useWorldviewStore((state) => state.setLayerOpacity)
  const setLayerIntensity = useWorldviewStore((state) => state.setLayerIntensity)

  return (
    <section className="hud-panel layer-panel">
      <header className="hud-panel-title">Data Layers</header>
      <div className="layer-list">
        {orderedLayerIds.map((layerId) => {
          const layer = layerSettings[layerId]
          return (
            <div key={layer.id} className="layer-item">
              <label className="layer-label">
                <input
                  type="checkbox"
                  checked={layer.visible}
                  onChange={(event) => setLayerVisibility(layer.id, event.target.checked)}
                />
                <span>{layer.label}</span>
              </label>
              <div className="layer-sliders">
                <label>
                  Opacity
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={layer.opacity}
                    onChange={(event) => setLayerOpacity(layer.id, Number(event.target.value))}
                  />
                </label>
                <label>
                  Intensity
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={layer.intensity}
                    onChange={(event) => setLayerIntensity(layer.id, Number(event.target.value))}
                  />
                </label>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
