import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FormEventHandler,
  useCallback,
  useState,
} from "react";
import { mergeClasses } from "@/utils/mergeClasses";
import s from "./Button.module.css";
import { Button, ButtonProps } from "@core/Button";
import { Id } from "@/types/Id";

type ToggleState<T> = {
  label: string;
  value: T;
  bgColor?: string;
};

export type ToggleButtonProps<T> = Omit<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  "onChange"
> & {
  states: ToggleState<T>[];
  onChange?: (state: T) => void;
  width?: string | number;
};

export function ToggleButton<T = Id>({
  states,
  className,
  onChange,
  width,
  style = {},
  ...props
}: ToggleButtonProps<T>) {
  const [state, setState] = useState<ToggleState<T>>(states[0]);

  const onChangeInner = useCallback<FormEventHandler<HTMLButtonElement>>(
    (e) => {
      e.preventDefault();
      setState((st) => {
        const index = states.indexOf(st);
        const nextIndex = (index + 1) % states.length;
        const newSate = states[nextIndex];
        onChange?.(newSate.value);
        return newSate;
      });
    },
    [setState, states, onChange],
  );

  return (
    <Button
      label={state.label}
      onClick={onChangeInner}
      {...props}
      style={{ ...style, width, backgroundColor: state.bgColor }}
    />
  );
}
