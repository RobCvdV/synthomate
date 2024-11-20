import { StateCreator } from "zustand";
import { WaveGeneratorData } from "@/domain/WaveGenerator";
import { AppNode, AppState } from "./types";
import { OutputData } from "@/domain/Output";

type SynthData = WaveGeneratorData | OutputData;

export type SynthSlice = {
  // addSynthNode: (node: SynthData) => void;
  updateSynthNode: <D extends SynthData = SynthData>(
    partial: Partial<D>,
  ) => void;
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
          const data = { ...node.data, ...partial } as SynthData;
          // console.log("updateSynthNode, data:", partial);
          return { ...node, data } as AppNode;
        }),
      };
    }),
});
