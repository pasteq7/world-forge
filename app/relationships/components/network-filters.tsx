import { Card } from "@/components/ui/card"
import { Filter, Info } from "lucide-react"
import { EntityType, SubTypes, RelationTypes, isCharacter } from '@/types/core'
import { NetworkFiltersProps, NetworkFiltersState } from '@/types/network'
import { useRef, useCallback } from 'react'
import { entityTypeColors, subTypeColors } from '@/types/network-colors'
import { useWorldStore } from '@/store/world-store'
import { formatEntityType  } from '@/lib/utils'
import { useNetworkFilters } from '@/app/relationships/hooks/useNetworkFilters';

function ScrollableCard({ children, className }: { children: React.ReactNode, className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const scrollContainer = cardRef.current?.querySelector('.scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTop += e.deltaY;
    }
  };

  return (
    <Card 
      ref={cardRef}
      tabIndex={0}
      className={`focus:outline-none ${className}`}
      onWheel={handleWheel}
    >
      {children}
    </Card>
  );
}

function FilterSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-1.5 pt-1">
      <div className="text-xs font-medium text-muted-foreground px-2 flex items-center justify-between">
        {title}
      </div>
      {children}
    </div>
  );
}

// Helper function to get entity type pairs
const getEntityTypePairs = (types: EntityType[]): Array<[EntityType, EntityType]> => {
  const pairs = new Set<string>();
  
  types.forEach(fromType => {
    types.forEach(toType => {
      if (RelationTypes[fromType]?.[toType] || RelationTypes[toType]?.[fromType]) {
        const pairKey = [fromType, toType]
          .sort((a, b) => a.localeCompare(b))
          .join('-');
        pairs.add(pairKey);
      }
    });
  });
  
  return Array.from(pairs).map(pair => {
    const [type1, type2] = pair.split('-') as [EntityType, EntityType];
    return [type1, type2];
  });
};

interface EntityTypeFilterProps {
  type: EntityType;
  activeFilters: NetworkFiltersState;
  onTypeClick: (type: EntityType) => void;
  onSubTypeClick: (type: EntityType, subType: string) => void;
  onExpandClick: (type: EntityType) => void;
  isExpanded: boolean;
}

function EntityTypeFilter({ 
  type, 
  activeFilters, 
  onTypeClick,
  onSubTypeClick,
  onExpandClick,
  isExpanded 
}: EntityTypeFilterProps) {
  const isSubTypesVisible = isExpanded;

  const handleTypeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onTypeClick(type);
  };

  const handleSubTypeClick = (e: React.MouseEvent, subType: string) => {
    e.preventDefault();
    e.stopPropagation();
    onSubTypeClick(type, subType);
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onExpandClick(type);
  };

  return (
    <div className="space-y-1.5">
      <div
        onClick={handleTypeClick}
        className={`w-full flex items-center justify-between px-2 py-1 rounded-md transition-colors hover:bg-accent cursor-pointer ${
          activeFilters.types.includes(type) ? 'bg-accent' : 'opacity-50'
        }`}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-2.5 h-2.5 rounded-full" 
            style={{ backgroundColor: entityTypeColors[type] }} 
          />
          <span className="text-sm">{formatEntityType(type)}</span>
        </div>
        {activeFilters.types.includes(type) && (
          <button
            onClick={handleExpandClick}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {isSubTypesVisible ? '−' : '+'}
          </button>
        )}
      </div>

      {activeFilters.types.includes(type) && isSubTypesVisible && (
        <div className="ml-4 space-y-1">
          {Object.entries(SubTypes[type]).map(([subType]) => (
            <div
              key={subType}
              onClick={(e) => handleSubTypeClick(e, subType)}
              className={`w-full flex items-center gap-1.5 px-2 py-0.5 rounded-md transition-colors hover:bg-accent cursor-pointer ${
                activeFilters.subTypes[type].includes(subType) ? 'bg-accent' : 'opacity-50'
              }`}
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: subTypeColors[type][subType] }} 
              />
              <span className="text-xs capitalize">{subType}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function NetworkFilters({ 
  hoveredEntity,
  is3D,
  setIs3D
}: NetworkFiltersProps) {
  const {
    networkFilters,
    handleTypeClick,
    handleSubTypeClick,
    handleExpandClick,
    handleReset
  } = useNetworkFilters();

  const handleRelationPairToggle = useCallback((pairKey: string) => {
    try {
      const currentFilters = { ...networkFilters };
      const newRelationPairs = currentFilters.relationPairs.includes(pairKey)
        ? currentFilters.relationPairs.filter((p: string) => p !== pairKey)
        : [...currentFilters.relationPairs, pairKey];
      
      useWorldStore.setState({
        networkFilters: {
          ...currentFilters,
          relationPairs: newRelationPairs
        }
      });
    } catch (error) {
      console.error('Error toggling relation pair:', error);
    }
  }, [networkFilters]);

  return (
    <>
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {/* View Controls Card */}
        <ScrollableCard className="p-2 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-0.5 bg-muted p-0.5 rounded-md">
            <button
              onClick={() => setIs3D(false)}
              className={`text-xs px-3 py-1.5 rounded-md transition-colors flex-1 ${
                !is3D 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'hover:bg-background/50'
              }`}
            >
              2D View
            </button>
            <button
              onClick={() => setIs3D(true)}
              className={`text-xs px-3 py-1.5 rounded-md transition-colors flex-1 ${
                is3D 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'hover:bg-background/50'
              }`}
            >
              3D View
            </button>
          </div>
        </ScrollableCard>

        {/* Filters Card */}
        <ScrollableCard className="p-3 bg-background/80 backdrop-blur-sm max-h-[calc(100vh-140px)]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filters & Legend</span>
            </div>
          </div>
          
          <div 
            className="space-y-3 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar scroll-container"
            style={{
              scrollbarGutter: 'stable',
              scrollbarWidth: 'thin'
            }}
          >
            <FilterSection title="Entity Types">
              <div className="space-y-1">
                {Object.values(EntityType).map((type) => (
                  <EntityTypeFilter 
                    key={type}
                    type={type}
                    activeFilters={networkFilters}
                    onTypeClick={handleTypeClick}
                    onSubTypeClick={handleSubTypeClick}
                    onExpandClick={handleExpandClick}
                    isExpanded={networkFilters.expandedTypes.has(type)}
                  />
                ))}
              </div>
            </FilterSection>

            {networkFilters.types.length > 0 && (
              <FilterSection title="Relationships">
                <div className="grid grid-cols-1 gap-1">
                  {getEntityTypePairs(networkFilters.types).map(([type1, type2]) => {
                    const pairKey = [type1, type2].sort().join('-');
                    return (
                      <button
                        key={pairKey}
                        onClick={() => handleRelationPairToggle(pairKey)}
                        className={`flex items-center justify-between px-2 py-1 rounded-md transition-colors hover:bg-accent ${
                          networkFilters.relationPairs.includes(pairKey)
                            ? 'bg-accent'
                            : 'opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5">
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: entityTypeColors[type1] }} 
                            />
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: entityTypeColors[type2] }} 
                            />
                          </div>
                          <span className="text-xs capitalize">
                            {type1} ↔ {type2}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {RelationTypes[type1]?.[type2]?.length || 0} types
                        </span>
                      </button>
                    );
                  })}
                </div>
              </FilterSection>
            )}
          </div>

          <button
            onClick={handleReset}
            className="w-full text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 py-1 px-2 rounded-md mt-3 border border-border/50"
          >
            Reset All Filters
          </button>
        </ScrollableCard>
      </div>

      {hoveredEntity && (
        <div className="absolute top-4 right-4 z-10">
          <Card className="p-4 w-64 bg-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4" />
              <span className="font-medium">{formatEntityType(hoveredEntity.type)} Details</span>
            </div>
            
            <div className="space-y-2">
              <div>
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="font-medium">{hoveredEntity.name}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Type</div>
                <div className="font-medium capitalize">{hoveredEntity.subType}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Connections</div>
                <div className="font-medium">
                  {useWorldStore.getState().getEntityRelations(hoveredEntity.id)?.length / 2 || 0} relationships
                </div>
              </div>

              {/* Entity-specific details */}
              {isCharacter(hoveredEntity) && hoveredEntity.biography && (
                <div>
                  <div className="text-sm text-muted-foreground">Biography</div>
                  <div className="text-sm line-clamp-3">{hoveredEntity.biography}</div>
                </div>
              )}
              {/* Add other entity type specific details as in original */}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}