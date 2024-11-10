import React, { ChangeEventHandler } from "react";
import { type Node, type NodeProps, Position } from "@xyflow/react";
import { useStore } from "store/store";
import s from "./ColorChooser.module.css";
import { AudioHandle } from "./AudioHandle";
import { AnyEntity } from "@/types/AnyObject";

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
      <AudioHandle type="target" position={Position.Right} />
      <ColorChooser
        data={data}
        onChange={(evt) => updateNodeColor(id, evt.target.value)}
      />
      <AudioHandle type="source" position={Position.Right} />
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
