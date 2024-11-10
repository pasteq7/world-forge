import { useMemo } from 'react'
import { WorldEntity } from '@/types/core'

export function useWorldOverview(entities: WorldEntity[]) {
  return useMemo(() => 
    entities.reduce((acc, entity) => ({
      ...acc,
      [entity.type]: (acc[entity.type] || 0) + 1
    }), {
      character: 0,
      location: 0,
      event: 0,
      item: 0,
      timePeriod: 0,
      faction: 0,
    })
  , [entities])
} 