import { DragEventHandler } from "react";
import { AppNodeTypes } from "@/store/types";
import { AnyObject } from "@/types/AnyObject";
import { create } from "zustand";

// create a store using zustand to handle all the drag n drop state

type DndContextType = {
  action?: "drag" | "drop";
  type?: AppNodeTypes;
  data?: AnyObject;
  setProps: (type: AppNodeTypes, data?: AnyObject) => void;
  onDrop: DragEventHandler<HTMLDivElement>;
};

export const useDnd = create<DndContextType>()((set, get) => ({
  action: undefined,
  type: undefined,
  data: undefined,
  setProps: (type, data) => {
    set({ action: "drag", type, data });
  },
  onDrop: (e) => {
    e.preventDefault();
    const { type, data } = get();
    if (!type) {
      return;
    }
    set({ action: "drop" });
    console.log("drop", type, data);
  },
}));
