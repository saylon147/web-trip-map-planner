import { useState, type FormEvent } from 'react'
import { searchPlaces, type GeocodingResult } from '../../services/geocoding'
import { useTripStore } from '../../store/tripStore'
import { createId } from '../../utils/id'

export function SearchBox() {
  const addStop = useTripStore((state) => state.addStop)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeocodingResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string>()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError(undefined)
    setIsSearching(true)

    try {
      setResults(await searchPlaces(query))
    } catch {
      setError('搜索失败，请稍后再试。')
    } finally {
      setIsSearching(false)
    }
  }

  function handleAddResult(result: GeocodingResult) {
    addStop({
      id: createId('stop'),
      name: result.name,
      lat: result.lat,
      lng: result.lng,
      address: result.displayName,
      source: 'search',
    })
  }

  return (
    <section className="panel-section">
      <form className="search-form" onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="place-search">
          搜索地点
        </label>
        <div className="search-row">
          <input
            className="text-input"
            id="place-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="例如 上海博物馆"
            type="search"
            value={query}
          />
          <button className="primary-button" disabled={isSearching} type="submit">
            {isSearching ? '搜索中' : '搜索'}
          </button>
        </div>
      </form>

      {error ? <p className="status-text status-text--error">{error}</p> : null}

      {results.length > 0 ? (
        <ul className="search-results">
          {results.map((result) => (
            <li className="search-result" key={result.id}>
              <button type="button" onClick={() => handleAddResult(result)}>
                <span>{result.name}</span>
                <small>{result.displayName}</small>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="helper-text">搜索后点击候选结果即可加入行程点。</p>
      )}
    </section>
  )
}
