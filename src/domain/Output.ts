import type { Node } from "@xyflow/react";
import { ValueSource } from "@/types/ValueSource";
import { Id } from "@/types/Id";

export enum OutputType {
  left,
  right,
}

export type OutputData = { id: Id } & {
  output: OutputType;
  volume: ValueSource;
  mute: boolean;
};
export type OutputNodeType = Node<OutputData, "output">;
