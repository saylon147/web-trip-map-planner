import { useState } from 'react'
import { calculateDrivingRoute } from '../../services/routing'
import { useTripStore } from '../../store/tripStore'
import { formatDistance, formatDuration } from '../../utils/format'

export function RouteSummary() {
  const stops = useTripStore((state) => state.stops)
  const route = useTripStore((state) => state.route)
  const setRoute = useTripStore((state) => state.setRoute)
  const clearRoute = useTripStore((state) => state.clearRoute)
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string>()

  async function handleCalculateRoute() {
    setError(undefined)
    setIsCalculating(true)

    try {
      setRoute(await calculateDrivingRoute(stops))
    } catch {
      clearRoute()
      setError('路线计算失败，可能是公共 OSRM 服务暂时不可用或地点之间无法驾车到达。')
    } finally {
      setIsCalculating(false)
    }
  }

  const canCalculate = stops.length >= 2 && !isCalculating
  const startStop = stops[0]
  const endStop = stops.at(-1)
  const waypointCount = Math.max(stops.length - 2, 0)

  return (
    <section className="panel-section">
      <div className="section-heading">
        <h2>路线</h2>
        <span className="route-mode">自驾</span>
      </div>
      <dl className="summary-grid">
        <div>
          <dt>距离</dt>
          <dd>{route ? formatDistance(route.distanceMeters) : '-'}</dd>
        </div>
        <div>
          <dt>耗时</dt>
          <dd>{route ? formatDuration(route.durationSeconds) : '-'}</dd>
        </div>
      </dl>
      {startStop && endStop ? (
        <div className="route-plan">
          <div>
            <span>起点</span>
            <strong>{startStop.name}</strong>
          </div>
          <div>
            <span>终点</span>
            <strong>{endStop.name}</strong>
          </div>
          <p>
            {waypointCount > 0
              ? `途经 ${waypointCount} 个行程点，按当前列表顺序计算。`
              : '按当前列表顺序计算。'}
          </p>
        </div>
      ) : null}
      {route ? (
        <div className="route-legs">
          <div className="route-legs__header">
            <h3>分段行程</h3>
            <span>{route.legs.length} 段</span>
          </div>
          <ol className="route-leg-list">
            {route.legs.map((leg, index) => (
              <li className="route-leg" key={`${leg.fromStopId}-${leg.toStopId}`}>
                <span className="route-leg__index">{index + 1}</span>
                <div className="route-leg__main">
                  <strong>
                    {leg.fromName} 到 {leg.toName}
                  </strong>
                  <small>
                    {formatDistance(leg.distanceMeters)} ·{' '}
                    {formatDuration(leg.durationSeconds)}
                  </small>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      {route ? (
        <div className="route-actions">
          <button className="secondary-button" type="button" onClick={clearRoute}>
            清除路线
          </button>
        </div>
      ) : null}
      <button
        className="secondary-button"
        disabled={!canCalculate}
        type="button"
        onClick={handleCalculateRoute}
      >
        {isCalculating ? '计算中' : '计算路线'}
      </button>
      {stops.length < 2 ? (
        <p className="helper-text">至少添加两个行程点后可以计算自驾路线。</p>
      ) : !route ? (
        <p className="helper-text">行程点变化后需要重新计算路线。</p>
      ) : null}
      {error ? <p className="status-text status-text--error">{error}</p> : null}
    </section>
  )
}
