import { StateCreator } from "zustand";
import { WaveGeneratorData } from "@/domain/WaveGenerator";
import { getPrettyJson } from "@/utils/GetPrettyJson";
import { AppNode, AppState } from "./types";

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
          const data = { ...node.data, ...partial } as SynthData;
          console.log("updateSynthNode, data:", getPrettyJson(data));
          return { ...node, data } as AppNode;
        }),
      };
    }),
});
