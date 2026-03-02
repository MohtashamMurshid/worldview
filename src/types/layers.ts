export type LayerId =
  | 'satellites'
  | 'flightsCommercial'
  | 'flightsMilitary'
  | 'cctv'
  | 'traffic'
  | 'seismic'
  | 'news'
  | 'landmarks'

export interface LayerSetting {
  id: LayerId
  label: string
  visible: boolean
  opacity: number
  intensity: number
}

export type LayerSettingsRecord = Record<LayerId, LayerSetting>
