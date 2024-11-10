import { Dispatch, SetStateAction } from 'react';
import { EntityType, SubTypes, WorldEntity } from '@/types/core';
import { NodeObject, LinkObject } from 'react-force-graph-3d';
import * as THREE from 'three';
export type NetworkFiltersState = {
  types: EntityType[];
  subTypes: {
    [K in EntityType]: string[];
  };
  relationPairs: string[];
  expandedTypes: Set<EntityType>;
};

export interface NetworkNode extends ForceGraphNodeObject {
  id: string;
  name: string;
  type: EntityType;
  subType: string;
  val: number;
  color: string;
}

export interface NetworkLink {
  source: string;
  target: string;
  value: number;
  relationType: string;
  color: string;
}

export interface GraphData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

export interface NetworkFiltersProps {
  hoveredEntity: WorldEntity | null;
  is3D: boolean;
  setIs3D: Dispatch<SetStateAction<boolean>>;
}
  
export interface DefaultNetworkFilters {
  types: EntityType[];
  subTypes: Record<EntityType, string[]>;
  relationPairs: string[];
}

export const DEFAULT_NETWORK_FILTERS: NetworkFiltersState = {
  types: [EntityType.Character],
  subTypes: {
    character: Object.values(SubTypes.character),
    location: [],
    event: [],
    item: [],
    faction: [],
    timePeriod: []
  },
  relationPairs: ['character-character'],
  expandedTypes: new Set<EntityType>()
}; 

export function isValidNetworkNode(node: unknown): node is NetworkNode {
  return (
    typeof node === 'object' &&
    node !== null &&
    'id' in node &&
    'name' in node &&
    'type' in node
  );
}

export interface ForceGraphInstance {
  force: (name: string) => {
    strength?: (value: number) => void;
    radius?: (value: number | ((node: { val: number }) => number)) => void;
  } | undefined;
  pauseAnimation: () => void;
  resumeAnimation: () => void;
  zoomToFit: (duration: number, padding: number) => void;
}

export interface ForceGraphNodeObject {
  id?: string | number;
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
  fx?: number;
  fy?: number;
  fz?: number;
}

export interface ForceGraphProps<NodeType = ForceGraphNodeObject, LinkType = any> {
  graphData: {
    nodes: NodeType[];
    links: LinkType[];
  };
  nodeCanvasObject?: (node: NodeType, ctx: CanvasRenderingContext2D) => void;
  nodeThreeObject?: (node: NodeType) => THREE.Object3D | undefined;
  width?: number;
  height?: number;
  backgroundColor?: string;
  enableNodeDrag?: boolean;
  enableZoomInteraction?: boolean;
  minZoom?: number;
  maxZoom?: number;
  cooldownTicks?: number;
  cooldownTime?: number;
  showNavInfo?: boolean;
  enablePointerInteraction?: boolean;
  linkCurvature?: number;
  onNodeClick?: (node: NodeType) => void;
  onNodeHover?: (node: NodeType | null, prev: NodeType | null) => void;
  onNodeDragEnd?: (node: NodeType) => void;
  onEngineStop?: () => void;
}

export type ForceGraphNodeExtended = ForceGraphNodeObject & {
  name: string;
  type: EntityType;
  subType: string;
  val: number;
  color: string;
};

export type NodeHoverHandler = (
  node: ForceGraphNodeObject | null,
  previousNode: ForceGraphNodeObject | null
) => void;

// Update the ForceGraphMethods type to be more specific
export type BaseForceGraphMethods<
  NodeType = NodeObject<Partial<NetworkNode>>,
  LinkType = LinkObject<Partial<NetworkNode>, NetworkLink>
> = {
  d3Force: (name: string) => {
    strength?: (value: number) => void;
    radius?: (value: number | ((node: { val: number }) => number)) => void;
  } | undefined;
  pauseAnimation: () => void;
  resumeAnimation: () => void;
  zoomToFit: (duration: number, padding: number) => void;
  graphData: () => { nodes: NodeType[], links: LinkType[] };
};

// 2D specific methods
export type ForceGraph2DMethods<
  NodeType = NodeObject<Partial<NetworkNode>>,
  LinkType = LinkObject<Partial<NetworkNode>, NetworkLink>
> = BaseForceGraphMethods<NodeType, LinkType>;

// 3D specific methods
export type ForceGraph3DMethods<
  NodeType = NodeObject<Partial<NetworkNode>>,
  LinkType = LinkObject<Partial<NetworkNode>, NetworkLink>
> = BaseForceGraphMethods<NodeType, LinkType> & {
  cameraPosition: (position?: {x?: number, y?: number, z?: number}) => void;
  postProcessingComposer: () => any;
  lights: () => any[];
  scene: () => any;
  refresh: () => void;
};

// Combined type that can handle both 2D and 3D
export type ForceGraphMethods<
  NodeType = NodeObject<Partial<NetworkNode>>,
  LinkType = LinkObject<Partial<NetworkNode>, NetworkLink>
> = ForceGraph2DMethods<NodeType, LinkType> | ForceGraph3DMethods<NodeType, LinkType>;
