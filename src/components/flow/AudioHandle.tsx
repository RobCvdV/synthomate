import { FC } from "react";
import { Handle, HandleProps } from "@xyflow/react";
import s from "./AudioHandle.module.css";

export const AudioHandle: FC<HandleProps> = ({ type, position, ...props }) => {
  return (
    <Handle
      type={type}
      position={position}
      className={s.AudioHandle}
      {...props}
    />
  );
};
