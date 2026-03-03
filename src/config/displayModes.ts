import type { DisplayModePreset, DisplayTuning } from '../types/display'

export const DISPLAY_MODE_PRESETS: DisplayModePreset[] = [
  { id: 'normal', label: 'Normal', description: 'Natural full-color imagery.' },
  { id: 'crt', label: 'CRT', description: 'Analog phosphor scanline display mode.' },
  { id: 'nvg', label: 'NVG', description: 'Night-vision tactical green mode.' },
  { id: 'flir', label: 'FLIR', description: 'Thermal-inspired false-color mode.' },
]

export const DEFAULT_DISPLAY_TUNING: DisplayTuning = {
  intensity: 55,
  sharpness: 45,
  noise: 30,
  bloom: 35,
  cleanUi: false,
}
