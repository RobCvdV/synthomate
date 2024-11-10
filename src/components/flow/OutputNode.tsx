import React from "react";
import { type NodeProps } from "@xyflow/react";
import s from "./Output.module.css";
import { AudioHandle } from "@flow/AudioHandle";
import { OutputNodeType } from "@/domain/Output";
import { useStore } from "@/store/store";
import { InputLabeled } from "@/components/core/InputLabeled";
import { mergeClasses } from "@/utils/mergeClasses";
import { Label } from "@core/Label";

export function OutputNode({ id, data }: NodeProps<OutputNodeType>) {
  const onUpdate = useStore((state) => state.updateSynthNode);

  return (
    <div className={s.Output}>
      <Label text={"Output"} />
      <AudioHandle type="target" id="left" inOut={"in"} position={"1/2"} />
      <AudioHandle type="target" id="right" inOut={"in"} position={"2/2"} />
      <InputLabeled
        label="Vol"
        type="range"
        step={1}
        min={0}
        max={100}
        value={data.volume}
        onChange={(value) => onUpdate({ id, volume: parseFloat(value) })}
        className={mergeClasses("nodrag", s.Controls)}
      />
    </div>
  );
}

type DndProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export function OutputDnd({
  onDragStart,
  label,
}: DndProps & { label: string }) {
  return (
    <div draggable className={s.Dnd} onDragStart={onDragStart}>
      <span>{label}</span>
    </div>
  );
}
