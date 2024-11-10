import { RelationsNetwork } from "@/app/relationships/components/network-relations"

export default function RelationshipsPage() {
  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center h-14 border-b px-4">
        <h1 className="text-2xl font-semibold tracking-tight">Character Relationships</h1>
      </header>
      
      <div className="flex-1 relative">
        <RelationsNetwork />
      </div>
    </div>
  )
} 