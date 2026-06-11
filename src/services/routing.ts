import type { TripRoute, TripStop } from '../types/trip'

type OsrmRouteResponse = {
  code: string
  routes?: Array<{
    geometry: GeoJSON.LineString
    distance: number
    duration: number
    legs: Array<{
      distance: number
      duration: number
    }>
  }>
  message?: string
}

function toOsrmCoordinate(stop: TripStop): string {
  return `${stop.lng},${stop.lat}`
}

export async function calculateDrivingRoute(
  stops: TripStop[],
): Promise<TripRoute> {
  if (stops.length < 2) {
    throw new Error('At least two stops are required')
  }

  const coordinates = stops.map(toOsrmCoordinate).join(';')
  const params = new URLSearchParams({
    overview: 'full',
    geometries: 'geojson',
  })

  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${coordinates}?${params.toString()}`,
  )

  if (!response.ok) {
    throw new Error('Route request failed')
  }

  const data = (await response.json()) as OsrmRouteResponse
  const route = data.routes?.[0]

  if (data.code !== 'Ok' || !route) {
    throw new Error(data.message || 'No route found')
  }

  return {
    geometry: route.geometry,
    distanceMeters: route.distance,
    durationSeconds: route.duration,
    legs: route.legs.map((leg, index) => ({
      fromStopId: stops[index].id,
      toStopId: stops[index + 1].id,
      fromName: stops[index].name,
      toName: stops[index + 1].name,
      distanceMeters: leg.distance,
      durationSeconds: leg.duration,
    })),
  }
}
