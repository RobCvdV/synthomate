import { el } from "@elemaudio/core";

export type Audio = typeof el;
export type AudioNodeType = Exclude<keyof Audio, "">;
export type AudioNodeParams<T extends AudioNodeType> = Parameters<Audio[T]>;
export type AudioProps<N extends AudioNodeType> = AudioNodeParams<N>[0];
export type AudioParams<N extends AudioNodeType> =
  AudioNodeParams<N> extends [any, ...infer P] ? P : never;

type AudioTypes = {
  [key in AudioNodeType]: AudioNodeType;
};

export const AudioNodeTypes = Object.keys(el).reduce<{
  [key: string]: AudioNodeType;
}>(
  (acc, key) => {
    if (key) {
      acc[key] = key as AudioNodeType;
    }
    return acc;
  },
  {} as { [key: string]: AudioNodeType },
) as AudioTypes;
