import React, { useCallback } from "react";
import { NodeProps } from "@xyflow/react";
import s from "./WaveGenerator.module.css";
import { AudioInputHandle } from "@flow/AudioInputHandle";
import {
  WaveGeneratorData,
  WaveGeneratorNodeType,
  WaveType,
  WaveTypeNames,
} from "@/domain/WaveGenerator";
import { useStore } from "@/store/store";
import { InputLabeled } from "@/components/core/InputLabeled";
import { SelectLabeled } from "@/components/core/SelectLabeled";
import { mergeClasses } from "@/utils/mergeClasses";
import { Label } from "@core/Label";
import { AudioOutputHandle } from "@flow/AudioOutputHandle";
import { withLogger } from "@core/withLogger";
import { ElemNode } from "@elemaudio/core";

function getStep(value: number) {
  if (value < 1) return 0.01;
  if (value < 10) return 0.1;
  if (value < 100) return 1;
  return 10;
}

export const WaveGeneratorNode = withLogger<NodeProps<WaveGeneratorNodeType>>(
  "WaveGeneratorNode",
  ({ id, data }: NodeProps<WaveGeneratorNodeType>) => {
    const onUpdate = useStore((state) => state.updateSynthNode);

    // put inputs in data as well? or let the Node create the ElemNode and is that the data?
    // the ElemNode can then be directly applied to output
    const onValueChange = useCallback(
      (prop: "frequency" | "amplitude", value?: ElemNode) => {
        onUpdate<WaveGeneratorData>({ id, [prop]: value });
      },
      [onUpdate],
    );

    return (
      <div className={s.WaveGenerator}>
        <Label text={"Wave Generator"} />
        <div className={s.Controls}>
          {/*<AudioHandle type="target" id="waveGenerator" position={Position.Left} />*/}
          <SelectLabeled<WaveType>
            value={data.waveGenerator}
            onChange={(v) => onUpdate({ id, waveGenerator: v })}
            className={mergeClasses("nodrag", s.Input)}
            label="Wave"
            options={WaveTypeNames}
          />
        </div>
        <div className={s.Controls}>
          <AudioInputHandle id="frequency" />
          <InputLabeled
            label="Amp"
            type="number"
            step={getStep(data.amplitude)}
            value={data.amplitude}
            onChange={(value) => onUpdate({ id, amplitude: parseFloat(value) })}
            className={mergeClasses("nodrag", s.Input)}
          />
        </div>
        <div className={s.Controls}>
          <AudioInputHandle id="amplitude" />
          <InputLabeled
            label="Freq"
            type="number"
            step={getStep(data.frequency)}
            value={data.frequency}
            onChange={(value) => onUpdate({ id, frequency: parseFloat(value) })}
            className={mergeClasses("nodrag", s.Input)}
          />
        </div>
        <AudioOutputHandle id="out" />
      </div>
    );
  },
);

type DndProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export function WaveGeneratorDnd({
  onDragStart,
  label,
}: DndProps & { label: string }) {
  return (
    <div draggable className={s.Dnd} onDragStart={onDragStart}>
      <span>{label}</span>
    </div>
  );
}
