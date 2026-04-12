import type { Ref } from "@/features/project/schemas/ref.schema";
import { useEdgesState, type Edge } from "@xyflow/react";
import { useEffect } from "react";

export const useFlowEdges = (refs: Ref[]) => {
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    setEdges((prevEdges) =>
      refs.map((ref) => {
        const existing = prevEdges.find((e) => e.id === ref.name);
        return {
          ...existing,
          id: ref.name,
          source: ref.endpoints[0].tableName,
          sourceHandle: ref.endpoints[0].fieldName,
          target: ref.endpoints[1].tableName,
          targetHandle: ref.endpoints[1].fieldName,
          type: "refEdge",
          label: ref.name,
          selected: ref.isSelected,
          data: {
            name: ref.name,
            endpoints: ref.endpoints,
            operator: ref.operator,
          },
        } as Edge;
      }),
    );
  }, [refs, setEdges]);

  return { edges, setEdges, onEdgesChange };
};
