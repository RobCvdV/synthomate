import { el } from "@elemaudio/core";

export type Audio = typeof el;
export type AudioNodeType = Exclude<keyof Audio, "">;
export type AudioNodeParams<T extends AudioNodeType> = Parameters<Audio[T]>;

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
