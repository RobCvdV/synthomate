import { el, ElemNode } from "@elemaudio/core";
import WebRenderer from "@elemaudio/web-renderer";
import {
  AudioNodeParams,
  AudioNodeType,
  AudioParams,
  AudioProps,
} from "./types";
import { AppNode } from "@/store/types";
import { WaveGeneratorData } from "@/domain/WaveGenerator";
import { Exception } from "@/types/Exception";

export class Synth {
  isInitialized = false;
  audioNode?: AudioWorkletNode;

  constructor(
    readonly ctx = new AudioContext(),
    readonly core = new WebRenderer(),
  ) {}

  init() {
    if (this.isInitialized || this.ctx.state === "running") {
      console.log("Synth is already initialized");
      return Promise.resolve(this);
    }
    return this.core
      .initialize(this.ctx, {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2],
      })
      .then((node) => {
        this.audioNode = node;
        console.log("Synth initialized");
        node.connect(this.ctx.destination);
        console.log("Synth connected to destination");
        this.isInitialized = true;
        return this;
      });
  }

  render(node1: ElemNode, node2: ElemNode) {
    if (!this.isInitialized) {
      console.log("Synth is not initialized. Call synth.init() first");
    }
    return this.core.render(node1, node2);
  }

  static silence() {
    return el.const({ key: "silence", value: 0 });
  }

  static sin() {
    return el.square(440);
  }

  createWaveGenerator(node: AppNode) {
    const { id, data } = node;
    const { frequency, waveGenerator, amplitude } = data as WaveGeneratorData;
    const amp = el.const;
    // return el.mul(amplitude, el.osc(frequency, waveGenerator));
  }

  createNode(node: AppNode) {
    switch (node.type) {
      case "waveGenerator":
        return this.createWaveGenerator(node);
      default:
        throw Exception.IsNotImplemented.because(
          node.type + " is not implemented",
        );
    }
  }

  svf(props: AudioProps<"svf">, ...params: AudioParams<"svf">): ElemNode {
    return el.svf(props, ...params);
  }

  mul(props: AudioProps<"mul">, ...params: AudioParams<"mul">): ElemNode {
    return el.mul(props, ...params);
  }

  getRefConst(key: string, value: number) {
    return this.core.createRef("const", { key }, [value]);
  }

  getRefNode<N extends AudioNodeType>(
    node: N,
    props: AudioProps<N>,
    ...params: AudioParams<N> | any[]
  ) {
    if (!this.isInitialized) {
      console.log("Synth is not initialized. Call synth.init() first");
      return;
    }
    // @ts-ignore
    // return this.core.createRef(node, props, ...params) as [
    return this.core.createRef(node, props, params) as [
      ElemNode,
      (newProps: AudioProps<N>) => Promise<void>,
    ];
  }
}

// export const synth = new Synth();
