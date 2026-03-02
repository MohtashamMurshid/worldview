import { DISPLAY_MODE_PRESETS } from '../../config/displayModes'
import { useWorldviewStore } from '../../state/worldviewStore'

export const DisplayControlsPanel = () => {
  const displayMode = useWorldviewStore((state) => state.displayMode)
  const displayTuning = useWorldviewStore((state) => state.displayTuning)
  const setDisplayMode = useWorldviewStore((state) => state.setDisplayMode)
  const setDisplayTuning = useWorldviewStore((state) => state.setDisplayTuning)

  return (
    <section className="hud-panel display-panel">
      <header className="hud-panel-title">Active Style</header>
      <div className="display-mode-grid">
        {DISPLAY_MODE_PRESETS.map((mode) => (
          <button
            key={mode.id}
            className={`hud-chip ${mode.id === displayMode ? 'active' : ''}`}
            onClick={() => setDisplayMode(mode.id)}
          >
            {mode.label}
          </button>
        ))}
      </div>

      <div className="slider-group">
        <label>
          Intensity
          <input
            type="range"
            min={0}
            max={100}
            value={displayTuning.intensity}
            onChange={(event) => setDisplayTuning({ intensity: Number(event.target.value) })}
          />
        </label>
        <label>
          Sharpen
          <input
            type="range"
            min={0}
            max={100}
            value={displayTuning.sharpness}
            onChange={(event) => setDisplayTuning({ sharpness: Number(event.target.value) })}
          />
        </label>
        <label>
          Noise
          <input
            type="range"
            min={0}
            max={100}
            value={displayTuning.noise}
            onChange={(event) => setDisplayTuning({ noise: Number(event.target.value) })}
          />
        </label>
        <label>
          Bloom
          <input
            type="range"
            min={0}
            max={100}
            value={displayTuning.bloom}
            onChange={(event) => setDisplayTuning({ bloom: Number(event.target.value) })}
          />
        </label>
      </div>
      <button
        className={`hud-chip ${displayTuning.cleanUi ? 'active' : ''}`}
        onClick={() => setDisplayTuning({ cleanUi: !displayTuning.cleanUi })}
      >
        Clean UI
      </button>
    </section>
  )
}
