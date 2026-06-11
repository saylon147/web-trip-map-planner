import { RouteSummary } from '../trip/RouteSummary'
import { SearchBox } from '../trip/SearchBox'
import { TripActions } from '../trip/TripActions'
import { TripStopList } from '../trip/TripStopList'
import '../../styles/side-panel.css'

export function SidePanel() {
  return (
    <aside className="side-panel" aria-label="Trip controls">
      <header className="side-panel__header">
        <p className="side-panel__eyebrow">Web Trip Map Planner</p>
        <h1>行程地图规划</h1>
      </header>

      <SearchBox />
      <TripStopList />
      <RouteSummary />
      <TripActions />
    </aside>
  )
}
