import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  WorldEntity, UUID, Character, Location,  
  EntityRelation, EntityType, ValidRelationType, 
  isTimePeriod,   isFaction, isCharacter, 
  isLocation, isEvent, isItem, getCharacters, 
   getInverseRelationType, shouldHaveInverse,
  validateRelation, RelationMetadata
} from '@/types/core';
import { saveAs } from 'file-saver';
import { useMapStore } from '@/store/map-store';
import { v4 as uuidv4 } from 'uuid';
import { NetworkFiltersState, DEFAULT_NETWORK_FILTERS } from '@/types/network';

interface WorldState {
  entities: WorldEntity[];
  relations: EntityRelation[];
  selectedEntityId: UUID | null;
  searchQuery: string;
  filters: {
    types: EntityType[];
    tags: string[];
  };
  
  // Core CRUD
  addEntity: <T extends WorldEntity>(entity: T) => void;
  updateEntity: <T extends WorldEntity>(
    id: UUID, 
    updates: Partial<Omit<T, 'type' | 'id'>>
  ) => void;
  deleteEntity: (id: UUID) => void;
  getEntity: (id: UUID) => WorldEntity | undefined;
  
  // UI State
  setSelectedEntity: (id: UUID | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: WorldState['filters']) => void;
  
  // Relationships
  addEntityRelation: (
    fromId: UUID,
    fromType: EntityType,
    toId: UUID,
    toType: EntityType,
    relationType: string,
    metadata?: RelationMetadata
  ) => void;
  
  updateEntityRelation: (
    fromId: UUID,
    toId: UUID,
    updates: Partial<EntityRelation>
  ) => void;
  
  deleteEntityRelation: (relationId: UUID) => void;
  
  getEntityRelations: (entityId: UUID) => EntityRelation[];
  
  // Advanced Queries
  getRelatedEntities: (entityId: UUID) => WorldEntity[];
  getLocationHierarchy: (locationId: UUID) => Location[];
  searchEntities: (query: string) => WorldEntity[];
  
  // Import/Export
  exportWorld: () => Promise<Blob>;
  importWorld: (jsonData: string) => void;
  
  // Network
  getCharacterNetwork: () => {
    nodes: Character[];
    links: EntityRelation[];
  };
  getAllTags: () => string[];
  getEntitiesWithTag: (tag: string) => WorldEntity[];
  addRelation: (relation: EntityRelation) => void;
  validateRelationType: <From extends EntityType, To extends EntityType>(
    fromType: From,
    toType: To,
    relationType: ValidRelationType<From, To> | string
  ) => boolean;
  syncLocationMarkers: () => void;
  getLocationsWithMarkers: () => Location[];
  removeRelation: (relationId: UUID) => void;
  lastCreatedEntityId: string | null;
  setLastCreatedEntityId: (id: string | null) => void;
  networkFilters: NetworkFiltersState;
  setNetworkFilters: (filters: NetworkFiltersState) => void;
}

// Export
type WorldExportData = {
  entities: WorldEntity[];
  relations: EntityRelation[];
  map?: {
    markers: any[];
  };
};


export const useWorldStore = create<WorldState>()(
  persist(
    (set, get) => ({
      entities: [],
      relations: [],
      selectedEntityId: null,
      searchQuery: '',
      filters: {
        types: ['character', 'location', 'event'],
        tags: [],
      },
      
      addEntity: <T extends WorldEntity>(entity: T) => 
        set(state => ({
          entities: [
            ...state.entities, 
            {
              ...entity,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          ]
        })),
      
      updateEntity: <T extends WorldEntity>(
        id: UUID, 
        updates: Partial<Omit<T, 'type' | 'id'>>
      ) =>
        set(state => {
          const entityIndex = state.entities.findIndex(e => e.id === id);
          if (entityIndex === -1) return state;
          
          const updatedEntity = {
            ...state.entities[entityIndex],
            ...updates,
            updatedAt: new Date()
          };
          
          if (JSON.stringify(state.entities[entityIndex]) === JSON.stringify(updatedEntity)) {
            return state;
          }
          
          const newEntities = [...state.entities];
          newEntities[entityIndex] = updatedEntity;
          
          return { ...state, entities: newEntities };
        }),
      
      deleteEntity: (id: UUID) =>
        set(state => ({
          entities: state.entities.filter(entity => entity.id !== id),
          relations: state.relations.filter(rel => 
            rel.fromId !== id && rel.toId !== id
          )
        })),
      
      getEntity: (id: UUID): WorldEntity | undefined => get().entities.find(entity => entity.id === id),
      
      setSelectedEntity: (id) => set({ selectedEntityId: id }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilters: (filters) => set({ filters }),
      
      addEntityRelation: (fromId, fromType, toId, toType, relationType, metadata) => {
        const newRelation: EntityRelation = {
          id: uuidv4() as UUID,
          fromId,
          fromType,
          toId,
          toType,
          relationType,
          metadata
        };

        get().addRelation(newRelation);
      },
      
      updateEntityRelation: (fromId, toId, updates) =>
        set((state) => ({
          relations: state.relations.map(rel => {
            if (rel.fromId === fromId && rel.toId === toId) {
              return { ...rel, ...updates } as EntityRelation;
            }
            return rel;
          })
        })),
      deleteEntityRelation: (relationId: UUID) =>
        set(state => {
          const relationToRemove = state.relations.find(r => r.id === relationId);
          if (!relationToRemove) return state;

          // For custom relations with metadata.inverseType
          if (relationToRemove.metadata?.inverseType) {
            return {
              relations: state.relations.filter(r => r.id !== relationId)
            };
          }

          // For predefined relations, handle inverse
          const inverseType = getInverseRelationType(relationToRemove.relationType);
          if (shouldHaveInverse(relationToRemove.relationType) && inverseType) {
            const inverseRelation = state.relations.find(r => 
              r.fromId === relationToRemove.toId &&
              r.toId === relationToRemove.fromId &&
              r.relationType === inverseType
            );

            return {
              relations: state.relations.filter(r => 
                r.id !== relationId && 
                (inverseRelation ? r.id !== inverseRelation.id : true)
              )
            };
          }
          return {
            relations: state.relations.filter(r => r.id !== relationId)
          };
        }),
      getEntityRelations: (entityId) => {
        const state = get();
        return state.relations.filter(
          rel => rel.fromId === entityId || rel.toId === entityId
        );
      },
      validateRelationType: <From extends EntityType, To extends EntityType>(
        fromType: From,
        toType: To,
        relationType: ValidRelationType<From, To> | string
      ) => {
        if (relationType === 'custom') return true;
        
        return validateRelation(fromType, toType, relationType);
      },
      
      getRelatedEntities: (entityId: UUID): WorldEntity[] => {
        const state = get();
        return state.relations
          .filter(rel => rel.fromId === entityId || rel.toId === entityId)
          .map(rel => (rel.fromId === entityId ? state.getEntity(rel.toId) : state.getEntity(rel.fromId)))
          .filter((entity): entity is WorldEntity => {
            if (!entity) return false;
            return isCharacter(entity) || isLocation(entity) || isEvent(entity) || isItem(entity) || isFaction(entity) || isTimePeriod(entity);
          });
      },
      
      getLocationHierarchy: (locationId) => {
        const state = get();
        const location = state.getEntity(locationId);
        if (!location || !isLocation(location)) return [];
        
        const parentRelations = state.relations.filter(rel => 
          rel.toId === locationId && rel.relationType === 'contains'
        );

        return parentRelations
          .map(rel => state.getEntity(rel.fromId))
          .filter((entity): entity is Location => 
            entity !== undefined && isLocation(entity)
          );
      },
      
      searchEntities: (query) => {
        const state = get();
        const normalizedQuery = query.toLowerCase();
        
        return state.entities.filter(entity => 
          entity.name.toLowerCase().includes(normalizedQuery) ||
          entity.summary.toLowerCase().includes(normalizedQuery) ||
          entity.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
        );
      },
      
      exportWorld: async () => {
        const state = get();
        const mapState = useMapStore.getState();
        
        const exportData: WorldExportData = {
          entities: state.entities,
          relations: state.relations,
          map: {
            markers: mapState.markers
          }
        };
        
        const fileName = `world-export-${new Date().toISOString()}.json`;
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: 'application/json',
        });
        
        saveAs(blob, fileName);
        return blob;
      },
      
      importWorld: async (jsonData: string) => {
        try {
          const parsedData = JSON.parse(jsonData);

          // Handle new format (version 1)
          if (parsedData.version === 1 && parsedData.world) {
            // Import world data
            set({ 
              entities: parsedData.world.entities || [],
              relations: parsedData.world.relations || [],
              selectedEntityId: null,
              searchQuery: '',
              filters: {
                types: [],
                tags: []
              }
            });
            
            // Import map data
            if (parsedData.map) {
              useMapStore.setState({
                mapImage: parsedData.map.image || null,
                markers: parsedData.map.markers || []
              });
            }
            return;
          }

          // Handle old format
          if (Array.isArray(parsedData.entities)) {
            set({ 
              entities: parsedData.entities,
              relations: parsedData.relations || [],
              selectedEntityId: null,
              searchQuery: '',
              filters: {
                types: [],
                tags: []
              }
            });
            
            // Handle old map data format
            if (parsedData.map?.markers) {
              useMapStore.setState(state => ({
                ...state,
                markers: parsedData.map.markers
              }));
            }
            return;
          }

          throw new Error('Unrecognized data format');
        } catch (error) {
          console.error('Failed to import world data:', error);
          throw new Error('Invalid world data format');
        }
      },
      
      getCharacterNetwork: () => {
        const state = get();
        const characters = getCharacters(state);
        const links = state.relations.filter(
          rel => rel.fromType === 'character' && rel.toType === 'character'
        );
        return { nodes: characters, links };
      },
      
      getAllTags: () => {
        const state = get();
        const tagSet = new Set<string>();
        state.entities.forEach(entity => {
          entity.tags.forEach(tag => tagSet.add(tag));
        });
        return Array.from(tagSet);
      },
      getEntitiesWithTag: (tag: string) => {
        const state = get();
        return state.entities.filter(entity => 
          entity.tags.includes(tag)
        );
      },
      addRelation: (relation: EntityRelation) => {
        // Check if a similar relation already exists
        const existingRelation = get().relations.find(r => 
          r.fromId === relation.fromId && 
          r.toId === relation.toId && 
          r.relationType === relation.relationType
        );
        
        if (existingRelation) return;

        // Add the primary relation
        const relations = [...get().relations, relation];
        
        // For predefined relations, handle inverse automatically
        if (!relation.metadata?.inverseType) {
          const inverseType = getInverseRelationType(relation.relationType);
          if (shouldHaveInverse(relation.relationType) && inverseType) {
            const existingInverse = get().relations.find(r => 
              r.fromId === relation.toId && 
              r.toId === relation.fromId && 
              r.relationType === inverseType
            );
            
            if (!existingInverse) {
              const inverseRelation: EntityRelation = {
                id: uuidv4() as UUID,
                fromId: relation.toId,
                fromType: relation.toType,
                toId: relation.fromId,
                toType: relation.fromType,
                relationType: inverseType,
                metadata: relation.metadata
              };
              
              relations.push(inverseRelation);
            }
          }
        }
        
        set({ relations });
      },
      removeRelation: (relationId: UUID) => {
        const relationToRemove = get().relations.find(r => r.id === relationId);
        if (!relationToRemove) return;

        // For custom relations with metadata.inverseType
        if (relationToRemove.metadata?.inverseType) {
          set(state => ({
            relations: state.relations.filter(r => r.id !== relationId)
          }));
          return;
        }

        // For predefined relations, handle inverse
        const inverseType = getInverseRelationType(relationToRemove.relationType);
        if (shouldHaveInverse(relationToRemove.relationType) && inverseType) {
          const inverseRelation = get().relations.find(r => 
            r.fromId === relationToRemove.toId &&
            r.toId === relationToRemove.fromId &&
            r.relationType === inverseType
          );

          set(state => ({
            relations: state.relations.filter(r => 
              r.id !== relationId && 
              (inverseRelation ? r.id !== inverseRelation.id : true)
            )
          }));
        } else {
          // No inverse relation, just remove the single relation
          set(state => ({
            relations: state.relations.filter(r => r.id !== relationId)
          }));
        }
      },
      syncLocationMarkers: () => {
        const locations = get().entities.filter(isLocation);
        useMapStore.getState().syncMarkersWithLocations(locations);
      },
      getLocationsWithMarkers: () => {
        const markers = useMapStore.getState().markers;
        return get().entities
          .filter(isLocation)
          .filter(location => 
            markers.some(marker => marker.locationId === location.id)
          ) as Location[];
      },
      lastCreatedEntityId: null,
      setLastCreatedEntityId: (id) => set({ lastCreatedEntityId: id }),
      networkFilters: DEFAULT_NETWORK_FILTERS,
      
      setNetworkFilters: (filters: NetworkFiltersState) => 
        set(state => ({
          networkFilters: {
            ...filters,
            // Ensure expandedTypes is properly typed
            expandedTypes: filters.expandedTypes instanceof Set 
              ? (filters.expandedTypes as Set<EntityType>)
              : new Set<EntityType>(filters.expandedTypes)
          }
        })),
    }),
    {
      name: 'world-builder-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ...state,
        networkFilters: {
          ...state.networkFilters,
          // Convert Set to Array for storage with proper typing
          expandedTypes: Array.from(state.networkFilters.expandedTypes as Set<EntityType>)
        }
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert Array back to Set after rehydration with proper typing
          state.networkFilters.expandedTypes = new Set<EntityType>(
            state.networkFilters.expandedTypes as unknown as EntityType[]
          );
        }
      },
      skipHydration: false,
    }
  )
);

// Add an export function that combines world and map data
export const exportWorldWithMap = () => {
  const worldState = useWorldStore.getState();
  const mapState = useMapStore.getState();

  const exportData = {
    world: worldState,
    map: {
      image: mapState.mapImage,
      markers: mapState.markers
    },
    version: 1, // Add version control for future compatibility
    exportDate: new Date().toISOString()
  };

  // Create and trigger download
  const dataStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `world-export-${new Date().toISOString()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importWorldData = (jsonData: string) => {
  try {
    const data = JSON.parse(jsonData);
    
    // Check version and handle accordingly
    if (data.version === 1) {
      // Import world data
      useWorldStore.setState(data.world);
      
      // Import map data
      useMapStore.setState({
        mapImage: data.map.image,
        markers: data.map.markers
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to import world data:', error);
    return false;
  }
};

