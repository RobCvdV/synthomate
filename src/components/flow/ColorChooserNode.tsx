import React, { ChangeEventHandler } from "react";
import { type Node, type NodeProps } from "@xyflow/react";
import { useStore } from "@/store/store";
import s from "./ColorChooser.module.css";
import { AudioInputHandle } from "./AudioInputHandle";
import { AnyEntity } from "@/types/AnyObject";
import { AudioOutputHandle } from "@flow/AudioOutputHandle";

export type ColorData = AnyEntity & {
  color: string;
};
export type ColorNode = Node<ColorData, "colorChooser">;

type Props = {
  data: ColorData;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

function ColorChooser({ data, onChange }: Props) {
  return (
    <div style={{ backgroundColor: data.color }} className={s.ColorChooser}>
      <input
        type="color"
        defaultValue={data.color}
        onChange={onChange}
        className="nodrag"
      />
    </div>
  );
}

export function ColorChooserNode({ id, data }: NodeProps<ColorNode>) {
  const updateNodeColor = useStore((state) => state.updateNodeColor);
  return (
    <div className={s.Node}>
      <ColorChooser
        data={data}
        onChange={(evt) => updateNodeColor(id, evt.target.value)}
      />
      <AudioOutputHandle id={"colorOut"} />
    </div>
  );
}

type DndProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export function ColorChooserDnd({ onDragStart, color = "#aaffdd" }: DndProps) {
  return (
    <div draggable className={s.Dnd} onDragStart={onDragStart}>
      <ColorChooser data={{ id: "dummy", color }} />
    </div>
  );
}
