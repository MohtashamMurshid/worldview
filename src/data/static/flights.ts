import type { GeoPosition } from '../../types/entities'

export interface FlightSeed {
  id: string
  callsign: string
  position: GeoPosition
  heading: number
  altitudeM: number
  speedKts: number
}

export const COMMERCIAL_FLIGHT_SEEDS: FlightSeed[] = [
  {
    id: 'flt-aa101',
    callsign: 'AAL101',
    position: { lat: 52.1, lon: -20.3, alt: 10200 },
    heading: 72,
    altitudeM: 10200,
    speedKts: 455,
  },
  {
    id: 'flt-ba215',
    callsign: 'BAW215',
    position: { lat: 49.3, lon: -35.2, alt: 10800 },
    heading: 88,
    altitudeM: 10800,
    speedKts: 472,
  },
  {
    id: 'flt-jl71',
    callsign: 'JAL071',
    position: { lat: 41.1, lon: 149.2, alt: 10100 },
    heading: 95,
    altitudeM: 10100,
    speedKts: 448,
  },
  {
    id: 'flt-ek202',
    callsign: 'UAE202',
    position: { lat: 32.8, lon: 54.2, alt: 9600 },
    heading: 128,
    altitudeM: 9600,
    speedKts: 440,
  },
  {
    id: 'flt-ua88',
    callsign: 'UAL088',
    position: { lat: 36.9, lon: -140.1, alt: 11000 },
    heading: 102,
    altitudeM: 11000,
    speedKts: 481,
  },
]

export const MILITARY_FLIGHT_SEEDS: FlightSeed[] = [
  {
    id: 'mil-rch190',
    callsign: 'RCH190',
    position: { lat: 34.4, lon: -21.4, alt: 8300 },
    heading: 75,
    altitudeM: 8300,
    speedKts: 370,
  },
  {
    id: 'mil-navy21',
    callsign: 'NAVY021',
    position: { lat: 31.7, lon: 126.4, alt: 7900 },
    heading: 130,
    altitudeM: 7900,
    speedKts: 356,
  },
  {
    id: 'mil-hawk42',
    callsign: 'HAWK042',
    position: { lat: 42.1, lon: 14.5, alt: 7200 },
    heading: 242,
    altitudeM: 7200,
    speedKts: 332,
  },
]
