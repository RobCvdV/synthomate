import React, { FC } from "react";
import { Panel } from "@xyflow/react";
import s from "./HeaderToolbar.module.css";
import { AppNodeTypes } from "store/types";
import { ColorChooserDnd } from "components/flow/ColorChooserNode";
import { useDnd } from "components/dragAndDrop/DndContext";
import { SynthRenderer } from "../audio/SynthRenderer";
import { WaveGeneratorDnd } from "../flow/WaveGeneratorNode";
import { AnyObject } from "../../types/AnyObject";
import { WaveGeneratorData, WaveTypes } from "../../domain/WaveGenerator";

export type HeaderToolbarProps = {
  onAdd?: () => void;
  onClear?: () => void;
};

export const HeaderToolbar: FC<HeaderToolbarProps> = ({}) => {
  const [, setProps] = useDnd();

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    type: AppNodeTypes,
    data?: AnyObject,
  ) => {
    setProps({ type, data });
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Panel className={s.Header} position={"top-left"}>
      <SynthRenderer />
      <ColorChooserDnd
        onDragStart={(e) =>
          onDragStart(e, "colorChooser", { color: "#4FD1C5" })
        }
        color={"#4FD1C5"}
      />
      <WaveGeneratorDnd
        label={"Wave"}
        onDragStart={(e) =>
          onDragStart(e, "waveGenerator", {
            frequency: 440,
            waveGenerator: WaveTypes.sine,
            amplitude: 1,
          } as WaveGeneratorData)
        }
      />
    </Panel>
  );
};
