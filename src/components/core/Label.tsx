import { HTMLProps } from "react";
import { mergeClasses } from "@/utils/mergeClasses";
import s from "./Label.module.css";

export type LabelProps = HTMLProps<HTMLLabelElement> & {
  text: string;
};

export function Label({ className, text, ...props }: LabelProps) {
  return (
    <label className={mergeClasses(s.Label, className)} {...props}>
      {text}
    </label>
  );
}
