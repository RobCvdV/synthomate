import { StateCreator } from "zustand";
import { AppNode, AppState } from "./types";
import { WaveGeneratorData } from "../domain/WaveGenerator";

type SynthData = WaveGeneratorData;

export type SynthSlice = {
  // addSynthNode: (node: SynthData) => void;
  updateSynthNode: (partial: Partial<SynthData>) => void;
};

export const createSynthSlice: StateCreator<AppState, [], [], SynthSlice> = (
  set,
) => ({
  // addSynthNode: (node) => set((state) => ({ data: [...state.nodes, node] })),
  updateSynthNode: ({ id, ...partial }) =>
    set((state) => {
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.type === "colorChooser" || node.id !== id) {
            return node;
          }
          console.log("updateSynthNode", id, partial, node.data);
          const data = { ...node.data, ...partial } as SynthData;
          return { ...node, data } as AppNode;
        }),
      };
    }),
});
