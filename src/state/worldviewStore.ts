import { create } from 'zustand'
import { DEFAULT_LAYER_SETTINGS } from '../config/layerDefaults'
import { DEFAULT_DISPLAY_TUNING } from '../config/displayModes'
import type { DisplayModeId, DisplayTuning } from '../types/display'
import type { FeedHealth, FlightFilter, NewsFilter, SeismicFilter, WorldEntity, WorldEntityType } from '../types/entities'
import type { LayerId, LayerSettingsRecord } from '../types/layers'
import { distanceKm } from '../utils/geo'
import { subtractWindowMs } from '../utils/time'

interface UiSettings {
  showGridOverlay: boolean
  showEntityLabels: boolean
  showFeedHealth: boolean
  highDensityMode: boolean
}

interface WorldviewState {
  entitiesById: Record<string, WorldEntity>
  sourceEntityIds: Record<string, string[]>
  feedHealth: Record<string, FeedHealth>
  layerSettings: LayerSettingsRecord
  selectedEntityId: string | null
  trackedEntityId: string | null
  displayMode: DisplayModeId
  displayTuning: DisplayTuning
  newsFilter: NewsFilter
  seismicFilter: SeismicFilter
  flightFilter: FlightFilter
  uiSettings: UiSettings
  mapCenter: { lat: number; lon: number }
  searchQuery: string
  setSourceEntities: (source: string, entities: WorldEntity[]) => void
  setFeedHealth: (source: string, health: FeedHealth) => void
  setLayerVisibility: (layerId: LayerId, visible: boolean) => void
  setLayerOpacity: (layerId: LayerId, opacity: number) => void
  setLayerIntensity: (layerId: LayerId, intensity: number) => void
  selectEntity: (entityId: string | null) => void
  trackEntity: (entityId: string | null) => void
  setDisplayMode: (mode: DisplayModeId) => void
  setDisplayTuning: (patch: Partial<DisplayTuning>) => void
  setMapCenter: (lat: number, lon: number) => void
  setNewsFilter: (patch: Partial<NewsFilter>) => void
  setSeismicFilter: (patch: Partial<SeismicFilter>) => void
  setFlightFilter: (patch: Partial<FlightFilter>) => void
  setUiSettings: (patch: Partial<UiSettings>) => void
  toggleGridOverlay: () => void
  toggleEntityLabels: () => void
  toggleFeedHealth: () => void
  toggleHighDensityMode: () => void
  setSearchQuery: (value: string) => void
}

export const useWorldviewStore = create<WorldviewState>((set) => ({
  entitiesById: {},
  sourceEntityIds: {},
  feedHealth: {},
  layerSettings: DEFAULT_LAYER_SETTINGS,
  selectedEntityId: null,
  trackedEntityId: null,
  displayMode: 'nvg',
  displayTuning: DEFAULT_DISPLAY_TUNING,
  newsFilter: {
    radiusKm: 2500,
    timeWindow: '24h',
    category: 'all',
  },
  seismicFilter: {
    timeWindow: '24h',
  },
  flightFilter: {
    callsign: '',
    altitudeRange: [0, 13_500],
    speedRange: [0, 700],
  },
  uiSettings: {
    showGridOverlay: true,
    showEntityLabels: true,
    showFeedHealth: true,
    highDensityMode: false,
  },
  mapCenter: { lat: 20, lon: 0 },
  searchQuery: '',
  setSourceEntities: (source, entities) => {
    set((state) => {
      const nextEntities = { ...state.entitiesById }
      const previousIds = state.sourceEntityIds[source] ?? []
      previousIds.forEach((id) => {
        delete nextEntities[id]
      })

      const ids = entities.map((entity) => entity.entityId)
      entities.forEach((entity) => {
        nextEntities[entity.entityId] = entity
      })

      return {
        entitiesById: nextEntities,
        sourceEntityIds: {
          ...state.sourceEntityIds,
          [source]: ids,
        },
      }
    })
  },
  setFeedHealth: (source, health) =>
    set((state) => ({
      feedHealth: {
        ...state.feedHealth,
        [source]: health,
      },
    })),
  setLayerVisibility: (layerId, visible) =>
    set((state) => ({
      layerSettings: {
        ...state.layerSettings,
        [layerId]: {
          ...state.layerSettings[layerId],
          visible,
        },
      },
    })),
  setLayerOpacity: (layerId, opacity) =>
    set((state) => ({
      layerSettings: {
        ...state.layerSettings,
        [layerId]: {
          ...state.layerSettings[layerId],
          opacity,
        },
      },
    })),
  setLayerIntensity: (layerId, intensity) =>
    set((state) => ({
      layerSettings: {
        ...state.layerSettings,
        [layerId]: {
          ...state.layerSettings[layerId],
          intensity,
        },
      },
    })),
  selectEntity: (entityId) => set({ selectedEntityId: entityId }),
  trackEntity: (entityId) => set({ trackedEntityId: entityId }),
  setDisplayMode: (mode) => set({ displayMode: mode }),
  setDisplayTuning: (patch) =>
    set((state) => ({
      displayTuning: {
        ...state.displayTuning,
        ...patch,
      },
    })),
  setMapCenter: (lat, lon) => set({ mapCenter: { lat, lon } }),
  setNewsFilter: (patch) =>
    set((state) => ({
      newsFilter: {
        ...state.newsFilter,
        ...patch,
      },
    })),
  setSeismicFilter: (patch) =>
    set((state) => ({
      seismicFilter: {
        ...state.seismicFilter,
        ...patch,
      },
    })),
  setFlightFilter: (patch) =>
    set((state) => ({
      flightFilter: {
        ...state.flightFilter,
        ...patch,
      },
    })),
  setUiSettings: (patch) =>
    set((state) => ({
      uiSettings: {
        ...state.uiSettings,
        ...patch,
      },
    })),
  toggleGridOverlay: () =>
    set((state) => ({
      uiSettings: {
        ...state.uiSettings,
        showGridOverlay: !state.uiSettings.showGridOverlay,
      },
    })),
  toggleEntityLabels: () =>
    set((state) => ({
      uiSettings: {
        ...state.uiSettings,
        showEntityLabels: !state.uiSettings.showEntityLabels,
      },
    })),
  toggleFeedHealth: () =>
    set((state) => ({
      uiSettings: {
        ...state.uiSettings,
        showFeedHealth: !state.uiSettings.showFeedHealth,
      },
    })),
  toggleHighDensityMode: () =>
    set((state) => ({
      uiSettings: {
        ...state.uiSettings,
        highDensityMode: !state.uiSettings.highDensityMode,
      },
    })),
  setSearchQuery: (value) => set({ searchQuery: value }),
}))

const layerTypeMap: Record<LayerId, WorldEntityType> = {
  satellites: 'satellite',
  flightsCommercial: 'aircraft_commercial',
  flightsMilitary: 'aircraft_military',
  cctv: 'cctv_camera',
  traffic: 'traffic_agent',
  seismic: 'seismic_event',
  news: 'news_item',
  landmarks: 'landmark',
}

export const selectAllEntities = (state: WorldviewState) => Object.values(state.entitiesById)

export const selectEntityById = (state: WorldviewState, id: string | null) =>
  id ? state.entitiesById[id] : null

type FilterContext = Pick<
  WorldviewState,
  | 'entitiesById'
  | 'seismicFilter'
  | 'newsFilter'
  | 'flightFilter'
  | 'layerSettings'
  | 'searchQuery'
  | 'mapCenter'
>

export const getFilteredEntities = (state: FilterContext) => {
  const entities = Object.values(state.entitiesById)
  const seismicWindowStart = subtractWindowMs(state.seismicFilter.timeWindow)
  const newsWindowStart = subtractWindowMs(state.newsFilter.timeWindow)

  return entities.filter((entity) => {
    const layerEntry = Object.entries(layerTypeMap).find(([, type]) => type === entity.entityType)
    if (layerEntry) {
      const [layerId] = layerEntry as [LayerId, WorldEntityType]
      if (!state.layerSettings[layerId].visible) return false
    }

    if (entity.entityType === 'aircraft_commercial' || entity.entityType === 'aircraft_military') {
      const callsign = String(entity.metadata.callsign ?? entity.label).toLowerCase()
      if (state.flightFilter.callsign && !callsign.includes(state.flightFilter.callsign.toLowerCase())) {
        return false
      }
      const altitude = Number(entity.metadata.altitudeM ?? entity.position.alt ?? 0)
      const speed = Number(entity.metadata.speedKts ?? entity.speed ?? 0)
      if (altitude < state.flightFilter.altitudeRange[0] || altitude > state.flightFilter.altitudeRange[1]) {
        return false
      }
      if (speed < state.flightFilter.speedRange[0] || speed > state.flightFilter.speedRange[1]) {
        return false
      }
    }

    if (entity.entityType === 'seismic_event' && entity.timestamp < seismicWindowStart) {
      return false
    }

    if (entity.entityType === 'news_item') {
      if (entity.timestamp < newsWindowStart) return false
      const category = String(entity.metadata.category ?? 'general')
      if (state.newsFilter.category !== 'all' && category !== state.newsFilter.category) {
        return false
      }
      const distance = distanceKm(entity.position, state.mapCenter)
      if (distance > state.newsFilter.radiusKm) return false
    }

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase()
      const target = `${entity.label} ${entity.entityId} ${JSON.stringify(entity.metadata)}`.toLowerCase()
      if (!target.includes(query)) return false
    }

    return true
  })
}

export const selectFilteredEntities = (state: WorldviewState) => getFilteredEntities(state)

export const selectEntityCounts = (state: WorldviewState) =>
  getFilteredEntities(state).reduce<Record<WorldEntityType, number>>(
    (acc, entity) => {
      acc[entity.entityType] += 1
      return acc
    },
    {
      satellite: 0,
      aircraft_commercial: 0,
      aircraft_military: 0,
      cctv_camera: 0,
      seismic_event: 0,
      traffic_agent: 0,
      landmark: 0,
      news_item: 0,
    },
  )

export type { WorldviewState }
