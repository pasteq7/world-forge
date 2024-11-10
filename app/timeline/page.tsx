import { EventTimeline } from "@/app/timeline/components/timeline-layout"

export default function TimelinePage() {
  return (
    <div className="h-[100dvh] flex flex-col">
      <header className="flex items-center h-14 border-b px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Event Timeline</h1>
      </header>
      
      <main className="flex-1 relative overflow-auto">
        <div className="container mx-auto py-8">
          <EventTimeline />
        </div>
      </main>
    </div>
  )
} 