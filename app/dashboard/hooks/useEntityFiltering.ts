import { useMemo } from 'react'
import { EntityType, WorldEntity, SortOption } from '@/types/core'

export function useEntityFiltering(
  entities: WorldEntity[],
  search: string,
  typeFilter: EntityType[]
) {
  return useMemo(() => {
    return entities
      .filter((entity) => {
        const matchesSearch = entity.name.toLowerCase().includes(search.toLowerCase()) ||
          entity.summary.toLowerCase().includes(search.toLowerCase()) ||
          entity.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
        const matchesType = typeFilter.length === 0 || typeFilter.includes(entity.type)
        return matchesSearch && matchesType
      })
  }, [entities, search, typeFilter])
}

export function useEntitySorting(entities: WorldEntity[], sort: SortOption) {
  return useMemo(() => {
    return [...entities].sort((a, b) => {
      const aValue = a[sort.field] ?? ''
      const bValue = b[sort.field] ?? ''
      const modifier = sort.direction === 'asc' ? 1 : -1
      
      if (sort.field === 'createdAt' || sort.field === 'updatedAt') {
        return (new Date(aValue).getTime() - new Date(bValue).getTime()) * modifier
      }
      
      return aValue < bValue ? -1 * modifier : aValue > bValue ? 1 * modifier : 0
    })
  }, [entities, sort])
} 