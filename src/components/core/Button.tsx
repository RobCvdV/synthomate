import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { mergeClasses } from "@/utils/mergeClasses";
import s from "./Button.module.css";

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  label?: string;
};

export const Button = ({ label, className, ...props }: ButtonProps) => {
  return (
    <button {...props} className={mergeClasses(s.Button, className)}>
      {label}
      {props.children}
    </button>
  );
};
