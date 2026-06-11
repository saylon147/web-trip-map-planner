export function SearchBox() {
  return (
    <section className="panel-section">
      <label className="field-label" htmlFor="place-search">
        搜索地点
      </label>
      <div className="search-row">
        <input
          className="text-input"
          id="place-search"
          placeholder="例如 Tokyo Tower"
          type="search"
        />
        <button className="primary-button" type="button">
          搜索
        </button>
      </div>
      <p className="helper-text">下一步会接入 Nominatim 搜索候选结果。</p>
    </section>
  )
}
