import React, { useCallback } from "react";
import { type NodeProps } from "@xyflow/react";
import s from "./Slider.module.css";
import { SliderData, SliderNodeType } from "@/domain/Slider";
import { InputLabeled } from "@/components/core/InputLabeled";
import { mergeClasses } from "@/utils/mergeClasses";
import { withLogger } from "@/utils/withLogger";
import { useStore } from "@/store/store";
import { AudioOutputHandle } from "@flow/AudioOutputHandle";
import { Collapsable } from "@core/Collapsable";

type Props = NodeProps<SliderNodeType>;

export const SliderNode = withLogger<Props>(
  "SliderNode",
  ({ id, data, log }) => {
    const onUpdate = useStore((state) => state.updateSynthNode<SliderData>);

    const onChangeValue = useCallback(
      (vol: string) => {
        const value = parseFloat(vol);
        log("onValueChange", value);
        onUpdate({ id, value });
      },
      [onUpdate, id, log],
    );

    const onChangeMin = useCallback(
      (min: string) => {
        const minValue = parseFloat(min);
        onUpdate({ id, min: minValue });
      },
      [onUpdate, id],
    );

    const onChangeMax = useCallback(
      (max: string) => {
        const maxValue = parseFloat(max);
        onUpdate({ id, max: maxValue });
      },
      [onUpdate, id],
    );

    return (
      <div className={s.Main}>
        <div className={s.Slider}>
          <InputLabeled
            label=""
            type="range"
            step={0.01}
            min={data.min ?? 0}
            max={data.max ?? 1}
            value={data.value}
            onChange={onChangeValue}
            className={mergeClasses("nodrag", s.Controls)}
          />
          <AudioOutputHandle id="output" />
        </div>
        <Collapsable
          className={s.Collapsable}
          collapsedChildren={
            <div className={s.Collapsed}>
              <span>{data.min}</span>
              <span>{data.max}</span>
            </div>
          }
        >
          <InputLabeled
            label={""}
            type="number"
            value={data.min}
            onChange={onChangeMin}
            className={mergeClasses("nodrag", s.Controls)}
          />
          <InputLabeled
            label={""}
            type="number"
            value={data.max}
            onChange={onChangeMax}
            className={mergeClasses("nodrag", s.Controls)}
          />
        </Collapsable>
      </div>
    );
  },
);

type DndProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export function SliderDnd({
  onDragStart,
  label,
}: DndProps & { label: string }) {
  return (
    <div draggable className={s.Dnd} onDragStart={onDragStart}>
      <span>{label}</span>
    </div>
  );
}
