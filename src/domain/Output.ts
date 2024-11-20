import type { Node } from "@xyflow/react";
import { Id } from "@/types/Id";
import { ElemNode } from "@elemaudio/core";

export type OutputData = { id: Id } & {
  volume: number; // ValueSource;
  left?: ElemNode;
  right?: ElemNode;
  mute: boolean;
};
export type OutputNodeType = Node<OutputData, "output">;
