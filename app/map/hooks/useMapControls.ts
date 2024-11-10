import { useCallback } from 'react'

interface UseMapControlsProps {
  zoomIn: () => void
  zoomOut: () => void
  resetTransform: () => void
  markersVisible: boolean
  setMarkersVisible: (visible: boolean) => void
}

export function useMapControls({
  zoomIn,
  zoomOut,
  resetTransform,
  markersVisible,
  setMarkersVisible
}: UseMapControlsProps) {
  const handleZoomIn = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    zoomIn()
  }, [zoomIn])

  const handleZoomOut = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    zoomOut()
  }, [zoomOut])

  const handleResetTransform = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    resetTransform()
  }, [resetTransform])

  const handleToggleMarkers = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setMarkersVisible(!markersVisible)
  }, [markersVisible, setMarkersVisible])

  return {
    handleZoomIn,
    handleZoomOut,
    handleResetTransform,
    handleToggleMarkers
  }
} 