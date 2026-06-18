import { useState } from 'react'
import { CustomMapWorkspace } from '../map/CustomMapWorkspace'
import { MapCanvas } from '../map/MapCanvas'

type WorkspaceView = 'map' | 'custom-map'

export function MapPanel() {
  const [view, setView] = useState<WorkspaceView>('map')

  return (
    <section className="map-panel" aria-label="Trip map">
      <div className="map-panel__switcher" role="group" aria-label="主视图区">
        <button
          className={view === 'map' ? 'is-active' : ''}
          type="button"
          onClick={() => setView('map')}
        >
          真实地图
        </button>
        <button
          className={view === 'custom-map' ? 'is-active' : ''}
          type="button"
          onClick={() => setView('custom-map')}
        >
          资料图层
        </button>
      </div>
      <div className="map-panel__content">
        {view === 'map' ? <MapCanvas /> : <CustomMapWorkspace />}
      </div>
    </section>
  )
}
