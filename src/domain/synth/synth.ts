import { el, ElemNode } from "@elemaudio/core";
import WebRenderer from "@elemaudio/web-renderer";
import { AudioNodeParams, AudioNodeType } from "./types";

type SvfParams = AudioNodeParams<"svf">;

export class Synth {
  constructor(
    readonly ctx = new AudioContext(),
    readonly core = new WebRenderer(),
  ) {}

  init() {
    return this.core
      .initialize(this.ctx, {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2],
      })
      .then((node) => {
        node.connect(this.ctx.destination);
        return this;
      });
  }

  render(node1: ElemNode, node2: ElemNode) {
    return this.core.render(node1, node2);
  }

  svf(...params: SvfParams) {
    return el.svf(...params);
  }

  getRefNode<N extends AudioNodeType>(node: N, ...params: AudioNodeParams<N>) {
    // @ts-ignore
    return this.core.createRef(node, ...params);
  }
}

export const synth = new Synth();
