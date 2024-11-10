import { MapView } from '@/app/map/components/map-view'

export default function MapPage() {
  return (
    <div className="h-[100dvh] flex flex-col">
      <header className="flex items-center h-14 border-b px-4">
        <h1 className="text-2xl font-semibold tracking-tight">World Map</h1>
      </header>
      <div className="flex-1 min-h-0">
        <MapView />
      </div>
    </div>
  )
} 