import { Polyline } from 'react-leaflet'
import { useTripStore } from '../../store/tripStore'

export function RouteLayer() {
  const route = useTripStore((state) => state.route)

  if (!route) return null

  const positions = route.geometry.coordinates.map(
    ([lng, lat]) => [lat, lng] as [number, number],
  )

  return (
    <Polyline
      pathOptions={{
        color: '#1f6feb',
        opacity: 0.88,
        weight: 5,
      }}
      positions={positions}
    />
  )
}
