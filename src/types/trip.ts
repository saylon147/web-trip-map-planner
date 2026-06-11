export type TripStopSource = 'search' | 'import'

export type TripStop = {
  id: string
  name: string
  lat: number
  lng: number
  address?: string
  source: TripStopSource
}

export type TripRouteLeg = {
  fromStopId: string
  toStopId: string
  fromName: string
  toName: string
  distanceMeters: number
  durationSeconds: number
}

export type TripRoute = {
  geometry: GeoJSON.LineString
  distanceMeters: number
  durationSeconds: number
  legs: TripRouteLeg[]
}

export type TripSnapshot = {
  version: 1
  savedAt: string
  stops: TripStop[]
}
