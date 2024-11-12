'use client';

import { createNode3DObject } from './node-3d-object';
import { NetworkFilters } from './network-filters';
import { useCallback, useRef, useEffect, useState, useMemo } from 'react';
import { EntitySheet } from '@/components/common/entity-sheet';
import { useNetworkGraph } from '@/app/relationships/hooks/useNetworkGraph';
import { useNetworkInteractions } from '@/app/relationships/hooks/useNetworkInteractions';
import { 
  ForceGraphInstance, 
  NetworkNode, 
  NetworkLink, 
  ForceGraphNodeObject 
} from '@/types/network';
import { NodeObject, LinkObject } from 'react-force-graph-2d';
import ForceGraph2D from 'react-force-graph-2d';
import ForceGraph3D from 'react-force-graph-3d';
import { ForceGraphMethods as ForceGraph2DMethods } from 'react-force-graph-2d';
import { ForceGraphMethods as ForceGraph3DMethods } from 'react-force-graph-3d';

const FONT_SIZE = 4;

// Define the specific node and link types for better type inference
type GraphNode = NodeObject<Partial<NetworkNode>>;
type GraphLink = LinkObject<Partial<NetworkNode>, NetworkLink>;

export function RelationsNetwork() {
  const [is3D, setIs3D] = useState(false);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isStabilized, setIsStabilized] = useState(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const fg2DRef = useRef<ForceGraph2DMethods<GraphNode, GraphLink>>();
  const fg3DRef = useRef<ForceGraph3DMethods<GraphNode, GraphLink>>();

  const { graphData } = useNetworkGraph();
  const {
    hoveredEntity,
    handleNodeHover: rawHandleNodeHover,
    getNodeColor,
    highlightLinks
  } = useNetworkInteractions(graphData);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (element) {
      element.addEventListener('touchstart', handleTouchStart, { passive: false });
      return () => {
        element.removeEventListener('touchstart', handleTouchStart);
      };
    }
  }, [handleTouchStart]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const updateDimensions = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      // Only update if dimensions actually changed or are null
      setDimensions(prev => {
        if (!prev || prev.width !== width || prev.height !== height) {
          return { width, height };
        }
        return prev;
      });
    };

    // Run immediately
    updateDimensions();
    
    // Add resize listener
    window.addEventListener('resize', updateDimensions);
    
    // Run after a short delay to ensure container is properly laid out
    const timeout = setTimeout(updateDimensions, 300);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timeout);
    };
  }, []);

  const handleNodeClick = useCallback((node: ForceGraphNodeObject) => {
    setSelectedEntityId(node.id as string);
    setDialogOpen(true);
  }, []);

  const nodeCanvasObject = useCallback((
    node: GraphNode,
    ctx: CanvasRenderingContext2D,
  ) => {
    const size = node.val || 5;
    const label = (node as NetworkNode).name;
    const isHovered = hoveredEntity?.id === node.id;
    
    ctx.beginPath();
    
    if (isHovered) {
      ctx.save();
      ctx.shadowColor = getNodeColor(node as NetworkNode);
      ctx.shadowBlur = 15;
      ctx.arc(node.x || 0, node.y || 0, size + 2, 0, 2 * Math.PI);
      ctx.fillStyle = getNodeColor(node as NetworkNode);
      ctx.fill();
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, size, 0, 2 * Math.PI);
    ctx.fillStyle = getNodeColor(node as NetworkNode);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${isHovered ? 'bold' : ''} ${FONT_SIZE}px "Inter", system-ui, -apple-system, sans-serif`;
    
    const textWidth = ctx.measureText(label).width;
    const padding = 4;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(
      (node.x || 0) - textWidth/2 - padding,
      (node.y || 0) + size + padding,
      textWidth + padding * 2,
      FONT_SIZE + padding * 2
    );
    
    ctx.fillStyle = '#ffffff';
    ctx.fillText(label, node.x || 0, (node.y || 0) + size + FONT_SIZE/2 + padding * 1.5);
  }, [getNodeColor, hoveredEntity]);

  const graphConfig = useMemo(() => ({
    nodeRelSize: 6,
    nodeVal: (node: GraphNode) => (node as NetworkNode).val ?? 1,
    nodeLabel: (node: GraphNode) => (node as NetworkNode).name ?? '',
    nodeColor: (node: GraphNode) => (node as NetworkNode).color ?? '#000000',
    linkColor: (link: GraphLink) => (link as NetworkLink).color ?? '#000000',
    linkWidth: 2,
    linkDirectionalParticles: (link: GraphLink) => 
      highlightLinks.has(link as NetworkLink) ? 4 : 1,
    linkDirectionalParticleWidth: 4,
    linkDirectionalParticleSpeed: 0.002,
    d3Force: (d3: ForceGraphInstance) => {
      const linkForce = d3.force('link');
      const chargeForce = d3.force('charge');
      const centerForce = d3.force('center');
      const collisionForce = d3.force('collision');

      if (linkForce?.strength) linkForce.strength(0.3);
      if (chargeForce?.strength) chargeForce.strength(-120);
      if (centerForce?.strength) centerForce.strength(0.1);
      if (collisionForce?.radius) {
        collisionForce.radius((node: { val: number }) => node.val * 2);
      }
    },
    linkOpacity: 0.6,
    nodeOpacity: 1,
  }), [highlightLinks]);


  const node3DObject = useCallback((node: NetworkNode) => {
    return createNode3DObject(node);
  }, []);

  // Type guard to handle the different methods between 2D and 3D
  const activeRef = useMemo(() => {
    return is3D ? fg3DRef : fg2DRef;
  }, [is3D]);

  useEffect(() => {
    const fg = activeRef.current;
    return () => {
      if (fg) {
        fg.pauseAnimation();
      }
    };
  }, [activeRef]);

  useEffect(() => {
    const fg = activeRef.current;
    
    const handleVisibilityChange = () => {
      if (document.hidden && fg) {
        fg.pauseAnimation();
      } else if (fg) {
        fg.resumeAnimation();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeRef]);

  // Create a wrapper function with the correct type
  const handleNodeHover = useCallback((node: ForceGraphNodeObject | null) => {
    rawHandleNodeHover(node as NetworkNode | null);
  }, [rawHandleNodeHover]);

  const handleNodeDragEnd = useCallback((node: ForceGraphNodeObject) => {
    if (node) {
      node.fx = node.x;
      node.fy = node.y;
      if ('fz' in node && 'z' in node) {
        node.fz = node.z;
      }
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full absolute inset-0"
      style={{ minHeight: '100%', minWidth: '100%' }}
    >
      <NetworkFilters 
        hoveredEntity={hoveredEntity}
        is3D={is3D}
        setIs3D={setIs3D}
      />

      <div className="w-full h-full">
        {dimensions && (
          is3D ? (
            <ForceGraph3D<GraphNode, GraphLink>
              ref={fg3DRef}
              graphData={graphData}
              width={dimensions.width}
              height={dimensions.height}
              {...graphConfig}
              nodeThreeObject={(node: GraphNode) => node3DObject(node as NetworkNode)}
              onNodeClick={handleNodeClick}
              enableNodeDrag={isStabilized}
              cooldownTicks={100}
              onEngineStop={() => {
                if (activeRef.current && !isStabilized) {
                  activeRef.current.zoomToFit(400, 50);
                  setIsStabilized(true);
                }
              }}
              onNodeHover={handleNodeHover}
              linkCurvature={0}
              cooldownTime={2000}
              backgroundColor="#ffffff00"
              enablePointerInteraction={true}
              onNodeDragEnd={handleNodeDragEnd}
            />
          ) : (
            <ForceGraph2D<GraphNode, GraphLink>
              ref={fg2DRef}
              graphData={graphData}
              width={dimensions.width}
              height={dimensions.height}
              {...graphConfig}
              nodeCanvasObject={nodeCanvasObject}
              onNodeClick={handleNodeClick}
              enableNodeDrag={isStabilized}
              minZoom={0.5}
              maxZoom={4}
              cooldownTicks={100}
              onEngineStop={() => {
                if (activeRef.current && !isStabilized) {
                  activeRef.current.zoomToFit(400, 50);
                  setIsStabilized(true);
                }
              }}
              onNodeHover={handleNodeHover}
              linkCurvature={0}
              cooldownTime={2000}
              backgroundColor="#ffffff00"
              enablePointerInteraction={true}
              onNodeDragEnd={handleNodeDragEnd}
            />
          )
        )}
      </div>
      
      {selectedEntityId && (
        <EntitySheet
          entityId={selectedEntityId as `${string}-${string}-${string}-${string}-${string}`}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </div>
  );
} 
