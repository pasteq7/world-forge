"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useWorldStore } from "@/store/world-store"
import { Clock } from "lucide-react"
import { EntitySheet } from "@/components/common/entity-sheet"
import { UUID } from "@/types/core"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatEntityType } from "@/lib/utils"

export function RecentEntities() {
  const entities = useWorldStore((state) => state.entities)
  const [selectedEntity, setSelectedEntity] = useState<UUID | null>(null)
  
  const recentEntities = [...entities]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3)

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'character': return '👤'
      case 'location': return '📍'
      case 'event': return '📅'
      default: return '📄'
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEntities.map((entity) => (
              <Popover 
                key={entity.id} 
                onOpenChange={(open) => {
                  if (!open) {
                    setSelectedEntity(null);
                  } else {
                    setSelectedEntity(entity.id);
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <button
                    className="w-full text-left flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getEntityIcon(entity.type)}</span>
                      <div>
                        <p className="font-medium">{entity.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(entity.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm capitalize text-muted-foreground">
                      {formatEntityType(entity.type)}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[800px] p-0">
                  {
                    selectedEntity === entity.id && (
                      <EntitySheet
                        entityId={entity.id}
                        open={!!selectedEntity}
                        onOpenChange={(open) => !open && setSelectedEntity(null)}
                      />
                    )
                  }
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
} 