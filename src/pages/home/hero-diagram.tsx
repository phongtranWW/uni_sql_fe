import edgeTypes from "@/data/edge-types";
import nodeTypes from "@/data/node-types";
import { useTheme } from "next-themes";
import { useMemo, useCallback } from "react";
import {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  ConnectionMode,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useStoreApi,
  type Node,
} from "@xyflow/react";
import { createHeroEdges, createHeroNodes } from "@/constants/hero";

const DiagramInner = () => {
  const { resolvedTheme } = useTheme();
  const initialNodes = useMemo(() => createHeroNodes(), []);
  const initialEdges = useMemo(() => createHeroEdges(), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const store = useStoreApi();
  const dotColor =
    resolvedTheme === "dark" ? "oklch(0.705 0.213 47.604)" : "#67a1cf";

  const handleNodeDrag = useCallback(
    (_: React.MouseEvent, draggedNode: Node) => {
      const { width, height, transform } = store.getState();
      const [tx, ty, zoom] = transform;

      const xMin = -tx / zoom;
      const yMin = -ty / zoom;
      const xMax = (width - tx) / zoom;
      const yMax = (height - ty) / zoom;

      const nodeWidth = draggedNode.measured?.width ?? draggedNode.width ?? 200;
      const nodeHeight =
        draggedNode.measured?.height ?? draggedNode.height ?? 100;

      const clampedX = Math.min(
        Math.max(draggedNode.position.x, xMin),
        xMax - nodeWidth,
      );
      const clampedY = Math.min(
        Math.max(draggedNode.position.y, yMin),
        yMax - nodeHeight,
      );

      if (
        clampedX !== draggedNode.position.x ||
        clampedY !== draggedNode.position.y
      ) {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === draggedNode.id
              ? { ...n, position: { x: clampedX, y: clampedY } }
              : n,
          ),
        );
      }
    },
    [store, setNodes],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      connectionMode={ConnectionMode.Loose}
      onNodeDrag={handleNodeDrag}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      proOptions={{ hideAttribution: true }}
      connectionLineType={ConnectionLineType.Straight}
      fitViewOptions={{ padding: 0.15 }}
      nodesDraggable
      nodesConnectable={false}
      elementsSelectable={false}
      panOnDrag={false}
      zoomOnScroll={false}
      zoomOnPinch={false}
      zoomOnDoubleClick={false}
      preventScrolling={false}
      autoPanOnNodeDrag={false}
      className="[&_.react-flow__edge]:text-muted-foreground"
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={33}
        size={1.3}
        color={dotColor}
      />
    </ReactFlow>
  );
};

const HeroDiagram = () => {
  return (
    <div className="h-[520px] w-full min-w-0 rounded-3xl border border-border bg-muted overflow-hidden">
      <DiagramInner />
    </div>
  );
};

export default HeroDiagram;
