import { ValueSource } from "@/types/ValueSource";
import s from "./InputLabeled.module.css";
import { HTMLInputTypeAttribute, ReactNode } from "react";
import { mergeClasses } from "@/utils/mergeClasses";
import { Label } from "@core/Label";

export type InputLabeledProps = {
  label: string;
  value?: ValueSource;
  defaultValue?: ValueSource;
  onChange?: (value: string) => void;
  type?: HTMLInputTypeAttribute;
  step?: number | "any";
  min?: number;
  max?: number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
  children?: ReactNode;
};

export const InputLabeled = ({
  label,
  value,
  defaultValue,
  onChange,
  type = "text",
  step = "any",
  min,
  max,
  placeholder = "",
  disabled = false,
  required = false,
  className = "",
  id = "",
}: InputLabeledProps): JSX.Element => {
  return (
    <div className={mergeClasses("InputLabeled", className, s.InputLabeled)}>
      <Label className={s.label} htmlFor={id} text={label} />
      <input
        id={id}
        type={type}
        value={value}
        defaultValue={defaultValue}
        step={step}
        min={min}
        max={max}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={s.input}
      />
    </div>
  );
};
