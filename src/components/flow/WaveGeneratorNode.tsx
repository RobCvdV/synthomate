import React from "react";
import { type NodeProps, Position } from "@xyflow/react";
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

export function WaveGeneratorNode({
  id,
  data,
}: NodeProps<WaveGeneratorNodeType>) {
  const onUpdate = useStore((state) => state.updateSynthNode);

  return (
    <div className={s.WaveGenerator}>
      {/*<AudioHandle type="target" id="waveGenerator" position={Position.Left} />*/}
      <SelectLabeled<WaveType>
        value={data.waveGenerator}
        onChange={(v) => onUpdate({ id, waveGenerator: v })}
        className="nodrag"
        label="Wave"
        options={WaveTypeNames}
      />
      <AudioHandle
        type="target"
        id="frequency"
        position={Position.Left}
        style={{ top: "50%" }}
      />
      <InputLabeled
        label="Amp"
        type="number"
        step={0.02}
        value={data.amplitude}
        onChange={(value) => onUpdate({ id, amplitude: parseFloat(value) })}
        className="nodrag"
      />
      <AudioHandle
        type="target"
        id="amplitude"
        position={Position.Left}
        style={{ top: "70%" }}
      />
      <InputLabeled
        label="Freq"
        type="number"
        value={data.frequency}
        onChange={(value) => onUpdate({ id, frequency: parseFloat(value) })}
        className="nodrag"
      />
      <AudioHandle type="source" position={Position.Right} />
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
