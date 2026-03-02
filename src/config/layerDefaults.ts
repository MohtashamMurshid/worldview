import type { LayerSettingsRecord } from '../types/layers'

export const DEFAULT_LAYER_SETTINGS: LayerSettingsRecord = {
  satellites: {
    id: 'satellites',
    label: 'Satellite Mesh',
    visible: true,
    opacity: 1,
    intensity: 0.8,
  },
  flightsCommercial: {
    id: 'flightsCommercial',
    label: 'Commercial Flights',
    visible: true,
    opacity: 0.9,
    intensity: 0.7,
  },
  flightsMilitary: {
    id: 'flightsMilitary',
    label: 'Military Flights',
    visible: true,
    opacity: 1,
    intensity: 0.8,
  },
  cctv: {
    id: 'cctv',
    label: 'CCTV Mesh',
    visible: true,
    opacity: 1,
    intensity: 0.85,
  },
  traffic: {
    id: 'traffic',
    label: 'Street Traffic',
    visible: true,
    opacity: 0.8,
    intensity: 0.8,
  },
  seismic: {
    id: 'seismic',
    label: 'Seismic',
    visible: true,
    opacity: 1,
    intensity: 1,
  },
  news: {
    id: 'news',
    label: 'Area News',
    visible: true,
    opacity: 0.95,
    intensity: 0.75,
  },
  landmarks: {
    id: 'landmarks',
    label: 'Landmarks',
    visible: true,
    opacity: 0.8,
    intensity: 0.7,
  },
}
