import { EntityType, ValidRelationType } from '@/types/core'

export const entityTypeColors: Record<EntityType, string> = {
  character: '#3b82f6',
  location: '#22c55e',
  event: '#f59e0b',
  item: '#8b5cf6',
  faction: '#ef4444',
  timePeriod: '#06b6d4'
}

export const subTypeColors: Record<EntityType, Record<string, string>> = {
  character: {
    protagonist: '#22c55e',
    antagonist: '#ef4444',
    supporting: '#3b82f6',
    background: '#6b7280',
  },
  location: {
    continent: '#8BE8E1',
    region: '#4AC9C2',
    city: '#5CD6CF',
    landmark: '#2A9E97',
    building: '#9FF0EA'
  },
  item: {
    weapon: '#5CC3D9',
    artifact: '#7DD1E3',
    book: '#2B92A6',
    relic: '#1E7A8C'
  },
  faction: {
    guild: '#A7D9C4',
    kingdom: '#93C5AE',
    clan: '#7FB198',
    race: '#6B9D82',
    alliance: '#578B6C',
    order: '#437956'
  },
  event: {
    historical: '#FFF4C2',
    personal: '#FFE99B',
    battle: '#FFF1BB',
    political: '#FFE070'
  },
  timePeriod: {
    age: '#FF8787',
    era: '#D35656',
    epoch: '#FFB4B4',
    period: '#FFCECE'
  }
}

export const relationshipColors: Record<ValidRelationType<'character', 'character'>, string> = {
  ally: '#4CAF50',
  enemy: '#F44336',
  family: '#9C27B0',
  friend: '#2196F3',
  neutral: '#9E9E9E',
  rival: '#FF9800'
} 