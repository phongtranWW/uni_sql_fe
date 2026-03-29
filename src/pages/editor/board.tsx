import { useAppSelector } from "@/app/hook";
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
  ReactFlow,
} from "@xyflow/react";

const Board = () => {
  const tables = useAppSelector(selectTables);
  const refs = useAppSelector(selectRefs);

  const { nodes, setNodes, onNodesChange } = useFlowNodes(tables);
  const { edges, setEdges, onEdgesChange } = useFlowEdges(refs);
  const {
    handleSelectionEnd,
    handleNodeClick,
    handleEdgeClick,
    handlePaneClick,
    handleConnect,
    handleNodesDelete,
    handleEdgesDelete,
  } = useFlowHandlers({ nodes, edges, setNodes, setEdges });

  return (
    <>
      <svg style={{ position: "absolute", width: 0, height: 0, zIndex: -1 }}>
        <defs>
          <marker
            id="many-marker"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="6"
            markerUnits="strokeWidth"
            orient="auto-start-reverse"
          >
            <line x1="0" y1="6" x2="8" y2="2" stroke="currentColor" />
            <line x1="0" y1="6" x2="8" y2="6" stroke="currentColor" />
            <line x1="0" y1="6" x2="8" y2="10" stroke="currentColor" />
          </marker>
        </defs>
      </svg>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
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
        onNodesDelete={handleNodesDelete}
        onEdgesDelete={handleEdgesDelete}
      >
        <Background />
      </ReactFlow>
    </>
  );
};

export default Board;
