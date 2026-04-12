import type { Table } from "@/features/project/schemas/table-schema";
import { useNodesState, type Node } from "@xyflow/react";
import { useEffect } from "react";

export const useFlowNodes = (tables: Table[]) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);

  useEffect(() => {
    setNodes((prevNodes) =>
      tables.map((table, index) => {
        const existingNode = prevNodes.find((n) => n.id === table.name);
        const defaultPosition = { x: index * 250, y: 100 };

        if (!existingNode) {
          return {
            id: table.name,
            type: "tableNode",
            position: defaultPosition,
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
          position: existingNode.position ?? defaultPosition,
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
