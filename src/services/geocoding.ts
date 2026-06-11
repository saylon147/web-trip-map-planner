export type GeocodingResult = {
  id: string
  name: string
  displayName: string
  lat: number
  lng: number
}

type NominatimResult = {
  place_id: number
  name?: string
  display_name: string
  lat: string
  lon: string
}

export async function searchPlaces(query: string): Promise<GeocodingResult[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  const params = new URLSearchParams({
    format: 'jsonv2',
    q: trimmed,
    limit: '6',
    addressdetails: '1',
  })

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    {
      headers: {
        Accept: 'application/json',
      },
    },
  )

  if (!response.ok) {
    throw new Error('Search request failed')
  }

  const results = (await response.json()) as NominatimResult[]

  return results.map((result) => ({
    id: String(result.place_id),
    name: result.name || result.display_name.split(',')[0] || 'Unnamed place',
    displayName: result.display_name,
    lat: Number(result.lat),
    lng: Number(result.lon),
  }))
}
