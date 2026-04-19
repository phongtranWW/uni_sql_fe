import type { Table } from "@/features/project/schemas/table-schema";
import { useNodesState, type Node } from "@xyflow/react";
import { useEffect } from "react";

export const useFlowNodes = (tables: Table[]) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);

  useEffect(() => {
    setNodes(
      tables.map((table) => ({
        id: table.name,
        type: "tableNode",
        position: { x: table.position.x, y: table.position.y },
        selected: table.isSelected,
        data: {
          name: table.name,
          fields: table.fields,
          alias: table.alias,
          headerColor: table.headerColor,
        },
      })),
    );
  }, [tables, setNodes]);

  return { nodes, setNodes, onNodesChange };
};
