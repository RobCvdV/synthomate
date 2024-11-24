import React, { useCallback } from "react";
import { Panel } from "@xyflow/react";
import s from "./HeaderToolbar.module.css";
import { AppNodeTypes } from "@/store/types";
import { useDnd } from "@/components/dragAndDrop/DndContext";
import { SynthRenderer } from "@/components/audio/SynthRenderer";
import { WaveGeneratorDnd } from "@flow/WaveGeneratorNode";
import { AnyObject } from "@/types/AnyObject";
import { WaveGeneratorData, WaveTypes } from "@/domain/WaveGenerator";
import { OutputDnd } from "@flow/OutputNode";
import { Button } from "@core/Button";
import { Spacer } from "@core/Spacer";
import { useStore } from "@/store/store";
import { SliderDnd } from "@flow/SliderNode";
import { SampleDnd } from "@flow/SampleNode";
import { SynthData } from "@/store/synthSlice";
import { SampleData } from "@/domain";

let _tb = 0;
export function HeaderToolbar() {
  const setProps = useDnd((s) => s.setProps);
  const clearAll = useStore((state) => state.clearAll);
  console.log("HeaderToolbar render", _tb++);

  const onDragStart = useCallback(
    (
      event: React.DragEvent<HTMLDivElement>,
      type: AppNodeTypes,
      data?: SynthData,
    ) => {
      setProps(type, data);
      event.dataTransfer.effectAllowed = "move";
    },
    [setProps],
  );

  return (
    <Panel className={s.Header} position={"top-left"}>
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
      <SliderDnd
        label={"Slider"}
        onDragStart={(e) => onDragStart(e, "slider")}
      />
      <SampleDnd
        label={"Sample"}
        onDragStart={(e) =>
          onDragStart(e, "sample", {
            frequency: 44100,
            amplitude: 1,
            trigger: 0,
          } as SampleData)
        }
      />
      <Spacer />
      <Button className={s.Info} label="Clear All" onClick={clearAll} />
      <SynthRenderer className={s.Info} />
    </Panel>
  );
}
