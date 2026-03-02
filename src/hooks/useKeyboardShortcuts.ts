import { useEffect } from 'react'
import { useWorldviewStore } from '../state/worldviewStore'

const ORDERED_MODES = ['normal', 'crt', 'nvg', 'flir'] as const

export const useKeyboardShortcuts = () => {
  const displayMode = useWorldviewStore((state) => state.displayMode)
  const setDisplayMode = useWorldviewStore((state) => state.setDisplayMode)
  const selectedEntityId = useWorldviewStore((state) => state.selectedEntityId)
  const trackedEntityId = useWorldviewStore((state) => state.trackedEntityId)
  const trackEntity = useWorldviewStore((state) => state.trackEntity)
  const displayTuning = useWorldviewStore((state) => state.displayTuning)
  const setDisplayTuning = useWorldviewStore((state) => state.setDisplayTuning)

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'm') {
        const currentIndex = ORDERED_MODES.indexOf(displayMode)
        const nextIndex = (currentIndex + 1) % ORDERED_MODES.length
        setDisplayMode(ORDERED_MODES[nextIndex])
      }

      if (event.key.toLowerCase() === 'f') {
        if (!selectedEntityId) return
        trackEntity(trackedEntityId === selectedEntityId ? null : selectedEntityId)
      }

      if (event.key.toLowerCase() === 'u') {
        setDisplayTuning({
          cleanUi: !displayTuning.cleanUi,
        })
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [
    displayMode,
    displayTuning.cleanUi,
    selectedEntityId,
    setDisplayMode,
    setDisplayTuning,
    trackedEntityId,
    trackEntity,
  ])
}
