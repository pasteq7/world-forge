'use client'

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { useMapStore } from '@/store/map-store'
import { useWorldStore } from '@/store/world-store'
import { Location } from '@/types/core'
import { MapControls } from './map-controls'
import { MapSearch } from './map-search'
import { MapMarker } from './map-marker'
import { MapUpload } from './map-upload'
import { EntitySheet } from '@/components/common/entity-sheet'
import { cn } from "@/lib/utils"
import { useMapView } from '../hooks/useMapView'
import { useMapMarkers } from '../hooks/useMapMarkers'
import { useMemo } from 'react'
import Image from 'next/image'

export function MapView() {
  const {
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
  } = useMapView()

  const { isLocationPlaced, getMarkerLocation } = useMapMarkers()
  
  const mapStore = useMapStore()
  const worldStore = useWorldStore()
  const locations = useMemo(() => {
    const entities = worldStore.entities ?? []
    return entities.filter((e): e is Location => e.type === 'location')
  }, [worldStore.entities])

  if (!mapStore.mapImage) {
    return <MapUpload onUpload={mapStore.setMapImage} />
  }

  return (
    <div className="relative w-full h-full">
      <MapSearch
        availableLocations={locations}
        markers={mapStore.markers}
        isLocationPlaced={(id) => isLocationPlaced(mapStore.markers, id)}
        onLocationSelect={(location) => setPlacingLocationId(location.id)}
        onCenterLocation={(id) => handleCenterLocation(mapStore.markers, id)}
        onEditLocation={setEditingEntityId}
        onMoveMarker={setEditingMarkerId}
        onRemoveMarker={(locationId) => {
          const marker = mapStore.markers.find(m => m.locationId === locationId)
          if (marker) mapStore.removeMarker(marker.id)
        }}
      />

      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.9}
        maxScale={5}
        centerOnInit
        limitToBounds={true}
        disabled={!!editingMarkerId || !!placingLocationId}
      >
        {({ zoomIn, zoomOut, resetTransform, setTransform }) => (
          <>
            <MapControls
              zoomIn={() => zoomIn(1.2)}
              zoomOut={() => zoomOut(1.2)}
              resetTransform={() => resetTransform(0.5)}
              centerView={(x, y) => setTransform(x, y, 1)}
              markersVisible={markersVisible}
              setMarkersVisible={setMarkersVisible}
            />

            <TransformComponent
              wrapperStyle={{
                width: "100%",
                height: "100%",
              }}
            >
              <div 
                className={cn(
                  "relative w-full h-full flex items-center justify-center",
                  (editingMarkerId || placingLocationId) && "cursor-crosshair"
                )}
                onClick={handleMapClick}
              >
                {(editingMarkerId || placingLocationId) && (
                  <div className="absolute inset-0 bg-black/10 z-10" />
                )}
                
                <div className="relative">
                  <Image
                    src={mapStore.mapImage ?? ''}
                    alt="Map"
                    className={cn(
                      "max-h-[85vh] w-auto object-contain select-none",
                      (editingMarkerId || placingLocationId) && "opacity-90"
                    )}
                    draggable={false}
                    width={1920}
                    height={1080}
                    priority
                    unoptimized
                  />

                  {markersVisible && mapStore.markers.map(marker => {
                    const location = getMarkerLocation(locations, marker.locationId)
                    if (!location) return null

                    return (
                      <MapMarker
                        key={marker.id}
                        marker={marker}
                        location={location}
                        isEditing={editingMarkerId === marker.id}
                        onEdit={setEditingEntityId}
                        onMove={setEditingMarkerId}
                        onRemove={mapStore.removeMarker}
                      />
                    )
                  })}
                </div>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {(editingMarkerId || placingLocationId) && (
        <div className="absolute top-4 left-[220px] z-20 flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-2 rounded-md shadow-md">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span>
            {editingMarkerId ? "Click on map to reposition marker" : "Click on map to place marker"}
          </span>
          <button 
            onClick={() => {
              setEditingMarkerId(null)
              setPlacingLocationId(null)
            }}
            className="ml-2 text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      )}

      <EntitySheet 
        entityId={editingEntityId!}
        open={!!editingEntityId}
        onOpenChange={(open) => {
          if (!open) setEditingEntityId(null)
        }}
      />
    </div>
  )
}