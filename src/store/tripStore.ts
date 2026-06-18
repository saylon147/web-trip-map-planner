import { create } from 'zustand'
import { loadTripSnapshot, saveTripSnapshot } from '../services/storage'
import type { CustomMapAnnotation, TripRoute, TripStop } from '../types/trip'

type TripState = {
  stops: TripStop[]
  route?: TripRoute
  selectedStopId?: string
  addStop: (stop: TripStop) => void
  removeStop: (id: string) => void
  replaceStops: (stops: TripStop[]) => void
  reorderStops: (fromIndex: number, toIndex: number) => void
  updateStop: (id: string, patch: Partial<TripStop>) => void
  setStopCustomMapImage: (id: string, imageStorageKey: string, imageName: string) => void
  addStopCustomMapAnnotation: (id: string, annotation: CustomMapAnnotation) => void
  removeStopCustomMapAnnotation: (stopId: string, annotationId: string) => void
  selectStop: (id?: string) => void
  setRoute: (route: TripRoute) => void
  clearRoute: () => void
  saveToLocal: () => void
  loadFromLocal: () => void
}

export const useTripStore = create<TripState>((set, get) => ({
  stops: [],
  route: undefined,
  selectedStopId: undefined,

  addStop: (stop) =>
    set((state) => ({
      stops: [...state.stops, stop],
      route: undefined,
      selectedStopId: stop.id,
    })),

  removeStop: (id) =>
    set((state) => {
      const stops = state.stops.filter((stop) => stop.id !== id)
      return {
        stops,
        route: undefined,
        selectedStopId:
          state.selectedStopId === id ? stops.at(-1)?.id : state.selectedStopId,
      }
    }),

  replaceStops: (stops) =>
    set({
      stops,
      route: undefined,
      selectedStopId: stops.at(-1)?.id,
    }),

  reorderStops: (fromIndex, toIndex) =>
    set((state) => {
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.stops.length ||
        toIndex >= state.stops.length
      ) {
        return state
      }

      const stops = [...state.stops]
      const [movedStop] = stops.splice(fromIndex, 1)
      stops.splice(toIndex, 0, movedStop)

      return {
        stops,
        route: undefined,
      }
    }),

  updateStop: (id, patch) =>
    set((state) => ({
      stops: state.stops.map((stop) =>
        stop.id === id
          ? {
              ...stop,
              ...patch,
            }
          : stop,
      ),
      route: undefined,
    })),

  setStopCustomMapImage: (id, imageStorageKey, imageName) =>
    set((state) => ({
      stops: state.stops.map((stop) =>
        stop.id === id
          ? {
              ...stop,
              customMap: {
                imageStorageKey,
                imageName,
                annotations: stop.customMap?.annotations ?? [],
              },
            }
          : stop,
      ),
    })),

  addStopCustomMapAnnotation: (id, annotation) =>
    set((state) => ({
      stops: state.stops.map((stop) =>
        stop.id === id && stop.customMap
          ? {
              ...stop,
              customMap: {
                ...stop.customMap,
                annotations: [...stop.customMap.annotations, annotation],
              },
            }
          : stop,
      ),
    })),

  removeStopCustomMapAnnotation: (stopId, annotationId) =>
    set((state) => ({
      stops: state.stops.map((stop) =>
        stop.id === stopId && stop.customMap
          ? {
              ...stop,
              customMap: {
                ...stop.customMap,
                annotations: stop.customMap.annotations.filter(
                  (annotation) => annotation.id !== annotationId,
                ),
              },
            }
          : stop,
      ),
    })),

  selectStop: (id) => set({ selectedStopId: id }),

  setRoute: (route) => set({ route }),

  clearRoute: () => set({ route: undefined }),

  saveToLocal: () => {
    saveTripSnapshot(get().stops)
  },

  loadFromLocal: () => {
    const snapshot = loadTripSnapshot()
    if (!snapshot) return

    set({
      stops: snapshot.stops,
      route: undefined,
      selectedStopId: snapshot.stops.at(-1)?.id,
    })
  },
}))
