'use client'

import { MapMarkerProps } from '@/types/map'
import { cn } from "@/lib/utils"
import { Building2, Castle, Landmark, Mountain, Trees} from 'lucide-react'
import { useMapMarkers } from '../hooks/useMapMarkers'
import { LocationContextMenu } from './location-context-menu'

export function MapMarker({
  marker,
  location,
  isEditing,
  onEdit,
  onMove,
  onRemove
}: MapMarkerProps) {
  const { getLocationIcon } = useMapMarkers()

  const IconComponent = {
    Mountain,
    Trees,
    Castle,
    Building2,
    Landmark
  }[getLocationIcon(location.subType)] || Landmark

  return (
    <LocationContextMenu
      locationId={location.id}
      markerId={marker.id}
      onEdit={onEdit}
      onMove={onMove}
      onRemove={onRemove}
    >
      <div
        className={cn(
          "absolute cursor-pointer",
          isEditing && "pointer-events-none"
        )}
        style={{
          left: `${marker.x}%`,
          top: `${marker.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 
                       bg-background/95 rounded-md border text-xs whitespace-nowrap
                       shadow-sm">
          {location.name}
        </div>

        <div className={cn(
          "w-6 h-6",
          isEditing && "ring-2 ring-primary ring-offset-2"
        )}>
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
            <div className="relative w-full h-full rounded-full bg-primary border-2 border-background flex items-center justify-center text-background">
              <IconComponent className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </LocationContextMenu>
  )
}