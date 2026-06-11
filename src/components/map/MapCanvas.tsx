import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
import '../../styles/map.css'

const SHANGHAI_PEOPLES_SQUARE: [number, number] = [31.2304, 121.4737]

export function MapCanvas() {
  return (
    <MapContainer
      center={SHANGHAI_PEOPLES_SQUARE}
      className="map-canvas"
      zoom={10}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
    </MapContainer>
  )
}
