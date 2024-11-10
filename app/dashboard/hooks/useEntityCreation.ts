import { useCallback } from 'react'
import { EntityType, WorldEntity, SubTypes } from '@/types/core'
import { useWorldStore } from '@/store/world-store'
import { generateUUID } from '@/lib/utils'
import confetti from 'canvas-confetti'

export function useEntityCreation(buttonRef: React.RefObject<HTMLButtonElement>) {
  const addEntity = useWorldStore((state) => state.addEntity)
  const setLastCreatedEntityId = useWorldStore((state) => state.setLastCreatedEntityId)

  const createEntity = useCallback((entityName: string, entityType: EntityType) => {
    if (!entityName.trim()) return

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const x = (rect.left + rect.width / 2) / window.innerWidth
      const y = (rect.top + rect.height / 2) / window.innerHeight
      
      confetti({
        particleCount: 15,
        spread: 40,
        origin: { x, y },
        colors: ['#a855f7', '#7c3aed', '#6366f1', '#ec4899'],
        ticks: 100,
        startVelocity: 15,
        scalar: 0.7,
        disableForReducedMotion: true
      })
    }

    const baseEntity = {
      id: generateUUID(),
      name: entityName,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      summary: '',
    }

    const newEntity = createEntityByType(entityType, baseEntity)
    addEntity(newEntity)
    setLastCreatedEntityId(newEntity.id)
    
    return newEntity.id
  }, [addEntity, setLastCreatedEntityId, buttonRef])

  return { createEntity }
}

function createEntityByType(entityType: EntityType, baseEntity: Partial<WorldEntity>): WorldEntity {
  switch (entityType) {
    case 'character':
      return {
        ...baseEntity,
        type: 'character',
        subType: SubTypes.character.supporting,
        biography: '',
      } as WorldEntity
    case 'location':
      return {
        ...baseEntity,
        type: 'location',
        subType: SubTypes.location.landmark,
        description: '',
      } as WorldEntity
    case 'event':
      return {
        ...baseEntity,
        type: 'event',
        subType: SubTypes.event.historical,
        description: '',
        date: {
          start: '',
        },
        consequences: [],
      } as WorldEntity
    case 'item':
      return {
        ...baseEntity,
        type: 'item',
        subType: SubTypes.item.weapon,
        description: '',
        history: '',
        powers: [],
      } as WorldEntity
    case 'faction':
      return {
        ...baseEntity,
        type: 'faction',
        subType: SubTypes.faction.guild,
        description: '',
        influence: 5,
        beliefs: [],
        traditions: [],
      } as WorldEntity
    case 'timePeriod':
      return {
        ...baseEntity,
        type: 'timePeriod',
        subType: SubTypes.timePeriod.era,
        description: '',
        date: {
          start: '',
        },
        majorChanges: [],
        culturalCharacteristics: [],
        technologicalLevel: '',
      } as WorldEntity
    default:
      throw new Error(`Unsupported entity type: ${entityType}`)
  }
} 