export type DisplayModeId = 'normal' | 'crt' | 'nvg' | 'flir'

export interface DisplayTuning {
  intensity: number
  sharpness: number
  noise: number
  bloom: number
  cleanUi: boolean
}

export interface DisplayModePreset {
  id: DisplayModeId
  label: string
  description: string
}
