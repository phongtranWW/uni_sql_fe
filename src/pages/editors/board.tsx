import { useAppDispatch, useAppSelector } from "@/app/hook";
import type { RootState } from "@/app/store";
import edgeTypes from "@/data/edge-types";
import nodeTypes from "@/data/node-types";
import { setSelectedTables } from "@/features/database/slice";
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
import { useCallback, useEffect } from "react";

const Board = () => {
  const tables = useAppSelector((state: RootState) => state.database.tables);
  const refs = useAppSelector((state: RootState) => state.database.refs);
  const dispatch = useAppDispatch();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    setNodes((prevNodes) => {
      return tables.map((table, index) => {
        const existingNode = prevNodes.find((n) => n.id === table.name);
        return {
          id: table.name,
          type: "tableNode",
          position: existingNode?.position ?? { x: index * 250, y: 100 },
          selected: table.isSelected,
          data: {
            name: table.name,
            fields: table.fields,
            alias: table.alias,
            headerColor: table.headerColor,
          },
        };
      });
    });
  }, [tables, setNodes]);

  useEffect(() => {
    const newEdges: Edge[] = refs.map(
      (ref) =>
        ({
          id: ref.name,
          source: ref.endpoints[0].tableName,
          sourceHandle: ref.endpoints[0].fieldName,
          target: ref.endpoints[1].tableName,
          targetHandle: ref.endpoints[1].fieldName,
          type: "refEdge",
          label: ref.name,
          data: {
            name: ref.name,
            endpoints: ref.endpoints,
            operator: ref.operator,
          },
        }) as Edge,
    );
    setEdges(newEdges);
  }, [refs, setEdges]);

  const handleSelectionEnd = useCallback(() => {
    const selectedNodes = nodes.filter((n) => n.selected);
    const selectedTableNames = selectedNodes.map((n) => n.id);
    dispatch(setSelectedTables(selectedTableNames));
  }, [dispatch, nodes]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      dispatch(setSelectedTables([node.id]));
      setNodes((prev) =>
        prev.map((n) => ({ ...n, selected: n.id === node.id })),
      );
    },
    [dispatch, setNodes],
  );

  const handlePaneClick = useCallback(() => {
    dispatch(setSelectedTables([]));
    setNodes((prev) => prev.map((n) => ({ ...n, selected: false })));
  }, [dispatch, setNodes]);

  const handleNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      dispatch(setSelectedTables([node.id]));
    },
    [dispatch],
  );

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
        onSelectionEnd={handleSelectionEnd}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onNodeDragStop={handleNodeDragStop}
      >
        <Background />
      </ReactFlow>
    </>
  );
};

export default Board;
