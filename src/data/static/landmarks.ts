import type { GeoPosition } from '../../types/entities'

export interface LandmarkSeed {
  id: string
  name: string
  city: string
  country: string
  position: GeoPosition
}

export const LANDMARK_SEEDS: LandmarkSeed[] = [
  {
    id: 'landmark-statue-of-liberty',
    name: 'Statue of Liberty',
    city: 'New York',
    country: 'USA',
    position: { lat: 40.6892, lon: -74.0445, alt: 70 },
  },
  {
    id: 'landmark-eiffel',
    name: 'Eiffel Tower',
    city: 'Paris',
    country: 'France',
    position: { lat: 48.8584, lon: 2.2945, alt: 100 },
  },
  {
    id: 'landmark-burj-khalifa',
    name: 'Burj Khalifa',
    city: 'Dubai',
    country: 'UAE',
    position: { lat: 25.1972, lon: 55.2744, alt: 850 },
  },
  {
    id: 'landmark-big-ben',
    name: 'Big Ben',
    city: 'London',
    country: 'UK',
    position: { lat: 51.5007, lon: -0.1246, alt: 90 },
  },
  {
    id: 'landmark-shibuya',
    name: 'Shibuya Crossing',
    city: 'Tokyo',
    country: 'Japan',
    position: { lat: 35.6595, lon: 139.7005, alt: 20 },
  },
  {
    id: 'landmark-opera-house',
    name: 'Sydney Opera House',
    city: 'Sydney',
    country: 'Australia',
    position: { lat: -33.8568, lon: 151.2153, alt: 40 },
  },
  {
    id: 'landmark-golden-gate',
    name: 'Golden Gate Bridge',
    city: 'San Francisco',
    country: 'USA',
    position: { lat: 37.8199, lon: -122.4783, alt: 67 },
  },
  {
    id: 'landmark-berlin-gate',
    name: 'Brandenburg Gate',
    city: 'Berlin',
    country: 'Germany',
    position: { lat: 52.5163, lon: 13.3777, alt: 50 },
  },
  {
    id: 'landmark-giza',
    name: 'Great Pyramid of Giza',
    city: 'Giza',
    country: 'Egypt',
    position: { lat: 29.9792, lon: 31.1342, alt: 120 },
  },
  {
    id: 'landmark-christ-redeemer',
    name: 'Christ the Redeemer',
    city: 'Rio de Janeiro',
    country: 'Brazil',
    position: { lat: -22.9519, lon: -43.2105, alt: 710 },
  },
]
