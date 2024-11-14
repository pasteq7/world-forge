import { useState, useCallback, useRef } from 'react'
import { UUID } from '@/types/core'
import { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import { useMapStore } from '@/store/map-store'
import { MapMarker } from '@/types/map'

export function useMapView() {
  const [markersVisible, setMarkersVisible] = useState(true)
  const [editingMarkerId, setEditingMarkerId] = useState<UUID | null>(null)
  const [editingEntityId, setEditingEntityId] = useState<UUID | null>(null)
  const [placingLocationId, setPlacingLocationId] = useState<UUID | null>(null)
  const transformRef = useRef<ReactZoomPanPinchRef>(null)

  const handleMapClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const mapStore = useMapStore.getState();
    if (!editingMarkerId && !placingLocationId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (editingMarkerId) {
      mapStore.updateMarker(editingMarkerId, { x, y });
      setEditingMarkerId(null);
    } else if (placingLocationId) {
      mapStore.addMarker({
        id: crypto.randomUUID() as UUID,
        locationId: placingLocationId,
        x,
        y,
      });
      setPlacingLocationId(null);
    }
  }, [editingMarkerId, placingLocationId]);

  const handleCenterLocation = useCallback((markers: MapMarker[], locationId: UUID) => {
    const marker = markers.find(m => m.locationId === locationId)
    if (marker && transformRef.current) {
      transformRef.current.resetTransform()
      
      setTimeout(() => {
        const centerX = -(marker.x - 50) * 5
        const centerY = -(marker.y - 50) * 5
        transformRef.current?.setTransform(centerX, centerY, 1)
      }, 50)
    }
  }, [])

  return {
    markersVisible,
    setMarkersVisible,
    editingMarkerId,
    setEditingMarkerId,
    editingEntityId,
    setEditingEntityId,
    placingLocationId,
    setPlacingLocationId,
    transformRef,
    handleMapClick,
    handleCenterLocation
  }
} 