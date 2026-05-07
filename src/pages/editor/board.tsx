import { useAppSelector } from "@/app/hook";
import { ResizablePanel } from "@/components/ui/resizable";
import Marker from "@/components/custom/marker";
import edgeTypes from "@/data/edge-types";
import nodeTypes from "@/data/node-types";
import {
  selectIsOwner,
  selectRefs,
  selectTables,
} from "@/features/project/selectors/project.selector";
import { useFlowEdges } from "@/hooks/use-flow-edges";
import { useFlowHandlers } from "@/hooks/use-flow-handlers";
import { useFlowNodes } from "@/hooks/use-flow-nodes";
import {
  Background,
  ConnectionLineType,
  ConnectionMode,
  Controls,
  MiniMap,
  ReactFlow,
  useOnSelectionChange,
  useReactFlow,
} from "@xyflow/react";

const AutoFocusHandler = () => {
  const autoFocus = useAppSelector(
    (state) => state.editorSettings.show.autoFocus,
  );
  const { fitView, getNode } = useReactFlow();

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      if (!autoFocus) return;

      const nodesToFit = [...nodes];
      
      // Include source and target nodes for any selected edges
      if (edges.length > 0) {
        edges.forEach((edge) => {
          const sourceNode = getNode(edge.source);
          const targetNode = getNode(edge.target);
          if (sourceNode && !nodesToFit.some(n => n.id === sourceNode.id)) {
            nodesToFit.push(sourceNode);
          }
          if (targetNode && !nodesToFit.some(n => n.id === targetNode.id)) {
            nodesToFit.push(targetNode);
          }
        });
      }

      if (nodesToFit.length > 0) {
        requestAnimationFrame(() => {
          void fitView({ nodes: nodesToFit, duration: 800, padding: 0.2 });
        });
      } else {
        requestAnimationFrame(() => {
          void fitView({ duration: 800 });
        });
      }
    },
  });

  return null;
};

const Board = () => {
  const tables = useAppSelector(selectTables);
  const refs = useAppSelector(selectRefs);
  const isOwner = useAppSelector(selectIsOwner);
  const { minimap, control } = useAppSelector(
    (state) => state.editorSettings.show,
  );
  const showIssues = useAppSelector(
    (state) => state.editorSettings.show.issuePanel,
  );

  const { nodes, onNodesChange } = useFlowNodes(tables);
  const { edges, onEdgesChange } = useFlowEdges(refs);
  const {
    handleSelectionEnd,
    handleNodesChange,
    handleNodeClick,
    handleEdgeClick,
    handlePaneClick,
    handleConnect,
  } = useFlowHandlers({
    nodes,
    edges,
    tables,
    onNodesChange,
  });

  return (
    <ResizablePanel defaultSize={showIssues ? "55%" : "75%"}>
      <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={handleNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      connectionMode={ConnectionMode.Loose}
      connectionLineType={ConnectionLineType.Straight}
      fitView
      selectionOnDrag
      panOnDrag={[1, 2]}
      onSelectionEnd={handleSelectionEnd}
      onNodeClick={handleNodeClick}
      onEdgeClick={handleEdgeClick}
      onPaneClick={handlePaneClick}
      onConnect={isOwner === false ? undefined : handleConnect}
    >
      <Marker />
      <Background />
      {minimap && <MiniMap />}
      {control && <Controls />}
      <AutoFocusHandler />
    </ReactFlow>
    </ResizablePanel>
  );
};

export default Board;
