import { StateCreator } from "zustand";
import { AppNode, AppState } from "@/store/types";
import {
  OutputData,
  SampleData,
  SliderData,
  WaveGeneratorData,
} from "@/domain";

export type SynthData =
  | WaveGeneratorData
  | OutputData
  | SliderData
  | SampleData;
export type SynthType = SynthData["type"];

export type SynthSlice = {
  updateSynthNode: <D extends SynthData = SynthData>(
    partial: Partial<D>,
  ) => void;
};

export const createSynthSlice: StateCreator<AppState, [], [], SynthSlice> = (
  set,
) => ({
  updateSynthNode: ({ id, ...partial }) =>
    set((state) => {
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.id !== id) {
            return node;
          }
          const data = { ...node.data, ...partial } as SynthData;
          return { ...node, data } as AppNode;
        }),
      };
    }),
});
