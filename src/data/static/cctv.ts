import type { GeoPosition } from '../../types/entities'

export interface CctvSeed {
  id: string
  name: string
  city: string
  position: GeoPosition
  streamUrl: string
  provider: string
}

export const CCTV_SEEDS: CctvSeed[] = [
  {
    id: 'cctv-nyc-times-square',
    name: 'Times Square Live Cam',
    city: 'New York',
    position: { lat: 40.758, lon: -73.9855, alt: 35 },
    streamUrl: 'https://www.youtube.com/embed/1-iS7LArMPA',
    provider: 'YouTube Public',
  },
  {
    id: 'cctv-london-trafalgar',
    name: 'Trafalgar Square Cam',
    city: 'London',
    position: { lat: 51.508, lon: -0.1281, alt: 32 },
    streamUrl: 'https://www.youtube.com/embed/9Auq9mYxFEE',
    provider: 'YouTube Public',
  },
  {
    id: 'cctv-tokyo-shibuya',
    name: 'Shibuya Crossing Cam',
    city: 'Tokyo',
    position: { lat: 35.6595, lon: 139.7005, alt: 25 },
    streamUrl: 'https://www.youtube.com/embed/hHW1oY26kxQ',
    provider: 'YouTube Public',
  },
  {
    id: 'cctv-sydney-harbour',
    name: 'Sydney Harbour Cam',
    city: 'Sydney',
    position: { lat: -33.8606, lon: 151.211, alt: 30 },
    streamUrl: 'https://www.youtube.com/embed/boYQ5k9k26I',
    provider: 'YouTube Public',
  },
  {
    id: 'cctv-berlin-alex',
    name: 'Berlin Alexanderplatz Cam',
    city: 'Berlin',
    position: { lat: 52.5219, lon: 13.4132, alt: 28 },
    streamUrl: 'https://www.youtube.com/embed/21X5lGlDOfg',
    provider: 'YouTube Public',
  },
]
