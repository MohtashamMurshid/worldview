export interface CameraPreset {
  id: string
  label: string
  lat: number
  lon: number
  height: number
  heading?: number
  pitch?: number
}

export const CAMERA_PRESETS: CameraPreset[] = [
  { id: 'nyc', label: 'New York', lat: 40.7128, lon: -74.006, height: 6200, pitch: -35 },
  { id: 'london', label: 'London', lat: 51.5072, lon: -0.1276, height: 6200, pitch: -35 },
  { id: 'tokyo', label: 'Tokyo', lat: 35.6764, lon: 139.65, height: 6500, pitch: -34 },
  { id: 'paris', label: 'Paris', lat: 48.8566, lon: 2.3522, height: 6200, pitch: -33 },
  { id: 'berlin', label: 'Berlin', lat: 52.52, lon: 13.405, height: 6200, pitch: -34 },
  { id: 'sydney', label: 'Sydney', lat: -33.8688, lon: 151.2093, height: 6300, pitch: -33 },
  { id: 'seoul', label: 'Seoul', lat: 37.5665, lon: 126.978, height: 6300, pitch: -35 },
  { id: 'singapore', label: 'Singapore', lat: 1.3521, lon: 103.8198, height: 6100, pitch: -30 },
  { id: 'dubai', label: 'Dubai', lat: 25.2048, lon: 55.2708, height: 6300, pitch: -35 },
  { id: 'mumbai', label: 'Mumbai', lat: 19.076, lon: 72.8777, height: 6400, pitch: -35 },
  { id: 'delhi', label: 'Delhi', lat: 28.6139, lon: 77.209, height: 6400, pitch: -35 },
  { id: 'shanghai', label: 'Shanghai', lat: 31.2304, lon: 121.4737, height: 6500, pitch: -35 },
  { id: 'cape-town', label: 'Cape Town', lat: -33.9249, lon: 18.4241, height: 6400, pitch: -35 },
  { id: 'rio', label: 'Rio', lat: -22.9068, lon: -43.1729, height: 6400, pitch: -35 },
  { id: 'los-angeles', label: 'Los Angeles', lat: 34.0522, lon: -118.2437, height: 6400, pitch: -35 },
  { id: 'san-francisco', label: 'San Francisco', lat: 37.7749, lon: -122.4194, height: 6300, pitch: -34 },
  { id: 'toronto', label: 'Toronto', lat: 43.6532, lon: -79.3832, height: 6200, pitch: -34 },
  { id: 'mexico-city', label: 'Mexico City', lat: 19.4326, lon: -99.1332, height: 6500, pitch: -36 },
  { id: 'istanbul', label: 'Istanbul', lat: 41.0082, lon: 28.9784, height: 6300, pitch: -34 },
  { id: 'moscow', label: 'Moscow', lat: 55.7558, lon: 37.6176, height: 6200, pitch: -34 },
  { id: 'lagos', label: 'Lagos', lat: 6.5244, lon: 3.3792, height: 6400, pitch: -34 },
  { id: 'sao-paulo', label: 'São Paulo', lat: -23.5505, lon: -46.6333, height: 6500, pitch: -35 },
]
