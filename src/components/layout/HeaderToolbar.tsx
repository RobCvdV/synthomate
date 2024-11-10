import React, { FC } from "react";
import { Panel } from "@xyflow/react";
import s from "./HeaderToolbar.module.css";
import { AppNodeTypes } from "@/store/types";
import { ColorChooserDnd } from "@flow/ColorChooserNode";
import { useDnd } from "@/components/dragAndDrop/DndContext";
import { SynthRenderer } from "@/components/audio/SynthRenderer";
import { WaveGeneratorDnd } from "@flow/WaveGeneratorNode";
import { AnyObject } from "@/types/AnyObject";
import { WaveGeneratorData, WaveTypes } from "@/domain/WaveGenerator";
import { OutputDnd } from "@flow/OutputNode";
import { Button } from "@core/Button";
import { Spacer } from "@core/Spacer";
import { useStore } from "@/store/store";

export function HeaderToolbar() {
  const [, setProps] = useDnd();

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    type: AppNodeTypes,
    data?: AnyObject,
  ) => {
    setProps({ type, data });
    event.dataTransfer.effectAllowed = "move";
  };

  const clearAll = useStore((state) => state.clearAll);

  return (
    <Panel className={s.Header} position={"top-left"}>
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
      <OutputDnd
        label={"Output"}
        onDragStart={(e) => onDragStart(e, "output")}
      />
      <Spacer />
      <Button className={s.Info} label="Clear All" onClick={clearAll} />
      <SynthRenderer className={s.Info} />
    </Panel>
  );
}
