import { useRef } from 'react'
import { WorldGlobe, type WorldGlobeHandle } from './components/globe/WorldGlobe'
import { BottomStyleRail } from './components/hud/BottomStyleRail'
import { TopTelemetryBar } from './components/hud/TopTelemetryBar'
import { CameraPresetsPanel } from './components/panels/CameraPresetsPanel'
import { CctvViewerPanel } from './components/panels/CctvViewerPanel'
import { DisplayControlsPanel } from './components/panels/DisplayControlsPanel'
import { EntityInspectorPanel } from './components/panels/EntityInspectorPanel'
import { FeedHealthPanel } from './components/panels/FeedHealthPanel'
import { LayerManagerPanel } from './components/panels/LayerManagerPanel'
import { NewsPanel } from './components/panels/NewsPanel'
import { SearchPanel } from './components/panels/SearchPanel'
import { SettingsPanel } from './components/panels/SettingsPanel'
import { TimelinePanel } from './components/panels/TimelinePanel'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useRealtimeOrchestrator } from './hooks/useRealtimeOrchestrator'
import { useWorldviewStore } from './state/worldviewStore'
import './App.css'

function App() {
  const globeRef = useRef<WorldGlobeHandle | null>(null)
  const cleanUi = useWorldviewStore((state) => state.displayTuning.cleanUi)
  const showFeedHealth = useWorldviewStore((state) => state.uiSettings.showFeedHealth)

  useRealtimeOrchestrator()
  useKeyboardShortcuts()

  return (
    <div className="app-shell">
      <TopTelemetryBar />
      <div className={`workspace-grid ${cleanUi ? 'clean-mode' : ''}`}>
        {!cleanUi ? (
          <aside className="left-rail">
            <SearchPanel onFocusEntity={(entityId) => globeRef.current?.focusEntity(entityId)} />
            <LayerManagerPanel />
            <CameraPresetsPanel onFlyTo={(lat, lon, height) => globeRef.current?.flyTo(lat, lon, height)} />
          </aside>
        ) : null}

        <main className="viewport-shell">
          <WorldGlobe ref={globeRef} />
          <BottomStyleRail />
        </main>

        {!cleanUi ? (
          <aside className="right-rail">
            <DisplayControlsPanel />
            <SettingsPanel />
            {showFeedHealth ? <FeedHealthPanel /> : null}
            <TimelinePanel />
            <EntityInspectorPanel onCenterEntity={(entityId) => globeRef.current?.focusEntity(entityId)} />
            <NewsPanel onFocusEntity={(entityId) => globeRef.current?.focusEntity(entityId)} />
            <CctvViewerPanel />
          </aside>
        ) : null}
      </div>
    </div>
  )
}

export default App
