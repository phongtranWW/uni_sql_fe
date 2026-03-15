import { useAppDispatch, useAppSelector } from "@/app/hook";
import edgeTypes from "@/data/edge-types";
import nodeTypes from "@/data/node-types";
import { REF_OPERATOR } from "@/features/project/schemas/ref";
import {
  selectDatabaseRefs,
  selectDatabaseTables,
} from "@/features/project/selectors";
import {
  addRef,
  clearSelectedRefs,
  clearSelectedTables,
  setRefsSelected,
  setTablesSelected,
} from "@/features/project/slices/database";
import {
  Background,
  ConnectionLineType,
  ConnectionMode,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import { useCallback, useEffect } from "react";

const Board = () => {
  const tables = useAppSelector(selectDatabaseTables);
  const refs = useAppSelector(selectDatabaseRefs);
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
          selected: ref.isSelected,
        }) as Edge,
    );
    setEdges(newEdges);
  }, [refs, setEdges]);

  const handleSelectionEnd = useCallback(() => {
    const selectedNodes = nodes.filter((n) => n.selected);
    const selectedTableNames = selectedNodes.map((n) => n.id);
    dispatch(setTablesSelected({ name: selectedTableNames, value: true }));

    const selectedEdges = edges.filter((e) => e.selected);
    const selectedRefNames = selectedEdges.map((e) => e.id);
    dispatch(setRefsSelected({ name: selectedRefNames, value: true }));
  }, [dispatch, nodes, edges]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      dispatch(clearSelectedTables());
      dispatch(setTablesSelected({ name: [node.id], value: true }));
    },
    [dispatch],
  );

  const handleEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      dispatch(clearSelectedRefs());
      dispatch(setRefsSelected({ name: [edge.id], value: true }));
    },
    [dispatch],
  );

  const handlePaneClick = useCallback(() => {
    dispatch(clearSelectedTables());
    dispatch(clearSelectedRefs());
    setNodes((prev) => prev.map((n) => ({ ...n, selected: false })));
    setEdges((prev) => prev.map((e) => ({ ...e, selected: false })));
  }, [dispatch, setNodes, setEdges]);

  const handleNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      dispatch(clearSelectedTables());
      dispatch(setTablesSelected({ name: [node.id], value: false }));
    },
    [dispatch],
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (
        !connection.source ||
        !connection.target ||
        !connection.sourceHandle ||
        !connection.targetHandle
      )
        return;

      const refName = `fk_${connection.source}_${connection.target}`;

      dispatch(
        addRef({
          name: refName,
          endpoints: [
            {
              tableName: connection.source,
              fieldName: connection.sourceHandle,
            },
            {
              tableName: connection.target,
              fieldName: connection.targetHandle,
            },
          ],
          operator: REF_OPERATOR.ONE_TO_MANY,
        }),
      );
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
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        onNodeDragStop={handleNodeDragStop}
        onConnect={handleConnect}
      >
        <Background />
      </ReactFlow>
    </>
  );
};

export default Board;
