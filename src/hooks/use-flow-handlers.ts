import { useAppDispatch } from "@/app/hook";
import { REF_OPERATOR } from "@/features/project/schemas/ref.schema";
import {
  refCreated,
  refsSelected,
  refsSelectionCleared,
  tablesSelected,
  tablesSelectionCleared,
} from "@/features/project/slices/project.slice";
import { nanoidAlpabet } from "@/utils/nanoid-alpabet";
import { type Connection, type Edge, type Node } from "@xyflow/react";
import { useCallback } from "react";
import { toast } from "sonner";

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

      const alreadyExists = edges.some(
        (e) =>
          (e.source === connection.source &&
            e.target === connection.target &&
            e.sourceHandle === connection.sourceHandle &&
            e.targetHandle === connection.targetHandle) ||
          (e.source === connection.target &&
            e.target === connection.source &&
            e.sourceHandle === connection.targetHandle &&
            e.targetHandle === connection.sourceHandle),
      );

      if (alreadyExists) {
        toast.error("A relationship between these two fields already exists.");
        return;
      }

      dispatch(
        refCreated({
          name: `fk_${connection.source}_${connection.target}_${nanoidAlpabet(4)}`,
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
    [dispatch, edges],
  );

  return {
    handleSelectionEnd,
    handleNodeClick,
    handleEdgeClick,
    handlePaneClick,
    handleConnect,
  };
};
