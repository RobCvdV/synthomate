import React, { useCallback, useEffect, useRef, useState } from "react";
import { type NodeProps } from "@xyflow/react";
import s from "./Output.module.css";
import { AudioInputHandle } from "@flow/AudioInputHandle";
import { OutputNodeType } from "@/domain/Output";
import { InputLabeled } from "@/components/core/InputLabeled";
import { mergeClasses } from "@/utils/mergeClasses";
import { Label } from "@core/Label";
import { Synth } from "@/domain/synth/synth";
import { el, ElemNode } from "@elemaudio/core";

type Props = NodeProps<OutputNodeType>;

type Channels = [ElemNode, ElemNode];

let synth: Synth;

export function OutputNode({ id, data }: Props) {
  const [isInitialized, setIsInitialized] = useState(false);
  const volumesRef = useRef<any[]>([[], []]);

  const init = useCallback(() => {
    if (synth?.isInitialized) {
      return;
    }
    synth = new Synth();
    synth.init().then(() => {
      volumesRef.current = [
        synth.getRefConst("volume_0_" + id, 1),
        synth.getRefConst("volume_1_" + id, 1),
      ];
      setIsInitialized(true);
    });
  }, [id, setIsInitialized]);

  const [channels, setChannels] = useState<Channels>([
    Synth.sin(),
    Synth.sin(),
  ]);

  const onInputChange = useCallback(
    (channel: 0 | 1, value?: ElemNode) => {
      if (!isInitialized) {
        return;
      }

      setChannels((prev) => {
        const next = [...prev] as Channels;
        next[channel] = value || Synth.silence();
        return next;
      });
    },
    [setChannels, isInitialized],
  );

  const onVolumeChange = useCallback(
    (vol: string) => {
      const volume = parseFloat(vol) / 100;
      if (!synth?.isInitialized) {
        init();
        return;
      }
      console.log("set volume", volume);
      console.log("volumesRef", volumesRef.current);

      // volumesRef.current.forEach(([v, setV]) => {
      //   setV({ key: (v as any).key, value: volume })
      //     .then(() => console.log("set volume", volume))
      //     .catch(console.error);
      // });
    },
    [volumesRef, init],
  );

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    console.log("render", channels, volumesRef.current);
    // const chs = channels.map((n, i) => {
    //   console.log("render", n, volumesRef.current[i][0]);
    //   // return el.mul(n, volumesRef.current[i][0]);
    // });

    // synth.render(
    //   ...(chs) as Channels,
    // );
  }, [channels, volumesRef, isInitialized]);

  return (
    <div className={s.Output}>
      <Label text={"Output"} />
      <AudioInputHandle
        id="left"
        position={"1/2"}
        onChange={(v) => onInputChange(0, v)}
      />
      <AudioInputHandle
        id="right"
        position={"2/2"}
        onChange={(v) => onInputChange(1, v)}
      />
      <InputLabeled
        label="Vol"
        type="range"
        step={1}
        min={0}
        max={100}
        value={data.volume}
        onChange={onVolumeChange}
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
