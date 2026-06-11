import type { TripSnapshot, TripStop } from '../types/trip'

const STORAGE_KEY = 'web-trip-map-planner:trip-stops'

function normalizeTripStop(value: unknown): TripStop | null {
  if (!value || typeof value !== 'object') return null

  const stop = value as Record<string, unknown>
  const isValid =
    typeof stop.id === 'string' &&
    typeof stop.name === 'string' &&
    typeof stop.lat === 'number' &&
    Number.isFinite(stop.lat) &&
    typeof stop.lng === 'number' &&
    Number.isFinite(stop.lng) &&
    (stop.address === undefined || typeof stop.address === 'string')

  if (!isValid) return null

  return {
    id: stop.id as string,
    name: stop.name as string,
    lat: stop.lat as number,
    lng: stop.lng as number,
    address: stop.address as string | undefined,
    source: stop.source === 'search' ? 'search' : 'import',
  }
}

function normalizeTripStops(values: unknown[]): TripStop[] {
  return values.flatMap((value) => {
    const stop = normalizeTripStop(value)
    return stop ? [stop] : []
  })
}

export function createTripSnapshot(stops: TripStop[]): TripSnapshot {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    stops,
  }
}

export function saveTripSnapshot(stops: TripStop[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(createTripSnapshot(stops)))
}

export function loadTripSnapshot(): TripSnapshot | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  return parseTripSnapshot(raw)
}

export function parseTripSnapshot(raw: string): TripSnapshot {
  const parsed = JSON.parse(raw) as unknown

  if (Array.isArray(parsed)) {
    return createTripSnapshot(normalizeTripStops(parsed))
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid trip JSON')
  }

  const snapshot = parsed as Record<string, unknown>
  if (!Array.isArray(snapshot.stops)) {
    throw new Error('Trip JSON must include a stops array')
  }

  return createTripSnapshot(normalizeTripStops(snapshot.stops))
}
