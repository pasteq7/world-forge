import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { UUID } from '@/types/core'
import { v4 as uuidv4 } from 'uuid'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUUID(): UUID {
  return uuidv4() as UUID
}

/**
 * Formats entity type strings into plural display-friendly text
 * @param type 
 */
export const formatEntityType = (type: string): string => {
  const formatMap: Record<string, string> = {
    character: 'Characters',
    location: 'Locations',
    faction: 'Factions',
    item: 'Items',
    event: 'Events',
    timePeriod: 'Time Periods'
  }
  
  return formatMap[type] || type
}

/**
 * Formats entity type strings into singular display-friendly text
 * @param type - The entity type to format
 */
export const formatSingularEntityType = (type: string): string => {
  const formatMap: Record<string, string> = {
    character: 'Character',
    location: 'Location',
    faction: 'Faction',
    item: 'Item',
    event: 'Event',
    timePeriod: 'Time Period'
  }

  return formatMap[type] || type
}