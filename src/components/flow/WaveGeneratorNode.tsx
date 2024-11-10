import React from "react";
import { NodeProps } from "@xyflow/react";
import s from "./WaveGenerator.module.css";
import { AudioHandle } from "@flow/AudioHandle";
import {
  WaveGeneratorNodeType,
  WaveType,
  WaveTypeNames,
} from "@/domain/WaveGenerator";
import { useStore } from "@/store/store";
import { InputLabeled } from "@/components/core/InputLabeled";
import { SelectLabeled } from "@/components/core/SelectLabeled";
import { mergeClasses } from "@/utils/mergeClasses";
import { Label } from "@core/Label";

export function WaveGeneratorNode({
  id,
  data,
}: NodeProps<WaveGeneratorNodeType>) {
  const onUpdate = useStore((state) => state.updateSynthNode);

  return (
    <div className={s.WaveGenerator}>
      <Label text={"Wave Generator"} />
      {/*<AudioHandle type="target" id="waveGenerator" position={Position.Left} />*/}
      <SelectLabeled<WaveType>
        value={data.waveGenerator}
        onChange={(v) => onUpdate({ id, waveGenerator: v })}
        className={mergeClasses("nodrag", s.Controls)}
        label="Wave"
        options={WaveTypeNames}
      />
      <AudioHandle type="target" id="frequency" inOut={"in"} position={53} />
      <InputLabeled
        label="Amp"
        type="number"
        step={0.02}
        value={data.amplitude}
        onChange={(value) => onUpdate({ id, amplitude: parseFloat(value) })}
        className={mergeClasses("nodrag", s.Controls)}
      />
      <AudioHandle type="target" id="amplitude" inOut={"in"} position={78} />
      <InputLabeled
        label="Freq"
        type="number"
        value={data.frequency}
        onChange={(value) => onUpdate({ id, frequency: parseFloat(value) })}
        className={mergeClasses("nodrag", s.Controls)}
      />
      <AudioHandle type="source" inOut={"out"} />
    </div>
  );
}

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
