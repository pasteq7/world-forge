import { useMemo } from 'react'
import { WorldEntity } from '@/types/core'

export function useEntityPagination(
  entities: WorldEntity[],
  currentPage: number,
  itemsPerPage: number
) {
  return useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return entities.slice(startIndex, startIndex + itemsPerPage)
  }, [entities, currentPage, itemsPerPage])
} 