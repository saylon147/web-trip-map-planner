import { MapCanvas } from '../map/MapCanvas'

export function MapPanel() {
  return (
    <section className="map-panel" aria-label="Trip map">
      <MapCanvas />
    </section>
  )
}
