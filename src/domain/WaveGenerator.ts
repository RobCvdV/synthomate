import type { Node } from "@xyflow/react";
import { ValueSource } from "@/types/ValueSource";
import { Id } from "@/types/Id";
import { ElemNode } from "@elemaudio/core";

export const WaveTypeDict = {
  sine: "Sine",
  square: "Square",
  saw: "Saw",
  triangle: "Triangle",
  metro: "Metronome",
  blepsquare: "Blep Square",
  blepsaw: "Blep Saw",
  bleptriangle: "Blep Triangle",
  noise: "Noise",
} as const;
export const AllWaveTypes = Object.keys(
  WaveTypeDict,
) as (keyof typeof WaveTypeDict)[];
export type WaveType = (typeof AllWaveTypes)[number];

export const WaveTypeNames = Object.entries(WaveTypeDict).map(
  ([key, value]) => {
    return { label: value, value: key as WaveType };
  },
) as { label: string; value: WaveType }[];
export const WaveTypes = AllWaveTypes.reduce<Record<WaveType, WaveType>>(
  (acc, type) => {
    acc[type] = type;
    return acc;
  },
  {} as Record<WaveType, WaveType>,
);

export type WaveGeneratorData = { id: Id } & {
  waveGenerator: WaveType;
  frequency: ValueSource;
  amplitude: ValueSource;
};
export type WaveGeneratorNodeType = Node<WaveGeneratorData, "waveGenerator">;
