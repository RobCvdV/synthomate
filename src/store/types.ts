import { BuiltInNode } from "@xyflow/react";
import { ColorNode } from "components/flow/ColorChooserNode";
import { SynthSlice } from "./synthSlice";
import { FlowSlice } from "./flowSlice";
import { WaveGeneratorNodeType } from "domain/WaveGenerator";

export type AppNode = WaveGeneratorNodeType | ColorNode;
export type AppNodeTypes = AppNode["type"];

export type AppState = FlowSlice & SynthSlice;
