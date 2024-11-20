import { CSSProperties, FC, useEffect, useMemo } from "react";
import {
  Handle,
  HandleProps,
  Position,
  useHandleConnections,
  useNodesData,
} from "@xyflow/react";
import s from "./AudioHandle.module.css";
import { Id } from "@/types/Id";
import { ElemNode } from "@elemaudio/core";
import { getSynth } from "@/domain/synth/synth";
import { AppNode } from "@/store/types";
import { WaveGeneratorData } from "@/domain/WaveGenerator";

export type AudioHandleProps = Omit<
  HandleProps,
  "position" | "type" | "onChange"
> & {
  id: Id;
  onChange?: (value: ElemNode) => void;
  position?: string | number; // give location of the handle as 1/3 or 2/3 or 30%, number will be interpreted as percentage
  offset?: number;
};

export const AudioInputHandle: FC<AudioHandleProps> = ({
  id,
  offset = 0,
  position,
  style,
  onChange,
  ...props
}) => {
  const connections = useHandleConnections({
    type: "target",
    id,
  });
  const nodeData = useNodesData(connections?.[0]?.source);
  useEffect(() => {
    console.log("input", id, "nodeData", nodeData?.data);
    if (!nodeData?.data || !nodeData?.type) {
      return;
    }
    getSynth().then((synth) => {
      if (!synth) {
        return;
      }
      if (nodeData.type === "waveGenerator") {
        const waveGen = synth.createWaveGenerator(
          nodeData.data as WaveGeneratorData,
        );
        console.log("input onChane", nodeData.id, waveGen);
        onChange?.(waveGen);
      }
    });
    // onChange(nodeData?.data ? nodeData.data.value : 0);
  }, [nodeData]);

  const innerStyle = useMemo<CSSProperties>(() => {
    if (position === undefined) {
      return {
        // transform: "translate(-50%, 0)",
      };
    }

    let top = position;
    if (typeof position === "number") {
      top = `${position}%`;
    } else if (position.includes("/")) {
      const [nth, of] = position.split("/").map((n) => parseInt(n, 10));
      const height = (100 - offset) / (of + 1);
      top = `${height * nth + offset}%`;
    }

    return {
      top,
      ...style,
    };
  }, [position, style, offset]);

  return (
    <Handle
      id={id}
      className={s.AudioHandle}
      position={Position.Left}
      type="target"
      style={innerStyle}
      {...props}
    />
  );
};
