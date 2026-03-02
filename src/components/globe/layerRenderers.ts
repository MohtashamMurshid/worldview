import {
  Cartesian2,
  Cartesian3,
  Color,
  CustomDataSource,
  Entity,
  LabelStyle,
  VerticalOrigin,
  type Viewer,
  type EntityCollection,
} from 'cesium'
import type { WorldEntity } from '../../types/entities'

const entityColor = (entity: WorldEntity, selected: boolean) => {
  if (selected) return Color.WHITE
  switch (entity.entityType) {
    case 'satellite':
      return Color.CYAN
    case 'aircraft_commercial':
      return Color.fromCssColorString('#53d9ff')
    case 'aircraft_military':
      return Color.fromCssColorString('#ff7066')
    case 'cctv_camera':
      return Color.fromCssColorString('#fda34f')
    case 'seismic_event': {
      const magnitude = Number(entity.metadata.magnitude ?? 0)
      return magnitude >= 6 ? Color.RED : magnitude >= 5 ? Color.ORANGE : Color.YELLOW
    }
    case 'traffic_agent':
      return Color.fromCssColorString('#9f80ff')
    case 'news_item':
      return Color.fromCssColorString('#7cffb2')
    case 'landmark':
      return Color.fromCssColorString('#87d4ff')
    default:
      return Color.SILVER
  }
}

const entityPixelSize = (entity: WorldEntity) => {
  switch (entity.entityType) {
    case 'satellite':
      return 9
    case 'aircraft_military':
      return 8
    case 'aircraft_commercial':
      return 7
    case 'seismic_event': {
      const magnitude = Number(entity.metadata.magnitude ?? 0)
      return 6 + Math.max(0, magnitude)
    }
    case 'traffic_agent':
      return 4
    default:
      return 6
  }
}

const shouldShowLabel = (entity: WorldEntity) =>
  entity.entityType === 'satellite' ||
  entity.entityType === 'aircraft_military' ||
  entity.entityType === 'news_item' ||
  entity.entityType === 'seismic_event'

const createEntity = (worldEntity: WorldEntity, selectedEntityId: string | null) => {
  const color = entityColor(worldEntity, selectedEntityId === worldEntity.entityId)
  const point = {
    pixelSize: entityPixelSize(worldEntity),
    color,
    outlineColor: Color.BLACK,
    outlineWidth: 1.5,
    translucencyByDistance: undefined,
  }

  const entity = new Entity({
    id: worldEntity.entityId,
    position: Cartesian3.fromDegrees(
      worldEntity.position.lon,
      worldEntity.position.lat,
      worldEntity.position.alt ?? 0,
    ),
    point,
    label: shouldShowLabel(worldEntity)
      ? {
          text: worldEntity.label.slice(0, 28),
          font: '12px "Segoe UI", sans-serif',
          fillColor: color,
          outlineColor: Color.BLACK,
          outlineWidth: 2,
          style: LabelStyle.FILL_AND_OUTLINE,
          showBackground: true,
          backgroundColor: Color.BLACK.withAlpha(0.45),
          pixelOffset: new Cartesian2(0, -16),
          verticalOrigin: VerticalOrigin.BOTTOM,
          scale: 0.8,
        }
      : undefined,
    properties: {
      worldEntityId: worldEntity.entityId,
      worldEntityType: worldEntity.entityType,
    },
  } as unknown as ConstructorParameters<typeof Entity>[0])

  if (worldEntity.entityType === 'satellite') {
    const path = worldEntity.metadata.orbitPath
    if (Array.isArray(path) && path.length > 1) {
      const positions = path
        .map((node) => {
          if (!node || typeof node !== 'object') return null
          const lat = Number((node as Record<string, unknown>).lat)
          const lon = Number((node as Record<string, unknown>).lon)
          const alt = Number((node as Record<string, unknown>).alt ?? 0)
          if (Number.isNaN(lat) || Number.isNaN(lon)) return null
          return Cartesian3.fromDegrees(lon, lat, alt)
        })
        .filter((node): node is Cartesian3 => Boolean(node))

      if (positions.length > 1) {
        entity.polyline = {
          positions,
          width: 1.8,
          material: color.withAlpha(0.6),
        } as unknown as Entity['polyline']
      }
    }
  }

  return entity
}

export const syncLayerEntities = (
  viewer: Viewer,
  dataSource: CustomDataSource,
  entities: WorldEntity[],
  selectedEntityId: string | null,
) => {
  const collection: EntityCollection = dataSource.entities
  collection.removeAll()
  entities.forEach((entity) => {
    collection.add(createEntity(entity, selectedEntityId))
  })

  if (!viewer.dataSources.contains(dataSource)) {
    void viewer.dataSources.add(dataSource)
  }
}
