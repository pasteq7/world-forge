import { EntityRelation, Location, SubTypeValues, UUID, WorldEntity } from './core'
import { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'

export interface MapMarker {
  id: UUID
  locationId: UUID
  x: number
  y: number
  label?: string
  type?: SubTypeValues<'location'>
  metadata?: {
    description?: string
    linkedEntityId?: UUID
    [key: string]: any
  }
}

export interface MapTransform extends ReactZoomPanPinchRef {}

export interface MapActions {
  updateMarker: (id: UUID, position: { x: number, y: number }) => void
  addMarker: (marker: MapMarker) => void
  removeMarker: (id: UUID) => void
}

export interface MapControlsProps {
  zoomIn: () => void
  zoomOut: () => void
  resetTransform: () => void
  centerView: (x: number, y: number) => void
  markersVisible: boolean
  setMarkersVisible: (visible: boolean) => void
}

export interface MapSearchProps {
  availableLocations: Location[]
  markers: MapMarker[]
  isLocationPlaced: (id: UUID) => boolean
  onLocationSelect: (location: Location) => void
  onCenterLocation: (id: UUID) => void
  onMoveMarker: (locationId: UUID) => void
  onRemoveMarker: (locationId: UUID) => void
  onEditLocation: (id: UUID) => void
}

export interface MapUploadProps {
  onUpload: (base64: string) => void
}

export interface MapMarkerProps {
  marker: MapMarker & { x: number; y: number }
  location: Location
  isEditing: boolean
  onEdit: (id: UUID) => void
  onMove: (id: UUID) => void
  onRemove: (id: UUID) => void
}

export interface MapState {
  mapImage: string | null
  markers: MapMarker[]
  setMapImage: (url: string) => void
  addMarker: (marker: MapMarker) => void
  removeMarker: (id: UUID) => void
  updateMarker: (id: UUID, updates: Partial<MapMarker>) => void
  getMarkersByLocation: (locationId: UUID) => MapMarker[]
  getMarkersByType: (type: SubTypeValues<'location'>) => MapMarker[]
  syncMarkersWithLocations: (locations: Location[]) => void
  getMarkerById: (id: UUID) => MapMarker | undefined
  bulkAddMarkers: (markers: MapMarker[]) => void
  clearMarkers: () => void
  updateMarkerCoordinates: (id: UUID, x: number, y: number) => void
}

export interface WorldExportData {
  world: {
    entities: WorldEntity[]
    relations: EntityRelation[]
  }
  map: {
    image: string | null
    markers: MapMarker[]
  }
  version: number
  exportDate: string
} 