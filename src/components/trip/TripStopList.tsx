import { useState, type DragEvent } from 'react'
import { useTripStore } from '../../store/tripStore'

export function TripStopList() {
  const stops = useTripStore((state) => state.stops)
  const selectedStopId = useTripStore((state) => state.selectedStopId)
  const selectStop = useTripStore((state) => state.selectStop)
  const removeStop = useTripStore((state) => state.removeStop)
  const reorderStops = useTripStore((state) => state.reorderStops)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number>()

  function handleDragStart(event: DragEvent<HTMLLIElement>, index: number) {
    setDraggedIndex(index)
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
  }

  function handleDrop(event: DragEvent<HTMLLIElement>, targetIndex: number) {
    event.preventDefault()
    const sourceIndex = draggedIndex ?? Number(event.dataTransfer.getData('text/plain'))

    if (Number.isFinite(sourceIndex)) {
      reorderStops(sourceIndex, targetIndex)
    }

    setDraggedIndex(undefined)
  }

  return (
    <section className="panel-section">
      <div className="section-heading">
        <h2>行程点</h2>
        <div className="section-heading__actions">
          <span className="count-pill">{stops.length}</span>
          <button
            className="text-button"
            type="button"
            onClick={() => setIsCollapsed((value) => !value)}
          >
            {isCollapsed ? '展开' : '收起'}
          </button>
        </div>
      </div>
      {isCollapsed ? (
        <p className="helper-text">
          {stops.length > 0 ? `已收起 ${stops.length} 个行程点。` : '还没有添加地点。'}
        </p>
      ) : stops.length === 0 ? (
        <div className="empty-state">还没有添加地点。</div>
      ) : (
        <ol className="stop-list">
          {stops.map((stop, index) => (
            <li
              className={
                selectedStopId === stop.id
                  ? 'stop-list__item stop-list__item--selected'
                  : 'stop-list__item'
              }
              draggable
              key={stop.id}
              onDragEnd={() => setDraggedIndex(undefined)}
              onDragOver={(event) => event.preventDefault()}
              onDragStart={(event) => handleDragStart(event, index)}
              onDrop={(event) => handleDrop(event, index)}
            >
              <span className="drag-handle" aria-label="拖拽调整顺序" title="拖拽调整顺序">
                ::
              </span>
              <button
                className="stop-list__select"
                type="button"
                onClick={() => selectStop(stop.id)}
              >
                <span className="stop-list__index">{index + 1}</span>
                <span className="stop-list__content">
                  <strong>{stop.name}</strong>
                  {stop.address ? <small>{stop.address}</small> : null}
                </span>
              </button>
              <button
                aria-label={`删除 ${stop.name}`}
                className="icon-button"
                type="button"
                onClick={() => removeStop(stop.id)}
              >
                删除
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
