import type { Node } from "@xyflow/react";
import { ValueSource } from "@/types/ValueSource";
import { Id } from "@/types/Id";

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
  pinknoise: "Pink Noise",
  phasor: "Phasor",
  syncphasor: "Sync Phasor",
  train: "Train",
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

export type WaveGeneratorData = {
  id: Id;
  type: "waveGenerator";
  waveGenerator: WaveType;
  frequency: ValueSource;
  amplitude: ValueSource;
  frequencyIn?: string[];
  amplitudeIn?: string[];
};
export type WaveGeneratorNodeType = Node<WaveGeneratorData, "waveGenerator">;
