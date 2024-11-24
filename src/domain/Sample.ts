import type { Node } from "@xyflow/react";
import { ValueSource } from "@/types/ValueSource";
import { Id } from "@/types/Id";

export type SampleData = {
  id: Id;
  type: "sample";
  path: string;
  trigger: ValueSource | string;
  frequency: ValueSource;
  amplitude: ValueSource;
  frequencyIn?: string[];
  amplitudeIn?: string[];
};
export type SampleNodeType = Node<SampleData, "sample">;
