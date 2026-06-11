export function RouteSummary() {
  return (
    <section className="panel-section">
      <div className="section-heading">
        <h2>路线</h2>
      </div>
      <dl className="summary-grid">
        <div>
          <dt>距离</dt>
          <dd>-</dd>
        </div>
        <div>
          <dt>耗时</dt>
          <dd>-</dd>
        </div>
      </dl>
      <button className="secondary-button" disabled type="button">
        计算路线
      </button>
    </section>
  )
}
