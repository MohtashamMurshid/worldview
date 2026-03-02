export interface SatelliteSeed {
  id: string
  name: string
  inclination: number
  altitudeKm: number
  phaseOffset: number
  speedKms: number
}

export const SATELLITE_SEEDS: SatelliteSeed[] = [
  {
    id: 'sat-iss',
    name: 'ISS (ZARYA)',
    inclination: 51.6,
    altitudeKm: 420,
    phaseOffset: 0.1,
    speedKms: 7.66,
  },
  {
    id: 'sat-hst',
    name: 'Hubble',
    inclination: 28.5,
    altitudeKm: 540,
    phaseOffset: 0.42,
    speedKms: 7.5,
  },
  {
    id: 'sat-starlink-2873',
    name: 'Starlink-2873',
    inclination: 53.0,
    altitudeKm: 550,
    phaseOffset: 0.64,
    speedKms: 7.57,
  },
  {
    id: 'sat-noaa-20',
    name: 'NOAA-20',
    inclination: 98.7,
    altitudeKm: 824,
    phaseOffset: 0.28,
    speedKms: 7.4,
  },
]
