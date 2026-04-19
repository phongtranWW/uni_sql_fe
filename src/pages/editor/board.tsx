import { useAppSelector } from "@/app/hook";
import Marker from "@/components/custom/marker";
import edgeTypes from "@/data/edge-types";
import nodeTypes from "@/data/node-types";
import {
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
} from "@xyflow/react";

const Board = () => {
  const tables = useAppSelector(selectTables);
  const refs = useAppSelector(selectRefs);
  const { minimap, control } = useAppSelector(
    (state) => state.editorSettings.show,
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
      onConnect={handleConnect}
    >
      <Marker />
      <Background />
      {minimap && <MiniMap />}
      {control && <Controls />}
    </ReactFlow>
  );
};

export default Board;
