import { useRef, useState, type ChangeEvent } from 'react'
import { createTripSnapshot, parseTripSnapshot } from '../../services/storage'
import { useTripStore } from '../../store/tripStore'

export function TripActions() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const stops = useTripStore((state) => state.stops)
  const replaceStops = useTripStore((state) => state.replaceStops)
  const saveToLocal = useTripStore((state) => state.saveToLocal)
  const loadFromLocal = useTripStore((state) => state.loadFromLocal)
  const [status, setStatus] = useState<string>()

  function handleSave() {
    saveToLocal()
    setStatus('已保存到浏览器本地。')
  }

  function handleClear() {
    replaceStops([])
    setStatus('已清空当前行程点。')
  }

  function handleLoad() {
    loadFromLocal()
    setStatus('已从浏览器本地恢复。')
  }

  function handleExport() {
    const json = JSON.stringify(createTripSnapshot(stops), null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'trip-stops.json'
    link.click()

    URL.revokeObjectURL(url)
    setStatus('已导出 JSON。')
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    try {
      const snapshot = parseTripSnapshot(await file.text())
      replaceStops(snapshot.stops)
      setStatus(`已导入 ${snapshot.stops.length} 个行程点。`)
    } catch {
      setStatus('导入失败，请检查 JSON 文件格式。')
    }
  }

  return (
    <section className="panel-section">
      <div className="section-heading">
        <h2>数据</h2>
      </div>
      <div className="action-grid action-grid--two">
        <button className="secondary-button" type="button" onClick={handleClear}>
          清空
        </button>
        <button className="secondary-button" type="button" onClick={handleSave}>
          保存
        </button>
        <button className="secondary-button" type="button" onClick={handleLoad}>
          恢复
        </button>
        <button className="secondary-button" type="button" onClick={handleExport}>
          导出 JSON
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          导入 JSON
        </button>
      </div>
      <input
        accept="application/json,.json"
        className="visually-hidden"
        ref={fileInputRef}
        type="file"
        onChange={handleImport}
      />
      {status ? <p className="status-text">{status}</p> : null}
    </section>
  )
}
