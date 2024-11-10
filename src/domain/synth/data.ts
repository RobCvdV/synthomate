import { AudioNodeParams, AudioNodeType } from "@/domain/synth/types";
import { Id } from "@/types/Id";

export type SynthData<N extends AudioNodeType> = {
  id: Id;
  name?: string;
  type: N;
  params: AudioNodeParams<N>;
};
