import type { GeoPosition } from '../../types/entities'

export interface NewsSeed {
  id: string
  headline: string
  category: 'disaster' | 'transport' | 'conflict' | 'infrastructure' | 'weather' | 'general'
  summary: string
  url: string
  publishedAt: number
  position: GeoPosition
  source: string
}

const now = Date.now()

export const NEWS_SEEDS: NewsSeed[] = [
  {
    id: 'news-1',
    headline: 'Strong aftershocks reported near Pacific trench',
    category: 'disaster',
    summary: 'Authorities continue to monitor aftershock activity and issue marine advisories.',
    url: 'https://earthquake.usgs.gov/',
    publishedAt: now - 1000 * 60 * 48,
    position: { lat: 35.2, lon: 142.8, alt: 0 },
    source: 'USGS Wire',
  },
  {
    id: 'news-2',
    headline: 'Major airport sees temporary runway congestion',
    category: 'transport',
    summary: 'Air traffic control is sequencing inbound flights due to weather-driven spacing constraints.',
    url: 'https://opensky-network.org/',
    publishedAt: now - 1000 * 60 * 120,
    position: { lat: 51.47, lon: -0.4543, alt: 0 },
    source: 'OpenSky Bulletin',
  },
  {
    id: 'news-3',
    headline: 'Heat warning escalates across metropolitan region',
    category: 'weather',
    summary: 'Emergency teams open cooling points and advise reduced outdoor activity.',
    url: 'https://eonet.gsfc.nasa.gov/',
    publishedAt: now - 1000 * 60 * 220,
    position: { lat: 40.73, lon: -73.93, alt: 0 },
    source: 'EONET Digest',
  },
  {
    id: 'news-4',
    headline: 'Port infrastructure inspections underway after storm surge',
    category: 'infrastructure',
    summary: 'Inspections ongoing across container and bulk terminals with phased reopening plans.',
    url: 'https://reliefweb.int/',
    publishedAt: now - 1000 * 60 * 400,
    position: { lat: 1.2627, lon: 103.82, alt: 0 },
    source: 'ReliefWeb',
  },
]
