import { useCallback, useState } from 'react';
import { useWorldStore } from '@/store/world-store';
import { EntityType, WorldEntity } from '@/types/core';
import { entityTypeColors, subTypeColors } from '@/types/network-colors';
import { NetworkNode, NetworkLink, GraphData } from '@/types/network';

export function useNetworkInteractions(graphData: GraphData) {
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
  const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<NetworkLink>>(new Set());
  const [hoveredEntity, setHoveredEntity] = useState<WorldEntity | null>(null);
  const worldStore = useWorldStore();

  const handleNodeHover = useCallback((
    node: NetworkNode | null
  ) => {
    if (!node) {
      setHoveredNode(null);
      setHoveredEntity(null);
      setHighlightNodes(new Set());
      setHighlightLinks(new Set());
      return;
    }

    const typedNode = node as NetworkNode;
    setHoveredNode(typedNode);
    const entity = worldStore.entities.find(e => e.id === typedNode.id);
    if (entity) {
      setHoveredEntity(entity);
      
      const neighborIds = new Set(graphData.links
        .filter((link: NetworkLink) => link.source === typedNode.id || link.target === typedNode.id)
        .flatMap((link: NetworkLink) => [link.source, link.target]));
      
      setHighlightNodes(neighborIds);
      setHighlightLinks(new Set(graphData.links
        .filter((link: NetworkLink) => link.source === typedNode.id || link.target === typedNode.id)));
    }
  }, [graphData, worldStore.entities]);

  const getNodeColor = useCallback((node: NetworkNode) => {
    const baseColor = entityTypeColors[node.type as EntityType];
    const subTypeColor = subTypeColors[node.type as EntityType]?.[node.subType];
    return subTypeColor || baseColor;
  }, []);

  return {
    hoveredNode,
    highlightNodes,
    highlightLinks,
    hoveredEntity,
    handleNodeHover,
    getNodeColor
  };
} 