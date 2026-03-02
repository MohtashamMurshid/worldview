import { DISPLAY_MODE_PRESETS } from '../../config/displayModes'
import { useWorldviewStore } from '../../state/worldviewStore'

export const BottomStyleRail = () => {
  const displayMode = useWorldviewStore((state) => state.displayMode)
  const setDisplayMode = useWorldviewStore((state) => state.setDisplayMode)

  return (
    <footer className="style-rail">
      <span className="style-rail-label">Style Presets</span>
      <div className="style-rail-buttons">
        {DISPLAY_MODE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            className={`style-rail-btn ${displayMode === preset.id ? 'active' : ''}`}
            onClick={() => setDisplayMode(preset.id)}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </footer>
  )
}
