import { ValueSource } from "@/types/ValueSource";
import s from "./InputLabeled.module.css";
import { HTMLInputTypeAttribute } from "react";
import { mergeClasses } from "@/utils/mergeClasses";

export type InputLabeledProps = {
  label: string;
  value: ValueSource;
  onChange: (value: string) => void;
  type?: HTMLInputTypeAttribute;
  step?: number | "any";
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
};

export const InputLabeled = ({
  label,
  value,
  onChange,
  type = "text",
  step = "any",
  placeholder = "",
  disabled = false,
  required = false,
  className = "",
  id = "",
}: InputLabeledProps): JSX.Element => {
  return (
    <div className={mergeClasses("InputLabeled", className, s.InputLabeled)}>
      <label className={s.label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        defaultValue={value}
        step={step}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={s.input}
      />
    </div>
  );
};
