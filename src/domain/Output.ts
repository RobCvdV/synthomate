import type { Node } from "@xyflow/react";
import { Id } from "@/types";

export type OutputData = {
  id: Id;
  type: "output";
  volume: number; // ValueSource;
  left?: string[];
  right?: string[];
  mute: boolean;
};
export type OutputNodeType = Node<OutputData, "output">;
