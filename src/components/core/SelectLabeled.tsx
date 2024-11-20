import { ValueSource } from "@/types/ValueSource";
import s from "./SelectLabeled.module.css";
import { mergeClasses } from "@/utils/mergeClasses";
import { Label } from "@core/Label";

type OptionValues<T> = {
  value: T;
  label: string;
};

export type SelectLabeledProps<T> = {
  label: string;
  value: number | string;
  options: OptionValues<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
};

export function SelectLabeled<
  T extends string | number | readonly string[] = string,
>({
  label,
  value,
  options,
  onChange,
  disabled = false,
  required = false,
  className = "",
  id = "",
}: SelectLabeledProps<T>) {
  return (
    <div className={mergeClasses("SelectLabeled", className, s.SelectLabeled)}>
      <Label className={s.label} htmlFor={id} text={label} />
      <select
        id={id}
        defaultValue={value}
        onChange={(e) => onChange(e.target.value as T)}
        disabled={disabled}
        required={required}
        className={s.select}
      >
        {options.map(({ value, label }) => (
          <option key={label} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
