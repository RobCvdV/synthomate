import { DragEventHandler, useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { useDnd } from "./DndContext";
import { useStore } from "@/store/store";
import { v4 } from "uuid";
import { AppNode } from "@/store/types";

// Dnd stuff
let id = "";
const getId = () => {
  id = v4();
  return `dndnode_${id}`;
};

export const useOnDrop = (): DragEventHandler<HTMLDivElement> => {
  const { screenToFlowPosition } = useReactFlow();
  const { type, data } = useDnd();
  const { addNodes } = useStore();

  return useCallback(
    (event) => {
      event.preventDefault();

      // check if the dropped element is valid
      if (type && type in ["colorChooser", "waveGenerator"]) {
        return;
      }

      // project was renamed to screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const id = getId();
      const newNode: AppNode = {
        id,
        type,
        position,
        data: { id, ...data } as any,
      };

      addNodes([newNode]);
    },
    [screenToFlowPosition, type, data, addNodes],
  );
};
