import type { Table } from "@/features/project/schemas/table-schema";
import { useNodesState, type Node } from "@xyflow/react";
import { useEffect } from "react";

export const useFlowNodes = (tables: Table[]) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);

  useEffect(() => {
    setNodes((prevNodes) =>
      tables.map((table) => {
        const existingNode = prevNodes.find((n) => n.id === table.name);
        const fromStore = table.position;

        if (!existingNode) {
          return {
            id: table.name,
            type: "tableNode",
            position: { x: fromStore.x, y: fromStore.y },
            selected: table.isSelected,
            data: {
              name: table.name,
              fields: table.fields,
              alias: table.alias,
              headerColor: table.headerColor,
            },
          };
        }

        const { dragging, ...preserved } = existingNode;
        void dragging;
        return {
          ...preserved,
          id: table.name,
          type: "tableNode",
          position: existingNode.dragging
            ? existingNode.position
            : { x: fromStore.x, y: fromStore.y },
          selected: table.isSelected,
          data: {
            name: table.name,
            fields: table.fields,
            alias: table.alias,
            headerColor: table.headerColor,
          },
        };
      }),
    );
  }, [tables, setNodes]);

  return { nodes, setNodes, onNodesChange };
};
