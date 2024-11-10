'use client'

import { Button } from '@/components/ui/button'
import { Plus, Minus, MoveHorizontal, Landmark } from 'lucide-react'
import { MapControlsProps } from '@/types/map'
import { useMapControls } from '../hooks/useMapControls'

export function MapControls(props: MapControlsProps) {
  const {
    handleZoomIn,
    handleZoomOut,
    handleResetTransform,
    handleToggleMarkers
  } = useMapControls(props)

  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
      <Button variant="secondary" size="icon" onClick={handleZoomIn}>
        <Plus className="h-4 w-4" />
      </Button>
      <Button variant="secondary" size="icon" onClick={handleZoomOut}>
        <Minus className="h-4 w-4" />
      </Button>
      <Button variant="secondary" size="icon" onClick={handleResetTransform}>
        <MoveHorizontal className="h-4 w-4" />
      </Button>
      <Button 
        variant={props.markersVisible ? "secondary" : "outline"} 
        size="icon" 
        onClick={handleToggleMarkers}
        title={props.markersVisible ? "Hide Markers" : "Show Markers"}
      >
        <Landmark className="h-4 w-4" />
      </Button>
    </div>
  )
} 