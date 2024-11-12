'use client'

import { useState,useEffect } from 'react'
import { useWorldStore } from '@/store/world-store'
import { SortOption, UUID, EntityType } from '@/types/core'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { EntitySheet } from '@/components/common/entity-sheet'
import { Badge } from '@/components/ui/badge'
import { cn, formatSingularEntityType } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { formatEntityType } from "@/lib/utils"
import { Toggle } from "@/components/ui/toggle"
import { useEntityFiltering, useEntitySorting } from '../hooks/useEntityFiltering'
import { useEntityPagination } from '../hooks/useEntityPagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function EntityList() {
  const entities = useWorldStore((state) => state.entities)
  const setSelectedEntity = useWorldStore((state) => state.setSelectedEntity)
  const lastCreatedEntityId = useWorldStore((state) => state.lastCreatedEntityId)
  
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<EntityType[]>([])
  const [sort, setSort] = useState<SortOption>({ field: 'updatedAt', direction: 'desc' })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedEntityId, setSelectedEntityId] = useState<UUID | null>(null)
  const [itemsPerPage] = useState(8)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const filteredEntities = useEntityFiltering(entities, search, typeFilter)
  const sortedEntities = useEntitySorting(filteredEntities, sort)
  const paginatedEntities = useEntityPagination(sortedEntities, currentPage, itemsPerPage)

  const totalPages = Math.ceil(filteredEntities.length / itemsPerPage)

  const handleEntityClick = (entityId: UUID) => {
    setSelectedEntityId(entityId)
    setDialogOpen(true)
    setSelectedEntity(entityId)
  }

  const getItemClassName = (entityId: string) => {
    return cn(
      "p-4 cursor-pointer hover:bg-accent",
      "transition-colors duration-200",
      entityId === lastCreatedEntityId && "animate-entity-appear"
    )
  }

  useEffect(() => {
    if (lastCreatedEntityId) {
      const timer = setTimeout(() => {
        useWorldStore.getState().setLastCreatedEntityId(null)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [lastCreatedEntityId])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const EntitySkeleton = () => (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-3 w-[300px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-[80px]" />
          <Skeleton className="h-5 w-[60px]" />
        </div>
      </div>
    </Card>
  )

  return (
    <>
      <div className="space-y-4 border-2 rounded-lg p-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search entities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Select
              value={sort.field}
              onValueChange={(value) => setSort({ ...sort, field: value as SortOption['field'] })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="createdAt">Created</SelectItem>
                <SelectItem value="updatedAt">Updated</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setSort({ ...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc' })}
            >
              {sort.direction === 'asc' ? '↑' : '↓'}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['character', 'location', 'faction', 'item', 'event', 'timePeriod'] as EntityType[]).map((type) => (
              <Toggle
                key={type}
                pressed={typeFilter.includes(type)}
                onPressedChange={(pressed) => {
                  setTypeFilter(prev => 
                    pressed 
                      ? [...prev, type]
                      : prev.filter(t => t !== type)
                  )
                }}
                variant="outline"
                className="gap-2"
              >
                {formatEntityType(type)}
                <Badge variant="secondary" className="ml-1">
                  {entities.filter(e => e.type === type).length}
                </Badge>
              </Toggle>
            ))}
            {typeFilter.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setTypeFilter([])}
                className="text-muted-foreground"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {isLoading ? (
            Array.from({ length: itemsPerPage }).map((_, index) => (
              <EntitySkeleton key={index} />
            ))
          ) : (
            paginatedEntities.map((entity) => (
              <Card
                key={entity.id}
                className={getItemClassName(entity.id)}
                onClick={() => handleEntityClick(entity.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{entity.name}</h3>
                    <p className="text-sm text-muted-foreground">{entity.summary}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge>{formatSingularEntityType(entity.type)}</Badge>
                    {'subType' in entity && <Badge variant="secondary">{entity.subType}</Badge>}
                    {entity.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {paginatedEntities.length} of {filteredEntities.length} entities
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {selectedEntityId && (
        <EntitySheet
          entityId={selectedEntityId}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  )
} 