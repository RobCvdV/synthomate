import type { Node } from "@xyflow/react";
import { Id, ValueSource } from "@/types";

export type SliderData = {
  id: Id;
  type: "slider";
  value: ValueSource;
  min: number;
  max: number;
};
export type SliderNodeType = Node<SliderData, "slider">;
