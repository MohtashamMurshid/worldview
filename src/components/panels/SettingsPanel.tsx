import { ToggleChip } from '../common/ToggleChip'
import { useWorldviewStore } from '../../state/worldviewStore'

export const SettingsPanel = () => {
  const showGridOverlay = useWorldviewStore((state) => state.uiSettings.showGridOverlay)
  const showEntityLabels = useWorldviewStore((state) => state.uiSettings.showEntityLabels)
  const showFeedHealth = useWorldviewStore((state) => state.uiSettings.showFeedHealth)
  const highDensityMode = useWorldviewStore((state) => state.uiSettings.highDensityMode)
  const toggleGridOverlay = useWorldviewStore((state) => state.toggleGridOverlay)
  const toggleEntityLabels = useWorldviewStore((state) => state.toggleEntityLabels)
  const toggleFeedHealth = useWorldviewStore((state) => state.toggleFeedHealth)
  const toggleHighDensityMode = useWorldviewStore((state) => state.toggleHighDensityMode)

  return (
    <section className="hud-panel settings-panel">
      <header className="hud-panel-title">Settings</header>
      <div className="settings-grid">
        <ToggleChip
          label="Grid Overlay"
          active={showGridOverlay}
          onToggle={toggleGridOverlay}
        />
        <ToggleChip
          label="Entity Labels"
          active={showEntityLabels}
          onToggle={toggleEntityLabels}
        />
        <ToggleChip
          label="Feed Diagnostics"
          active={showFeedHealth}
          onToggle={toggleFeedHealth}
        />
        <ToggleChip
          label="High Density"
          active={highDensityMode}
          onToggle={toggleHighDensityMode}
        />
      </div>

      <ul className="shortcut-list">
        <li>
          <kbd>M</kbd> cycle display mode
        </li>
        <li>
          <kbd>F</kbd> follow selected entity
        </li>
        <li>
          <kbd>U</kbd> toggle clean UI
        </li>
        <li>
          <kbd>/</kbd> or <kbd>Ctrl/Cmd + K</kbd> focus search
        </li>
      </ul>
    </section>
  )
}
