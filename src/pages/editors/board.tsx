import { useAppSelector } from "@/app/hook";
import type { RootState } from "@/app/store";
import edgeTypes from "@/data/edge-types";
import nodeTypes from "@/data/node-types";
import {
  Background,
  ConnectionLineType,
  ConnectionMode,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from "@xyflow/react";
import { useEffect } from "react";

const Board = () => {
  const tables = useAppSelector((state: RootState) => state.database.tables);
  const refs = useAppSelector((state: RootState) => state.database.refs);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    const mappedNodes: Node[] = tables.map((table, index) => ({
      id: table.id,
      type: "tableNode",
      position: {
        x: index * 250,
        y: 100,
      },
      data: {
        id: table.id,
        name: table.name,
        fields: table.fields,
        alias: table.alias,
        headerColor: table.headerColor,
      },
    }));

    setNodes(mappedNodes);
  }, [tables, setNodes]);

  useEffect(() => {
    const newEdges: Edge[] = refs.map(
      (ref) =>
        ({
          id: ref.id,
          source: ref.endpoints[0].tableId,
          sourceHandle: ref.endpoints[0].fieldId,
          target: ref.endpoints[1].tableId,
          targetHandle: ref.endpoints[1].fieldId,
          type: "refEdge",
          label: ref.name,
          data: {
            id: ref.id,
            name: ref.name,
            endpoints: ref.endpoints,
          },
        }) as Edge,
    );
    setEdges(newEdges);
  }, [refs, setEdges]);

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
        selectionOnDrag={true}
        panOnDrag={[1, 2]}
      >
        <Background />
      </ReactFlow>
    </>
  );
};

export default Board;
