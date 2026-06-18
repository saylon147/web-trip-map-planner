export type TripStopSource = 'search' | 'import'

export type CustomMapMarker = {
  id: string
  type: 'point'
  label: string
  x: number
  y: number
}

export type CustomMapRegion = {
  id: string
  type: 'region'
  label: string
  x: number
  y: number
  width: number
  height: number
}

export type CustomMapAnnotation = CustomMapMarker | CustomMapRegion

export type TripStopCustomMap = {
  imageStorageKey: string
  imageName: string
  annotations: CustomMapAnnotation[]
}

export type TripStop = {
  id: string
  name: string
  lat: number
  lng: number
  address?: string
  source: TripStopSource
  customMap?: TripStopCustomMap
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
