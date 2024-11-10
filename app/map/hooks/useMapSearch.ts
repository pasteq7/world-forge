import { useCallback } from 'react'
import { Location, UUID } from '@/types/core'

interface UseMapSearchProps {
  isLocationPlaced: (id: UUID) => boolean
  onLocationSelect: (location: Location) => void
  onCenterLocation: (id: UUID) => void
}

export function useMapSearch({
  isLocationPlaced,
  onLocationSelect,
  onCenterLocation,
}: UseMapSearchProps) {
  const handleLocationClick = useCallback((location: Location) => {
    if (isLocationPlaced(location.id)) {
      onCenterLocation(location.id)
    } else {
      onLocationSelect(location)
    }
  }, [isLocationPlaced, onCenterLocation, onLocationSelect])

  return {
    handleLocationClick,
  }
} 