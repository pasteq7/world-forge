'use client'
import { useState, useCallback, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Wand2, Sparkles, Plus } from "lucide-react"
import { EntityType } from "@/types/core"
import { formatSingularEntityType } from '@/lib/utils'
import { useEntityCreation } from '../hooks/useEntityCreation'

export function QuickCreate() {
  const [entityName, setEntityName] = useState('')
  const [entityType, setEntityType] = useState<EntityType>('character')
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { createEntity } = useEntityCreation(buttonRef)

  const handleCreate = useCallback(() => {
    if (!entityName.trim()) return
    createEntity(entityName, entityType)
    setEntityName('')
  }, [entityName, entityType, createEntity])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && entityName.trim()) {
      handleCreate()
    }
  }, [entityName, handleCreate])

  return (
    <Card className="relative overflow-hidden h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          Quick Create
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
            <Button
              variant={entityType === 'character' ? 'default' : 'outline'}
              onClick={() => setEntityType('character')}
              className="w-full"
            >
              {formatSingularEntityType('character')}
            </Button>
            <Button
              variant={entityType === 'location' ? 'default' : 'outline'}
              onClick={() => setEntityType('location')}
              className="w-full"
            >
              {formatSingularEntityType('location')}
            </Button>
            <Button
              variant={entityType === 'faction' ? 'default' : 'outline'}
              onClick={() => setEntityType('faction')}
              className="w-full"
            >
              {formatSingularEntityType('faction')}
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <Button
              variant={entityType === 'item' ? 'default' : 'outline'}
              onClick={() => setEntityType('item')}
              className="w-full"
            >
              {formatSingularEntityType('item')}
            </Button>
            <Button
              variant={entityType === 'event' ? 'default' : 'outline'}
              onClick={() => setEntityType('event')}
              className="w-full"
            >
              {formatSingularEntityType('event')}
            </Button>
            <Button
              variant={entityType === 'timePeriod' ? 'default' : 'outline'}
              onClick={() => setEntityType('timePeriod')}
              className="w-full"
            >
              {formatSingularEntityType('timePeriod')}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder={`Name your ${formatSingularEntityType(entityType)}...`}
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 gradient-border focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button 
              ref={buttonRef}
              onClick={handleCreate} 
              disabled={!entityName.trim()}
              className="relative overflow-hidden bg-violet-600 hover:bg-violet-500 text-white transition-all duration-300 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000"
            >
              <span className="relative flex items-center whitespace-nowrap">
                <Plus className="h-4 w-4 mr-1" />
                Create
              </span>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-2">
            {entityType === 'character' && 'e.g., Captain Lyra Stormwind, The Wandering Monk'}
            {entityType === 'location' && 'e.g., The Whispering Markets, Throne of the Storm King'}
            {entityType === 'faction' && 'e.g., The Crimson Merchants League, Order of the Dawn'}
            {entityType === 'item' && 'e.g., The Last Word (pistol), Crown of Autumn Leaves'}
            {entityType === 'event' && 'e.g., The Night of Falling Stars, The Grand Tournament'}
            {entityType === 'timePeriod' && 'e.g., The Golden Age of Innovation, The Dark Decade'}
          </p>
        </div>
        
        <div className="absolute -right-8 -top-8 h-24 w-24 opacity-5">
          <Sparkles className="h-full w-full" />
        </div>
      </CardContent>
    </Card>
  )
} 