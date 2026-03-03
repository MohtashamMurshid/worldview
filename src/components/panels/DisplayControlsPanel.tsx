import { DISPLAY_MODE_PRESETS } from '../../config/displayModes'
import { useWorldviewStore } from '../../state/worldviewStore'
import { RangeField } from '../common/RangeField'
import { ToggleChip } from '../common/ToggleChip'

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
        <RangeField
          label="Intensity"
          min={0}
          max={100}
          value={displayTuning.intensity}
          onChange={(value) => setDisplayTuning({ intensity: value })}
        />
        <RangeField
          label="Sharpen"
          min={0}
          max={100}
          value={displayTuning.sharpness}
          onChange={(value) => setDisplayTuning({ sharpness: value })}
        />
        <RangeField
          label="Noise"
          min={0}
          max={100}
          value={displayTuning.noise}
          onChange={(value) => setDisplayTuning({ noise: value })}
        />
        <RangeField
          label="Bloom"
          min={0}
          max={100}
          value={displayTuning.bloom}
          onChange={(value) => setDisplayTuning({ bloom: value })}
        />
      </div>
      <ToggleChip
        label="Clean UI"
        active={displayTuning.cleanUi}
        onToggle={() => setDisplayTuning({ cleanUi: !displayTuning.cleanUi })}
      />
    </section>
  )
}
