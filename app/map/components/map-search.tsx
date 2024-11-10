'use client'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { MapSearchProps } from '@/types/map'
import { Plus } from 'lucide-react'
import { useMapSearch } from '../hooks/useMapSearch'
import { LocationContextMenu } from './location-context-menu'

export function MapSearch(props: MapSearchProps) {
  const { handleLocationClick } = useMapSearch({
    isLocationPlaced: props.isLocationPlaced,
    onLocationSelect: props.onLocationSelect,
    onCenterLocation: props.onCenterLocation,
  })

  return (
    <div className="absolute top-4 left-4 z-10 w-[200px]">
      <Command className="border shadow-md bg-background">
        <CommandInput placeholder="Search locations..." />
        <CommandList>
          <CommandEmpty>No locations available.</CommandEmpty>
          <CommandGroup>
            {props.availableLocations.map((location) => {
              const markerId = props.isLocationPlaced(location.id) ? 
                props.markers.find(m => m.locationId === location.id)?.id : 
                undefined;
              
              console.log({
                locationId: location.id,
                isPlaced: props.isLocationPlaced(location.id),
                markerId,
                markers: props.markers
              });

              return (
                <LocationContextMenu
                key={location.id}
                locationId={location.id}
                markerId={markerId} 
                  onEdit={props.onEditLocation}
                  onMove={props.onMoveMarker}
                  onRemove={props.onRemoveMarker}
                >
                  <CommandItem
                    value={location.name}
                    onSelect={() => handleLocationClick(location)}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {location.name}
                      {!props.isLocationPlaced(location.id) && (
                        <div className="ml-auto flex items-center text-primary">
                          <Plus className="h-4 w-4" />
                          <span className="text-xs ml-1">Place</span>
                        </div>
                      )}
                    </div>
                  </CommandItem>
                </LocationContextMenu>
              )
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
} 