import { MapPanel } from './MapPanel'
import { SidePanel } from './SidePanel'
import '../../styles/layout.css'

export function AppLayout() {
  return (
    <main className="app-layout">
      <MapPanel />
      <SidePanel />
    </main>
  )
}
