import { useAppDispatch } from "@/app/hook";
import { REF_OPERATOR } from "@/features/project/schemas/ref.schema";
import {
  refCreated,
  refsSelected,
  refsSelectionCleared,
  tablesSelected,
  tablesSelectionCleared,
} from "@/features/project/slices/project.slice";
import { nanoid } from "@reduxjs/toolkit";
import { type Connection, type Edge, type Node } from "@xyflow/react";
import { useCallback } from "react";

interface Params {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

export const useFlowHandlers = ({
  nodes,
  edges,
  setNodes,
  setEdges,
}: Params) => {
  const dispatch = useAppDispatch();
  const syncSelection = useCallback(() => {
    dispatch(tablesSelectionCleared());
    dispatch(refsSelectionCleared());
    const selectedTables = nodes.filter((n) => n.selected).map((n) => n.id);
    const selectedRefs = edges.filter((e) => e.selected).map((e) => e.id);
    if (selectedTables.length)
      dispatch(tablesSelected({ name: selectedTables, value: true }));
    if (selectedRefs.length)
      dispatch(refsSelected({ name: selectedRefs, value: true }));
  }, [dispatch, nodes, edges]);

  const handleSelectionEnd = useCallback(() => {
    syncSelection();
  }, [syncSelection]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      dispatch(tablesSelectionCleared());
      dispatch(refsSelectionCleared());
      dispatch(tablesSelected({ name: [node.id], value: true }));
    },
    [dispatch],
  );

  const handleEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      dispatch(refsSelectionCleared());
      dispatch(tablesSelectionCleared());
      dispatch(refsSelected({ name: [edge.id], value: true }));
    },
    [dispatch],
  );

  const handlePaneClick = useCallback(() => {
    dispatch(tablesSelectionCleared());
    dispatch(refsSelectionCleared());
    setNodes((prev) => prev.map((n) => ({ ...n, selected: false })));
    setEdges((prev) => prev.map((e) => ({ ...e, selected: false })));
  }, [dispatch, setNodes, setEdges]);

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (
        !connection.source ||
        !connection.target ||
        !connection.sourceHandle ||
        !connection.targetHandle
      )
        return;
      dispatch(
        refCreated({
          name: `fk_${connection.source}_${connection.target}_${nanoid(4)}`,
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
          isSelected: false,
        }),
      );
    },
    [dispatch],
  );

  return {
    handleSelectionEnd,
    handleNodeClick,
    handleEdgeClick,
    handlePaneClick,
    handleConnect,
  };
};
