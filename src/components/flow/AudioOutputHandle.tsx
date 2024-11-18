import { CSSProperties, FC, useMemo } from "react";
import { Handle, HandleProps, Position } from "@xyflow/react";
import s from "./AudioHandle.module.css";
import { Id } from "@/types/Id";

export type AudioHandleProps = Omit<HandleProps, "position" | "type"> & {
  id: Id;
  position?: string | number; // give location of the handle as 1/3 or 2/3 or 30%, number will be interpreted as percentage
  offset?: number;
};

export const AudioOutputHandle: FC<AudioHandleProps> = ({
  id,
  position,
  offset = 0,
  style,
  ...props
}) => {
  const innerStyle = useMemo<CSSProperties>(() => {
    if (position === undefined) {
      return {
        // position: "relative",
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
    // <div className={s.AudioHandle}>
    <Handle
      id={id}
      className={s.AudioHandle}
      position={Position.Right}
      style={innerStyle}
      type="source"
      {...props}
    />
    // {/*<label htmlFor="red" className="label">*/}
    // {/*  {label}*/}
    // {/*</label>*/}
    // </div>
  );
};
