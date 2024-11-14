import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { SubTypeValues, UUID ,Location} from '@/types/core'


interface MapMarker {
  id: UUID
  x: number
  y: number
  locationId: UUID
  label?: string
  type?: SubTypeValues<'location'>
  metadata?: {
    description?: string
    linkedEntityId?: UUID
    [key: string]: any
  }
}

interface MapState {
  mapImage: string | null
  markers: MapMarker[]
  setMapImage: (url: string) => void
  addMarker: (marker: MapMarker) => void
  removeMarker: (id: UUID) => void
  updateMarker: (id: UUID, updates: Partial<MapMarker>) => void
  getMarkersByLocation: (locationId: UUID) => MapMarker[]
  getMarkersByType: (type: SubTypeValues<'location'>) => MapMarker[]
  syncMarkersWithLocations: (locations: Location[]) => void
  getMarkerById: (id: UUID) => MapMarker | undefined;
  bulkAddMarkers: (markers: MapMarker[]) => void;
  clearMarkers: () => void;
  updateMarkerCoordinates: (id: UUID, x: number, y: number) => void;
}

const initialState: MapState = {
  mapImage: null,
  markers: [],
  setMapImage: () => {},
  addMarker: () => {},
  removeMarker: () => {},
  updateMarker: () => {},
  getMarkersByLocation: () => [],
  getMarkersByType: () => [],
  syncMarkersWithLocations: () => {},
  getMarkerById: () => undefined,
  bulkAddMarkers: () => {},
  clearMarkers: () => {},
  updateMarkerCoordinates: () => {},
};

export const useMapStore = create<MapState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setMapImage: (url) => set({ mapImage: url }),
      addMarker: (marker) => 
        set((state) => ({ 
          markers: [...state.markers, marker]
        })),
      removeMarker: (id) =>
        set((state) => ({
          markers: state.markers.filter(m => m.id !== id)
        })),
      updateMarker: (id, updates) =>
        set((state) => ({
          markers: state.markers.map(m =>
            m.id === id ? { ...m, ...updates } : m
          )
        })),
      getMarkersByLocation: (locationId) => {
        return get().markers.filter(m => m.locationId === locationId);
      },
      getMarkersByType: (type) => {
        return get().markers.filter(m => m.type === type);
      },
      syncMarkersWithLocations: (locations) => {
        set(state => {
          const updatedMarkers = state.markers.map(marker => {
            const location = locations.find(l => l.id === marker.locationId);
            if (location) {
              return {
                ...marker,
                label: location.name,
                type: location.subType,
                x: location.coordinates?.x ?? marker.x,
                y: location.coordinates?.y ?? marker.y,
                metadata: {
                  ...marker.metadata,
                  description: location.description
                }
              };
            }
            return marker;
          });
          return { markers: updatedMarkers };
        });
      },
      getMarkerById: (id) => {
        return get().markers.find(m => m.id === id);
      },
      bulkAddMarkers: (markers) => 
        set((state) => ({ 
          markers: [...state.markers, ...markers]
        })),
      clearMarkers: () => 
        set({ markers: [] }),
      updateMarkerCoordinates: (id, x, y) =>
        set((state) => ({
          markers: state.markers.map(m =>
            m.id === id ? { ...m, x, y } : m
          )
        })),
    }),
    {
      name: 'world-map-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      onRehydrateStorage: () => {
        return (state) => {
          if (!state) return;
          if (!state.markers) {
            state.markers = [];
          }
          if (!state.mapImage) {
            state.mapImage = null;
          }
        };
      },
    }
  )
)

export const getMapState = () => {
  const state = useMapStore.getState();
  return {
    ...state,
    markers: state.markers || [],
  };
}; 