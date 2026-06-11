import { Marker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import { useTripStore } from '../../store/tripStore'

function SelectedStopView() {
  const map = useMap()
  const selectedStop = useTripStore((state) =>
    state.stops.find((stop) => stop.id === state.selectedStopId),
  )

  useEffect(() => {
    if (!selectedStop) return

    map.flyTo([selectedStop.lat, selectedStop.lng], Math.max(map.getZoom(), 14), {
      duration: 0.8,
    })
  }, [map, selectedStop])

  return null
}

export function TripMarkers() {
  const stops = useTripStore((state) => state.stops)
  const selectedStopId = useTripStore((state) => state.selectedStopId)
  const selectStop = useTripStore((state) => state.selectStop)

  return (
    <>
      <SelectedStopView />
      {stops.map((stop) => (
        <Marker
          eventHandlers={{
            click: () => selectStop(stop.id),
          }}
          key={stop.id}
          opacity={selectedStopId === stop.id ? 1 : 0.78}
          position={[stop.lat, stop.lng]}
        >
          <Popup>
            <strong>{stop.name}</strong>
            {stop.address ? <p>{stop.address}</p> : null}
          </Popup>
        </Marker>
      ))}
    </>
  )
}
