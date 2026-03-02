import type { CSSProperties } from 'react'
import type { DisplayModeId, DisplayTuning } from '../../types/display'

export const getModeClassName = (mode: DisplayModeId) => `mode-${mode}`

export const getModeStyle = (tuning: DisplayTuning): CSSProperties => ({
  '--wv-intensity': `${tuning.intensity / 100}`,
  '--wv-noise': `${tuning.noise / 100}`,
  '--wv-sharpness': `${1 + tuning.sharpness / 100}`,
  '--wv-bloom': `${tuning.bloom / 100}`,
}) as CSSProperties
