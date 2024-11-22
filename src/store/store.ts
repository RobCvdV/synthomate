import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AppState } from "./types";
import { createFlowSlice } from "./flowSlice";
import { createSynthSlice } from "./synthSlice";

const middleware = (f: StateCreator<AppState>) =>
  devtools(persist(f, { name: "synthomate-store" }));

// this is our useStore hook that we can use in our components to get parts of the store and call actions
export const useStore = create<AppState>()(
  middleware((...args) => ({
    ...createFlowSlice(...args),
    ...createSynthSlice(...args),
  })),
);

export const getState = useStore.getState;

export const getNodesById = (...ids: string[]) => {
  return getState().nodes.filter((n) => ids.includes(n.id));
};
