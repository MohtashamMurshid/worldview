import { CAMERA_PRESETS } from '../../config/cameraPresets'

interface CameraPresetsPanelProps {
  onFlyTo: (lat: number, lon: number, height?: number) => void
}

export const CameraPresetsPanel = ({ onFlyTo }: CameraPresetsPanelProps) => (
  <section className="hud-panel presets-panel">
    <header className="hud-panel-title">Landmarks</header>
    <div className="preset-grid">
      {CAMERA_PRESETS.map((preset) => (
        <button
          key={preset.id}
          className="hud-pill"
          onClick={() => onFlyTo(preset.lat, preset.lon, preset.height)}
        >
          {preset.label}
        </button>
      ))}
    </div>
  </section>
)
