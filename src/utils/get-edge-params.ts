import { Position } from "@xyflow/react";

function getOffsetXHandle(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node: any,
  handlePosition: Position,
  handleId: string,
) {
  const handle = node.internals.handleBounds.source.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (h: any) => h.id === handleId,
  );

  return {
    offsetX: handle.x + (handlePosition === Position.Left ? 0 : handle.width),
    offsetY: handle.y + handle.height / 2,
  };
}

export function getEdgeParams(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source: any,
  sourceHandleId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target: any,
  targetHandleId: string,
) {
  const sourceCenterX =
    source.internals.positionAbsolute.x + source.measured.width / 2;
  const targetCenterX =
    target.internals.positionAbsolute.x + target.measured.width / 2;

  let sourcePosition, targetPosition;
  if (
    Math.abs(sourceCenterX - targetCenterX) >
    (source.measured.width + target.measured.width) / 2
  ) {
    sourcePosition =
      sourceCenterX > targetCenterX ? Position.Left : Position.Right;
    targetPosition =
      sourceCenterX > targetCenterX ? Position.Right : Position.Left;
  } else {
    sourcePosition =
      sourceCenterX > targetCenterX ? Position.Left : Position.Right;
    targetPosition =
      sourceCenterX > targetCenterX ? Position.Left : Position.Right;
  }

  const { offsetX: sourceOffsetX, offsetY: sourceOffsetY } = getOffsetXHandle(
    source,
    sourcePosition,
    sourceHandleId,
  );

  const { offsetX: targetOffsetX, offsetY: targetOffsetY } = getOffsetXHandle(
    target,
    targetPosition,
    targetHandleId,
  );

  return {
    sourceX: source.internals.positionAbsolute.x + sourceOffsetX,
    sourceY: source.internals.positionAbsolute.y + sourceOffsetY,
    targetX: target.internals.positionAbsolute.x + targetOffsetX,
    targetY: target.internals.positionAbsolute.y + targetOffsetY,
    sourcePosition,
    targetPosition,
  };
}
