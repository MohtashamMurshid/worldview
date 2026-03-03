import type { GeoPosition } from '../../types/entities'

export interface TrafficRouteSeed {
  id: string
  city: string
  points: GeoPosition[]
}

export const TRAFFIC_ROUTE_SEEDS: TrafficRouteSeed[] = [
  {
    id: 'traffic-nyc-midtown',
    city: 'New York',
    points: [
      { lat: 40.7485, lon: -73.9857, alt: 5 },
      { lat: 40.7527, lon: -73.9813, alt: 5 },
      { lat: 40.7577, lon: -73.9772, alt: 5 },
      { lat: 40.7612, lon: -73.9737, alt: 5 },
    ],
  },
  {
    id: 'traffic-london-central',
    city: 'London',
    points: [
      { lat: 51.5033, lon: -0.1196, alt: 5 },
      { lat: 51.5079, lon: -0.1281, alt: 5 },
      { lat: 51.511, lon: -0.1335, alt: 5 },
      { lat: 51.5132, lon: -0.1423, alt: 5 },
    ],
  },
  {
    id: 'traffic-tokyo-shinjuku',
    city: 'Tokyo',
    points: [
      { lat: 35.6895, lon: 139.6917, alt: 5 },
      { lat: 35.6924, lon: 139.7002, alt: 5 },
      { lat: 35.6952, lon: 139.7054, alt: 5 },
      { lat: 35.6991, lon: 139.7102, alt: 5 },
    ],
  },
  {
    id: 'traffic-dubai-sheikh-zayed',
    city: 'Dubai',
    points: [
      { lat: 25.2048, lon: 55.2708, alt: 5 },
      { lat: 25.2143, lon: 55.2798, alt: 5 },
      { lat: 25.2285, lon: 55.2892, alt: 5 },
      { lat: 25.2425, lon: 55.2974, alt: 5 },
    ],
  },
]
