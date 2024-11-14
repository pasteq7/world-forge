import { useCallback } from 'react';
import { useWorldStore } from '@/store/world-store';
import { EntityType, RelationTypes, SubTypes } from '@/types/core';
import { DEFAULT_NETWORK_FILTERS } from '@/types/network';

export function useNetworkFilters() {
  const { networkFilters, setNetworkFilters } = useWorldStore();

  const handleTypeClick = useCallback((type: EntityType) => {
    const isTypeEnabled = !networkFilters.types.includes(type);
    const newTypes = isTypeEnabled
      ? [...networkFilters.types, type]
      : networkFilters.types.filter((t: EntityType) => t !== type);

    const newRelationPairs = new Set(networkFilters.relationPairs);
    
    if (isTypeEnabled) {
      if (RelationTypes[type]?.[type]) {
        const selfPairKey = [type, type].sort().join('-');
        newRelationPairs.add(selfPairKey);
      }

      networkFilters.types.forEach((existingType) => {
        const pairKey = [type, existingType].sort().join('-');
        if (RelationTypes[type]?.[existingType] || RelationTypes[existingType]?.[type]) {
          newRelationPairs.add(pairKey);
        }
      });
    } else {
      networkFilters.relationPairs = networkFilters.relationPairs.filter(pair => {
        const [type1, type2] = pair.split('-');
        return type1 !== type && type2 !== type;
      });
    }

    setNetworkFilters({
      ...networkFilters,
      types: newTypes,
      subTypes: {
        ...networkFilters.subTypes,
        [type]: isTypeEnabled ? Object.keys(SubTypes[type]) : []
      },
      relationPairs: isTypeEnabled ? Array.from(newRelationPairs) : networkFilters.relationPairs
    });
  }, [networkFilters, setNetworkFilters]);

  const handleSubTypeClick = useCallback((type: EntityType, subType: string) => {
    setNetworkFilters({
      ...networkFilters,
      subTypes: {
        ...networkFilters.subTypes,
        [type]: networkFilters.subTypes[type].includes(subType)
          ? networkFilters.subTypes[type].filter((t: string) => t !== subType)
          : [...networkFilters.subTypes[type], subType]
      }
    });
  }, [networkFilters, setNetworkFilters]);

  const handleExpandClick = useCallback((type: EntityType) => {
    const newExpandedTypes = new Set(networkFilters.expandedTypes);
    if (newExpandedTypes.has(type)) {
      newExpandedTypes.delete(type);
    } else {
      newExpandedTypes.add(type);
    }
    setNetworkFilters({
      ...networkFilters,
      expandedTypes: newExpandedTypes
    });
  }, [networkFilters, setNetworkFilters]);

  const handleReset = useCallback(() => {
    setNetworkFilters(DEFAULT_NETWORK_FILTERS);
  }, [setNetworkFilters]);

  return {
    networkFilters,
    handleTypeClick,
    handleSubTypeClick,
    handleExpandClick,
    handleReset
  };
} 