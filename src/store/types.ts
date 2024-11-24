import { SynthSlice } from "./synthSlice";
import { FlowSlice } from "./flowSlice";
import { WaveGeneratorNodeType } from "@/domain/WaveGenerator";
import { OutputNodeType } from "@/domain/Output";
import { SliderNodeType } from "@/domain/Slider";
import { SampleNodeType } from "@/domain";

export type AppNode =
  | WaveGeneratorNodeType
  | OutputNodeType
  | SliderNodeType
  | SampleNodeType;
export type AppNodeTypes = AppNode["type"];

export type AppState = FlowSlice & SynthSlice;
