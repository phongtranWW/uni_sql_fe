import { useAppDispatch } from "@/app/hook";
import { RefCreateSchema } from "@/features/project/schemas/ref.schema";
import { type Table } from "@/features/project/schemas/table-schema";
import {
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
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

interface Params {
  nodes: Node[];
  edges: Edge[];
  tables: Table[];
  onNodesChange: (changes: NodeChange[]) => void;
}

export const useFlowHandlers = ({
  nodes,
  edges,
  tables,
  onNodesChange,
}: Params) => {
  const dispatch = useAppDispatch();

  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const tablesRef = useRef(tables);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);
  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);
  useEffect(() => {
    tablesRef.current = tables;
  }, [tables]);

  const handleSelectionEnd = useCallback(() => {
    dispatch(tablesSelectionCleared());
    dispatch(refsSelectionCleared());
    const selectedTables = nodesRef.current
      .filter((n) => n.selected)
      .map((n) => n.id);
    const selectedRefs = edgesRef.current
      .filter((e) => e.selected)
      .map((e) => e.id);
    if (selectedTables.length)
      dispatch(tablesSelected({ name: selectedTables, value: true }));
    if (selectedRefs.length)
      dispatch(refsSelected({ name: selectedRefs, value: true }));
  }, [dispatch]);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      for (const ch of changes) {
        if (ch.type !== "position" || ch.dragging !== false || !ch.position)
          continue;
        const table = tablesRef.current.find((t) => t.name === ch.id);
        if (
          table &&
          table.position.x === ch.position.x &&
          table.position.y === ch.position.y
        )
          continue;
        dispatch(
          tablePartial({ tableName: ch.id, data: { position: ch.position } }),
        );
      }
    },
    [onNodesChange, dispatch],
  );

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
  }, [dispatch]);

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (
        !connection.source ||
        !connection.target ||
        !connection.sourceHandle ||
        !connection.targetHandle
      )
        return;

      const alreadyExists = edgesRef.current.some(
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
          { tableName: connection.source, fieldName: connection.sourceHandle },
          { tableName: connection.target, fieldName: connection.targetHandle },
        ],
      });

      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return;
      }

      dispatch(refCreated(result.data));
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
  };
};
