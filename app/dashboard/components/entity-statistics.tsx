"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useWorldStore } from "@/store/world-store"
import { BarChart } from "lucide-react"
import { Character, Location, Event, Item, TimePeriod, Faction, SubTypes } from "@/types/core"
import { formatEntityType } from "@/lib/utils"

export function EntityStatistics() {
  const entities = useWorldStore((state) => state.entities)
  
  // Dynamically generate stats based on SubTypes
  const stats = {
    characters: Object.entries(SubTypes.character).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: entities.filter((e): e is Character => 
        e.type === 'character' && e.subType === value
      ).length
    }), {}),

    locations: Object.entries(SubTypes.location).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: entities.filter((e): e is Location => 
        e.type === 'location' && e.subType === value
      ).length
    }), {}),

    events: Object.entries(SubTypes.event).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: entities.filter((e): e is Event => 
        e.type === 'event' && e.subType === value
      ).length
    }), {}),

    items: Object.entries(SubTypes.item).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: entities.filter((e): e is Item => 
        e.type === 'item' && e.subType === value
      ).length
    }), {}),

    factions: Object.entries(SubTypes.faction).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: entities.filter((e): e is Faction => 
        e.type === 'faction' && e.subType === value
      ).length
    }), {}),

    timePeriods: Object.entries(SubTypes.timePeriod).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: entities.filter((e): e is TimePeriod => 
        e.type === 'timePeriod' && e.subType === value
      ).length
    }), {}),

    // Keep the tags calculation
    totalTags: [...new Set(entities.flatMap(e => e.tags))].length,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Detailed Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(stats).map(([category, values]) => (
            category !== 'totalTags' && (
              <div key={category} className="space-y-2">
                <h3 className="font-semibold">
                  {formatEntityType(category.replace('s', ''))}
                </h3>
                {Object.entries(values).map(([key, count]) => (
                  <p key={key} className="text-sm text-muted-foreground">
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {count}
                  </p>
                ))}
              </div>
            )
          ))}
          
          <div className="space-y-2">
            <h3 className="font-semibold">Tags</h3>
            <p className="text-sm text-muted-foreground">
              Unique Tags: {stats.totalTags}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 