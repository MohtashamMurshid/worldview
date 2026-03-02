import { useWorldviewStore } from '../../state/worldviewStore'
import type { LayerId } from '../../types/layers'
import { RangeField } from '../common/RangeField'

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
                <RangeField
                  label="Opacity"
                  min={0}
                  max={1}
                  step={0.05}
                  value={layer.opacity}
                  onChange={(value) => setLayerOpacity(layer.id, value)}
                />
                <RangeField
                  label="Intensity"
                  min={0}
                  max={1}
                  step={0.05}
                  value={layer.intensity}
                  onChange={(value) => setLayerIntensity(layer.id, value)}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
