import { FC } from "react";
import { Handle, HandleProps, Position } from "@xyflow/react";
import s from "./AudioHandle.module.css";

export type AudioHandleProps = Omit<HandleProps, "position"> & {
  inOut: "in" | "out";
  position?: string | number; // give location of the handle as 1/3 or 2/3 or 30%, number will be interpreted as percentage
  offset?: number;
};

export const AudioHandle: FC<AudioHandleProps> = ({
  inOut,
  position = "50%",
  offset = 0,
  style,
  ...props
}) => {
  const horPosition = inOut === "in" ? Position.Left : Position.Right;
  let top = position;
  if (typeof position === "number") {
    top = `${position}%`;
  } else if (position.includes("/")) {
    const [nth, of] = position.split("/").map((n) => parseInt(n, 10));
    // the height of the handle is 100% divided by the number of handles
    // this is to make the handles stack vertically
    const height = (100 - offset) / (of + 1);
    // the top position is the height times the handle number
    top = `${height * nth + offset}%`;
  }

  return (
    <Handle
      className={s.AudioHandle}
      position={horPosition}
      style={{
        top,
        ...style,
      }}
      {...props}
    />
  );
};
