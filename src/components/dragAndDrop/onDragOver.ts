import { DragEventHandler, useCallback } from "react";

export const useOnDragOver = (): DragEventHandler<HTMLDivElement> => {
  return useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);
};
