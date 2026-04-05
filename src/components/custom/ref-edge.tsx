import type { Endpoint } from "@/features/project/schemas/endpoint.schema";
import type { RefOperator } from "@/features/project/schemas/ref.schema";
import { getEdgeParams } from "@/utils/get-edge-params";
import {
  BaseEdge,
  getSmoothStepPath,
  useInternalNode,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";

const getMarkers = (operator: RefOperator) => {
  switch (operator) {
    case "-":
      return {
        markerStart: "url(#one-marker-start)",
        markerEnd: "url(#one-marker-end)",
      };
    case ">":
      return {
        markerStart: "url(#one-marker-start)",
        markerEnd: "url(#many-marker-end)",
      };
    case "<":
      return {
        markerStart: "url(#many-marker-start)",
        markerEnd: "url(#one-marker-end)",
      };
    default:
      return {};
  }
};

type RefEdge = Edge<
  {
    name: string;
    endpoints: [Endpoint, Endpoint];
    operator: RefOperator;
  },
  "ref"
>;

export function RefEdge({
  source,
  target,
  sourceHandleId,
  targetHandleId,
  data,
}: EdgeProps<RefEdge>) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode || !sourceHandleId || !targetHandleId) {
    return null;
  }

  const { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition } =
    getEdgeParams(sourceNode, sourceHandleId, targetNode, targetHandleId);

  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { markerStart, markerEnd } = getMarkers(data?.operator ?? "-");

  return (
    <BaseEdge
      id={data?.name}
      path={path}
      markerStart={markerStart}
      markerEnd={markerEnd}
      style={{
        strokeDasharray: "8 2",
        animation: "dashdraw 0.5s linear infinite",
      }}
    />
  );
}
