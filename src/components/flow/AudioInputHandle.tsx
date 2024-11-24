import { CSSProperties, FC, useCallback, useMemo, useState } from "react";
import {
  Connection,
  Handle,
  HandleProps,
  Position,
  useHandleConnections,
} from "@xyflow/react";

import s from "./AudioHandle.module.css";

export type AudioHandleProps = Omit<
  HandleProps,
  "position" | "type" | "onChange"
> & {
  nodeId: string;
  id: string;
  onChange: (values: string[]) => void;
  position?: string | number; // give location of the handle as 1/3 or 2/3 or 30%, number will be interpreted as percentage
  offset?: number;
};

function useConnectionChange(
  nodeId: string,
  id: string,
  onChange: (data: string[]) => void,
) {
  const [, setSources] = useState<string[]>([]);
  const onConnect = useCallback(
    (connections: Connection[]) => {
      setSources((ss) => {
        const newCs = connections.map((c) => c.source);
        onChange([...ss, ...newCs]);
        return newCs;
      });
    },
    [onChange, setSources],
  );

  const onDisconnect = useCallback(
    (connections: Connection[]) => {
      setSources((ss) => {
        const newCs = ss.filter(
          (s) => !connections.some((c) => c.source === s),
        );
        onChange(newCs);
        return newCs;
      });
    },
    [onChange, setSources],
  );
  useHandleConnections({
    type: "target",
    nodeId,
    id,
    onConnect: onConnect,
    onDisconnect: onDisconnect,
  });
}

export const AudioInputHandle: FC<AudioHandleProps> = ({
  id,
  nodeId,
  offset = 0,
  position,
  style,
  onChange,
  ...props
}) => {
  useConnectionChange(nodeId, id, onChange);

  const innerStyle = useMemo<CSSProperties>(() => {
    if (position === undefined) {
      return {};
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
