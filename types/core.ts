export type UUID = `${string}-${string}-${string}-${string}-${string}`

// Base types for all entities
export type BaseEntity = {
  id: UUID
  type: EntityType
  name: string
  summary: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  lastViewed?: Date
}

// Entity Types
export const EntityType = {
  Character: 'character',
  Location: 'location',
  Faction: 'faction',
  Item: 'item',
  Event: 'event',
  TimePeriod: 'timePeriod'
} as const;

export type EntityType = (typeof EntityType)[keyof typeof EntityType];

// SubTypes
export const SubTypes = {
  character: {
    protagonist: 'protagonist',
    antagonist: 'antagonist',
    supporting: 'supporting',
    background: 'background'
  },
  location: {
    continent: 'continent',
    region: 'region',
    city: 'city',
    building: 'building',
    landmark: 'landmark',
  },
  event: {
    historical: 'historical',
    personal: 'personal',
    battle: 'battle',
    political: 'political'
  },
  item: {
    weapon: 'weapon',
    artifact: 'artifact',
    book: 'book',
    relic: 'relic'
  },
  faction: {
    guild: 'guild',
    kingdom: 'kingdom',
    clan: 'clan',
    race: 'race',
    alliance: 'alliance',
    order: 'order'
  },
  timePeriod: {
    age: 'age',
    era: 'era',
    epoch: 'epoch',
    period: 'period'
  }
} as const;

// Type helpers
export type SubTypeValues<T extends EntityType> = typeof SubTypes[T][keyof typeof SubTypes[T]];

// Entity type definitions
export type Character = BaseEntity & {
  type: typeof EntityType.Character;
  subType: SubTypeValues<'character'>;
  biography: string;
  age?: number;
  immortal?: boolean;
}

export type Location = BaseEntity & {
  type: typeof EntityType.Location;
  subType: SubTypeValues<'location'>;
  description: string;
  coordinates?: {
    x: number;
    y: number;
  };
  climate?: string;
  culture?: string;
}

export type Event = BaseEntity & {
  type: 'event'
  subType: SubTypeValues<'event'>
  description: string
  date: {
    start: string
    end?: string
  }
  consequences?: string[]
}

export type Item = BaseEntity & {
  type: 'item'
  subType: SubTypeValues<'item'>
  description: string
  powers?: string[]
  history: string
}

export type Faction = BaseEntity & {
  type: 'faction'
  subType: SubTypeValues<'faction'>
  description: string
  influence: number // 1-10
  beliefs: string[]
  traditions: string[]
}

export type TimePeriod = BaseEntity & {
  type: 'timePeriod'
  subType: SubTypeValues<'timePeriod'>
  description: string
  date: {
    start: string
    end?: string
  }
  majorChanges: string[]
  culturalCharacteristics: string[]
  technologicalLevel: string
}

// Union type for all entities
export type WorldEntity = Character | Location | Event | Item | Faction | TimePeriod;


// Relationship system
export type RelationType = {
  [FromType in EntityType]?: {
    [ToType in EntityType]?: readonly string[]
  }
}


// Valid Relation Type
export type ValidRelationType<
  From extends EntityType,
  To extends EntityType
> = From extends keyof typeof RelationTypes
  ? To extends keyof (typeof RelationTypes)[From]
    ? (typeof RelationTypes)[From][To]
    : never
  : never;

// Relation Metadata
export type RelationMetadata = {
  description?: string
  customType?: string
  inverseType?: string
  startDate?: string
  endDate?: string
  createdAt: string
}

// Main relationship type
export type EntityRelation = {
  id: UUID
  fromId: UUID
  fromType: EntityType
  toId: UUID
  toType: EntityType
  relationType: string
  metadata?: RelationMetadata
}

// Sort options
export type SortOption = {
  field: keyof Pick<BaseEntity, 'name' | 'createdAt' | 'updatedAt' | 'lastViewed'>
  direction: 'asc' | 'desc'
}

// Type guards
export const isCharacter = (entity: WorldEntity): entity is Character => 
  entity.type === 'character'

export const isFaction = (entity: WorldEntity): entity is Faction => 
  entity.type === 'faction'

export const isLocation = (entity: WorldEntity): entity is Location => 
  entity.type === 'location'

export const isEvent = (entity: WorldEntity): entity is Event => 
  entity.type === 'event'

export const isItem = (entity: WorldEntity): entity is Item => 
  entity.type === 'item'

export const isTimePeriod = (entity: WorldEntity): entity is TimePeriod => 
  entity.type === 'timePeriod'



export const RelationTypes: RelationType = {
  character: {
    character: ['friend', 'enemy', 'family', 'ally', 'rival'] as const,
    faction: ['member', 'leader', 'enemy'] as const,
    location: ['resides', 'owns', 'visits'] as const,
    item: ['owns', 'uses', 'discovers'] as const,
    event: ['participates', 'witnesses', 'affected'] as const,
    timePeriod: ['lives-in', 'born-in', 'died-in'] as const,
  },
  faction: {
    character: ['includes', 'led-by', 'opposes'] as const,
    faction: ['allied', 'hostile', 'neutral', 'vassal', 'overlord'] as const,
    location: ['controls', 'influences', 'based-in', 'claims'] as const,
    event: ['participates', 'sponsors', 'affected'] as const,
    item: ['possesses', 'seeks', 'creates'] as const,
    timePeriod: ['exists-in', 'founded-in', 'dissolved-in'] as const,
  },
  location: {
    character: ['home-of', 'ruled-by', 'visited-by'] as const,
    faction: ['controlled-by', 'claimed-by', 'influenced-by'] as const,
    location: ['contains', 'connects-to', 'borders', 'part-of'] as const,
    event: ['site-of', 'affected-by', 'changed-by'] as const,
    item: ['contains', 'produces', 'known-for'] as const,
    timePeriod: ['exists-in', 'founded-in', 'destroyed-in'] as const,
  },
  event: {
    character: ['involves', 'affects', 'caused-by'] as const,
    faction: ['involves', 'affects', 'sponsored-by'] as const,
    location: ['occurs-at', 'affects', 'changes'] as const,
    event: ['causes', 'precedes', 'follows', 'related-to'] as const,
    item: ['creates', 'destroys', 'involves'] as const,
    timePeriod: ['occurs-in', 'starts', 'ends'] as const,
  },
  item: {
    character: ['owned-by', 'created-by', 'used-by'] as const,
    faction: ['owned-by', 'created-by', 'sought-by'] as const,
    location: ['found', 'used', 'discovered'] as const,
    event: ['created', 'used', 'discovered'] as const,
    timePeriod: ['created-in', 'used-in', 'discovered-in'] as const,
  },
  timePeriod: {
    character: ['lived', 'influenced', 'related-to'] as const,
    location: ['affected', 'related-to', 'dominated'] as const,
    event: ['occurred', 'related-to', 'dominated'] as const,
  },
}

// Add this helper function at the bottom of the file
export const getCharacters = (state: { entities: WorldEntity[] }): Character[] => {
  return state.entities.filter(isCharacter);
};

// Define inverse relationships
export const InverseRelationTypes: Partial<Record<string, string>> = {
  'friend': 'friend',
  'enemy': 'enemy',
  'ally': 'ally',
  'rival': 'rival',
  'controls': 'controlled-by',
  'owns': 'owned-by',
  'resides': 'home-of',
  'home-of': 'resides',
  'visits': 'visited-by',
  'visited-by': 'visits',
  'rules': 'ruled-by',
  'ruled-by': 'rules',
  'member': 'has-member',
  'leader': 'led-by',
  'adjacent': 'adjacent',
  'connected': 'connected',
  'contains': 'part-of',
  'uses': 'used-by',
  'discovers': 'discovered-by',
  'owned-by': 'owns',
  'used-by': 'uses',
  'discovered-by': 'discovers',

  // Event-Character inverse pairs
  'participates': 'involves',
  'involves': 'participates',
  'witnesses': 'witnessed-by',
  'witnessed-by': 'witnesses',
  'affects': 'affected-by',
  'affected-by': 'affects',
  'caused-by': 'causes',
  'causes': 'caused-by',

  // Event-Location inverse pairs
  'occurs-at': 'site-of',
  'site-of': 'occurs-at',
  'changes': 'changed-by',
  'changed-by': 'changes',

  // Event-Event inverse pairs
  'precedes': 'follows',
  'follows': 'precedes',
  'related-to': 'related-to',

  // Event-Item inverse pairs
  'creates': 'created',
  'created': 'creates',
  'destroys': 'destroyed-by',
  'destroyed-by': 'destroys',

  // Faction-Character inverse pairs
  'includes': 'member',
  'led-by': 'leader',
  'opposes': 'opposed-by',
  'opposed-by': 'opposes',

  // Faction-Faction inverse pairs
  'allied': 'allied',
  'hostile': 'hostile',
  'neutral': 'neutral',
  'vassal': 'overlord',
  'overlord': 'vassal',

  // Faction-Location inverse pairs
  'controlled-by': 'controls',
  'influences': 'influenced-by',
  'influenced-by': 'influences',
  'based-in': 'base-of',
  'base-of': 'based-in',
  'claims': 'claimed-by',
  'claimed-by': 'claims',

  // Faction-Event inverse pairs
  'sponsors': 'sponsored-by',
  'sponsored-by': 'sponsors',
  'affected': 'affects',

  // Faction-Item inverse pairs
  'possesses': 'possessed-by',
  'possessed-by': 'possesses',
  'seeks': 'sought-by',
  'sought-by': 'seeks',
  'created-by': 'creates',

  // TimePeriod-Character inverse pairs
  'lives-in': 'lived',
  'lived': 'lives-in',
  'born-in': 'birth-of',
  'birth-of': 'born-in',
  'died-in': 'death-of',
  'death-of': 'died-in',
  'influenced': 'influenced-by',

  // TimePeriod-Faction inverse pairs
  'exists-in': 'existed',
  'existed': 'exists-in',
  'founded-in': 'founding-of',
  'founding-of': 'founded-in',
  'dissolved-in': 'dissolution-of',
  'dissolution-of': 'dissolved-in',

  // TimePeriod-Location inverse pairs
  'dominated': 'dominated-by',
  'dominated-by': 'dominated',

  // TimePeriod-Event inverse pairs
  'occurs-in': 'occurred',
  'occurred': 'occurs-in',
  'starts': 'started-by',
  'started-by': 'starts',
  'ends': 'ended-by',
  'ended-by': 'ends',

  // TimePeriod-Item inverse pairs
  'created-in': 'created-during',
  'created-during': 'created-in',
  'used-in': 'used-during',
  'used-during': 'used-in',
  'discovered-in': 'discovered-during',
  'discovered-during': 'discovered-in',
} as const;

// Helper to get inverse relation type
export const getInverseRelationType = (relationType: string): string | null => {
  return InverseRelationTypes[relationType] || null;
};

// Helper to check if a relation should have an inverse
export const shouldHaveInverse = (relationType: string): boolean => {
  return relationType in InverseRelationTypes;
};

export const validateRelation = (
  fromType: EntityType,
  toType: EntityType,
  relationType: string
): boolean => {
  // Always allow custom relations
  if (!RelationTypes[fromType]?.[toType]?.includes(relationType as any)) {
    return true; 
  }
  
  // Check predefined relations
  const forwardValid = RelationTypes[fromType]?.[toType]?.includes(relationType as any);
  const reverseValid = RelationTypes[toType]?.[fromType]?.includes(
    getInverseRelationType(relationType) || ''
  );
  
  return Boolean(forwardValid || reverseValid);
};

export const getAvailableRelations = (
  fromType: EntityType,
  toType: EntityType
): string[] => {
  const directRelations = RelationTypes[fromType]?.[toType] || [];
  const inverseRelations = RelationTypes[toType]?.[fromType]?.map(
    rel => getInverseRelationType(rel)
  ).filter((rel): rel is string => rel !== null) || [];
  
  return [...directRelations, ...inverseRelations, 'custom'];
};

