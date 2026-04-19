import { useAppDispatch } from "@/app/hook";
import { RefCreateSchema } from "@/features/project/schemas/ref.schema";
import { TablePartSchema, type Table } from "@/features/project/schemas/table-schema";
import {
  elementsDeleted,
  refCreated,
  refsSelected,
  refsSelectionCleared,
  tablePartial,
  tablesSelected,
  tablesSelectionCleared,
} from "@/features/project/slices/project.slice";
import { nanoidAlpabet } from "@/utils/nanoid-alpabet";
import {
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
} from "@xyflow/react";
import { useCallback } from "react";
import { toast } from "sonner";

interface Params {
  nodes: Node[];
  edges: Edge[];
  tables: Table[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onNodesChange: (changes: NodeChange[]) => void;
}

export const useFlowHandlers = ({
  nodes,
  edges,
  tables,
  setNodes,
  setEdges,
  onNodesChange,
}: Params) => {
  const dispatch = useAppDispatch();

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      for (const ch of changes) {
        if (ch.type !== "position" || ch.dragging !== false || !ch.position) {
          continue;
        }
        const table = tables.find((t) => t.name === ch.id);
        if (
          table &&
          table.position.x === ch.position.x &&
          table.position.y === ch.position.y
        ) {
          continue;
        }
        const parsed = TablePartSchema.safeParse({
          position: { x: ch.position.x, y: ch.position.y },
        });
        if (!parsed.success) continue;
        dispatch(tablePartial({ tableName: ch.id, data: parsed.data }));
      }
    },
    [onNodesChange, dispatch, tables],
  );
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
      const result = RefCreateSchema.safeParse({
        name: `fk_${connection.source}_${connection.target}_${nanoidAlpabet(3)}`,
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
      });
      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return;
      }
      dispatch(refCreated(result.data));
    },
    [dispatch, edges],
  );

  const handleNodesDelete = useCallback(
    (deletedNodes: Node[]) => {
      dispatch(
        elementsDeleted({
          tableNames: deletedNodes.map((n) => n.id),
          refNames: [],
        }),
      );
    },
    [dispatch],
  );

  const handleEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      dispatch(
        elementsDeleted({
          tableNames: [],
          refNames: deletedEdges.map((e) => e.id),
        }),
      );
    },
    [dispatch],
  );

  return {
    handleSelectionEnd,
    handleNodesChange,
    handleNodeClick,
    handleEdgeClick,
    handlePaneClick,
    handleConnect,
    handleNodesDelete,
    handleEdgesDelete,
  };
};
