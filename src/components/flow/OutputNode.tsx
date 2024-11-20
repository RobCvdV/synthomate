import React, { useCallback } from "react";
import { type NodeProps } from "@xyflow/react";
import s from "./Output.module.css";
import { AudioInputHandle } from "@flow/AudioInputHandle";
import { OutputData, OutputNodeType } from "@/domain/Output";
import { InputLabeled } from "@/components/core/InputLabeled";
import { mergeClasses } from "@/utils/mergeClasses";
import { Label } from "@core/Label";
import { ElemNode } from "@elemaudio/core";
import { withLogger } from "@core/withLogger";
import { useStore } from "@/store/store";

type Props = NodeProps<OutputNodeType>;

export const OutputNode = withLogger<Props>(
  "OutputNode",
  ({ id, data, log }) => {
    const onUpdate = useStore((state) => state.updateSynthNode<OutputData>);

    const onInputChange = useCallback(
      (channel: "left" | "right", value?: ElemNode) => {
        onUpdate({ id, [channel]: value });
      },
      [onUpdate],
    );

    const onVolumeChange = useCallback(
      (vol: string) => {
        const volume = parseFloat(vol) / 100;
        onUpdate({ id, volume });
      },
      [onUpdate],
    );

    return (
      <div className={s.Output}>
        <Label text={"Output"} />
        <AudioInputHandle
          id="left"
          position={"1/2"}
          onChange={(v) => onInputChange("left", v)}
        />
        <AudioInputHandle
          id="right"
          position={"2/2"}
          onChange={(v) => onInputChange("right", v)}
        />
        <InputLabeled
          label="Vol"
          type="range"
          step={1}
          min={0}
          max={100}
          value={data.volume * 100}
          onChange={onVolumeChange}
          className={mergeClasses("nodrag", s.Controls)}
        />
      </div>
    );
  },
);

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
