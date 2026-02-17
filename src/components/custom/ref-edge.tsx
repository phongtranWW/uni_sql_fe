import type { Endpoint } from "@/features/database/schemas/endpoint";
import { getEdgeParams } from "@/utils/get-edge-params";
import {
  BaseEdge,
  getSmoothStepPath,
  useInternalNode,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";

type RefEdge = Edge<
  {
    id: string;
    name: string;
    endpoints: Endpoint[];
  },
  "ref"
>;

export function RefEdge({
  id,
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

  return (
    <BaseEdge
      id={id}
      path={path}
      markerEnd={
        data?.endpoints[1].relation === "1"
          ? "url(#one-marker)"
          : "url(#many-marker)"
      }
      markerStart={
        data?.endpoints[0].relation === "1"
          ? "url(#one-marker)"
          : "url(#many-marker)"
      }
    />
  );
}
