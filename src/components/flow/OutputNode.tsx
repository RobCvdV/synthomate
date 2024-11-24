import React, { useCallback } from "react";
import { type NodeProps } from "@xyflow/react";
import s from "./Output.module.css";
import { AudioInputHandle } from "@flow/AudioInputHandle";
import { OutputData, OutputNodeType } from "@/domain/Output";
import { InputLabeled } from "@/components/core/InputLabeled";
import { mergeClasses } from "@/utils/mergeClasses";
import { Label } from "@core/Label";
import { withLogger } from "@/utils/withLogger";
import { useStore } from "@/store/store";

type Props = NodeProps<OutputNodeType>;

export const OutputNode = withLogger<Props>(
  "OutputNode",
  ({ id, data, log }) => {
    const onUpdate = useStore((state) => state.updateSynthNode<OutputData>);

    const onVolumeChange = useCallback(
      (vol: string) => {
        const volume = parseFloat(vol) / 1000;
        log("onVolumeChange", volume);
        onUpdate({ id, volume });
      },
      [onUpdate, id, log],
    );

    const onLeftChange = useCallback(
      (v: string[]) => onUpdate({ id, left: v }),
      [onUpdate, id],
    );

    const onRightChange = useCallback(
      (v: string[]) => onUpdate({ id, right: v }),
      [onUpdate, id],
    );

    return (
      <div className={s.Output}>
        <Label text={"Output"} />
        <AudioInputHandle
          nodeId={id}
          id="left"
          position={"1/2"}
          onChange={onLeftChange}
        />
        <AudioInputHandle
          nodeId={id}
          id="right"
          position={"2/2"}
          onChange={onRightChange}
        />
        <InputLabeled
          label="Vol"
          type="range"
          step={1}
          min={0}
          max={100}
          value={data.volume * 1000}
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
