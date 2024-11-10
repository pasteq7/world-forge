import { useCallback } from 'react'
import { Location, UUID } from '@/types/core'
import { SubTypes } from '@/types/core'
import { MapMarker } from '@/types/map'

export function useMapMarkers() {
  const getLocationIcon = useCallback((subType: (typeof SubTypes)['location'][keyof typeof SubTypes['location']]) => {
    switch (subType) {
      case 'continent': return 'Mountain'
      case 'region': return 'Trees'
      case 'city': return 'Castle'
      case 'building': return 'Building2'
      case 'landmark': return 'Landmark'
      default: return 'Landmark'
    }
  }, [])

  const isLocationPlaced = useCallback((markers: MapMarker[], locationId: UUID) => {
    return markers.some(marker => marker.locationId === locationId)
  }, [])

  const getMarkerLocation = useCallback((locations: Location[], locationId: UUID) => {
    return locations.find(loc => loc.id === locationId)
  }, [])

  return {
    getLocationIcon,
    isLocationPlaced,
    getMarkerLocation
  }
} 