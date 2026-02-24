import type { Endpoint } from "@/features/database/schemas/endpoint";
import type { RefOperator } from "@/features/database/schemas/ref";
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

  return <BaseEdge id={data?.name} path={path} />;
}
