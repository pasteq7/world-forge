import { useMemo } from 'react';
import { useWorldStore } from '@/store/world-store';
import { NetworkNode, NetworkLink } from '@/types/network';
import { entityTypeColors, subTypeColors, relationshipColors } from '@/types/network-colors';

export function useNetworkGraph() {
  const worldStore = useWorldStore();
  const { networkFilters } = useWorldStore();

  const graphData = useMemo(() => {
    const { entities, relations } = worldStore;
    
    const filteredEntities = entities.filter(entity => 
      networkFilters.types.includes(entity.type) &&
      networkFilters.subTypes[entity.type].includes(entity.subType)
    );

    const nodes: NetworkNode[] = filteredEntities.map(entity => ({
      id: entity.id,
      name: entity.name,
      type: entity.type,
      subType: entity.subType,
      val: 5,
      color: subTypeColors[entity.type][entity.subType] || entityTypeColors[entity.type]
    }));

    const links: NetworkLink[] = relations
      .filter(relation => {
        const fromEntity = entities.find(e => e.id === relation.fromId);
        const toEntity = entities.find(e => e.id === relation.toId);
        
        if (!fromEntity || !toEntity) return false;

        const bothEntitiesIncluded = 
          nodes.some(n => n.id === relation.fromId) &&
          nodes.some(n => n.id === relation.toId);

        const typePair = [fromEntity.type, toEntity.type]
          .sort((a, b) => a.localeCompare(b))
          .join('-');
        
        return bothEntitiesIncluded && networkFilters.relationPairs.includes(typePair);
      })
      .map(relation => ({
        source: relation.fromId,
        target: relation.toId,
        value: 1,
        relationType: relation.relationType,
        color: relationshipColors[relation.relationType as keyof typeof relationshipColors] || '#999999'
      }));

    return { nodes, links };
  }, [worldStore, networkFilters]);

  return { graphData };
} 