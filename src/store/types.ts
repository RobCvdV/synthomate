import { SynthSlice } from "./synthSlice";
import { FlowSlice } from "./flowSlice";
import { WaveGeneratorNodeType } from "@/domain/WaveGenerator";
import { OutputNodeType } from "@/domain/Output";

export type AppNode = WaveGeneratorNodeType | OutputNodeType;
export type AppNodeTypes = AppNode["type"];

export type AppState = FlowSlice & SynthSlice;
