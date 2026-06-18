import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from 'react'
import { loadAttachmentBlob, saveAttachmentBlob } from '../../services/attachmentStorage'
import { useTripStore } from '../../store/tripStore'
import { createId } from '../../utils/id'

type AnnotationMode = 'point' | 'region'

const REGION_WIDTH = 0.18
const REGION_HEIGHT = 0.12

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function CustomMapWorkspace() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const selectedStop = useTripStore((state) =>
    state.stops.find((stop) => stop.id === state.selectedStopId),
  )
  const setStopCustomMapImage = useTripStore((state) => state.setStopCustomMapImage)
  const addStopCustomMapAnnotation = useTripStore(
    (state) => state.addStopCustomMapAnnotation,
  )
  const removeStopCustomMapAnnotation = useTripStore(
    (state) => state.removeStopCustomMapAnnotation,
  )
  const [imageUrl, setImageUrl] = useState<string>()
  const [mode, setMode] = useState<AnnotationMode>('point')
  const [label, setLabel] = useState('')
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string>()

  useEffect(() => {
    let objectUrl: string | undefined
    let isCancelled = false

    async function loadImage() {
      if (!selectedStop?.customMap?.imageStorageKey) {
        if (!isCancelled) setImageUrl(undefined)
        return
      }

      const blob = await loadAttachmentBlob(selectedStop.customMap.imageStorageKey)
      if (!blob) {
        if (!isCancelled) setImageUrl(undefined)
        return
      }

      objectUrl = URL.createObjectURL(blob)
      if (!isCancelled) setImageUrl(objectUrl)
    }

    void loadImage()

    return () => {
      isCancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [selectedStop?.customMap?.imageStorageKey])

  async function handleImageSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file || !selectedStop) return

    const storageKey = createId('custom-map-image')
    await saveAttachmentBlob(storageKey, file)
    setStopCustomMapImage(selectedStop.id, storageKey, file.name)
  }

  function handleCanvasClick(event: MouseEvent<HTMLDivElement>) {
    if (!selectedStop?.customMap) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = clamp((event.clientX - rect.left) / rect.width, 0, 1)
    const y = clamp((event.clientY - rect.top) / rect.height, 0, 1)
    const annotationLabel =
      label.trim() || (mode === 'point' ? '标记点' : '标记区域')

    if (mode === 'point') {
      addStopCustomMapAnnotation(selectedStop.id, {
        id: createId('annotation'),
        type: 'point',
        label: annotationLabel,
        x,
        y,
      })
    } else {
      addStopCustomMapAnnotation(selectedStop.id, {
        id: createId('annotation'),
        type: 'region',
        label: annotationLabel,
        x: clamp(x - REGION_WIDTH / 2, 0, 1 - REGION_WIDTH),
        y: clamp(y - REGION_HEIGHT / 2, 0, 1 - REGION_HEIGHT),
        width: REGION_WIDTH,
        height: REGION_HEIGHT,
      })
    }

    setLabel('')
  }

  const annotations = selectedStop?.customMap?.annotations ?? []
  const selectedAnnotation = annotations.find(
    (annotation) => annotation.id === selectedAnnotationId,
  )

  return (
    <div className="custom-map-workspace">
      <header className="workspace-toolbar">
        <div>
          <span>资料图层</span>
          <strong>{selectedStop?.name ?? '未选择行程点'}</strong>
        </div>
        <div className="workspace-actions">
          <div className="segmented-control" role="group" aria-label="标注模式">
            <button
              className={mode === 'point' ? 'is-active' : ''}
              disabled={!selectedStop?.customMap}
              type="button"
              onClick={() => setMode('point')}
            >
              标点
            </button>
            <button
              className={mode === 'region' ? 'is-active' : ''}
              disabled={!selectedStop?.customMap}
              type="button"
              onClick={() => setMode('region')}
            >
              标区域
            </button>
          </div>
          <input
            className="workspace-label-input"
            disabled={!selectedStop?.customMap}
            placeholder="标注名称"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
          />
          <button
            className="workspace-button"
            disabled={!selectedStop}
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedStop?.customMap ? '更换底图' : '添加底图'}
          </button>
          <input
            accept="image/*"
            className="visually-hidden"
            ref={fileInputRef}
            type="file"
            onChange={handleImageSelect}
          />
        </div>
      </header>

      <div className="custom-map-stage">
        {!selectedStop ? (
          <div className="workspace-empty">先在右侧选择一个行程点。</div>
        ) : !selectedStop.customMap ? (
          <div className="workspace-empty">
            <strong>{selectedStop.name}</strong>
            <span>添加一张本地图片作为资料底图，然后在图上标记点或区域。</span>
          </div>
        ) : (
          <div className="custom-map-image-shell">
            <div className="custom-map-canvas" onClick={handleCanvasClick}>
              {imageUrl ? (
                <img alt={selectedStop.customMap.imageName} src={imageUrl} />
              ) : null}
              {annotations.map((annotation, index) => {
                if (annotation.type === 'point') {
                  return (
                    <button
                      className={
                        selectedAnnotationId === annotation.id
                          ? 'image-annotation image-annotation--point is-selected'
                          : 'image-annotation image-annotation--point'
                      }
                      key={annotation.id}
                      style={{
                        left: `${annotation.x * 100}%`,
                        top: `${annotation.y * 100}%`,
                      }}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        setSelectedAnnotationId(annotation.id)
                      }}
                    >
                      {index + 1}
                    </button>
                  )
                }

                return (
                  <button
                    className={
                      selectedAnnotationId === annotation.id
                        ? 'image-annotation image-annotation--region is-selected'
                        : 'image-annotation image-annotation--region'
                    }
                    key={annotation.id}
                    style={{
                      left: `${annotation.x * 100}%`,
                      top: `${annotation.y * 100}%`,
                      width: `${annotation.width * 100}%`,
                      height: `${annotation.height * 100}%`,
                    }}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      setSelectedAnnotationId(annotation.id)
                    }}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {selectedStop?.customMap ? (
        <footer className="workspace-detail">
          <div>
            <strong>{selectedAnnotation?.label ?? selectedStop.customMap.imageName}</strong>
            <span>
              {selectedAnnotation
                ? selectedAnnotation.type === 'point'
                  ? '标记点'
                  : '标记区域'
                : `${annotations.length} 个标注`}
            </span>
          </div>
          {selectedAnnotation ? (
            <button
              className="workspace-danger"
              type="button"
              onClick={() => {
                removeStopCustomMapAnnotation(selectedStop.id, selectedAnnotation.id)
                setSelectedAnnotationId(undefined)
              }}
            >
              删除标注
            </button>
          ) : null}
        </footer>
      ) : null}
    </div>
  )
}
