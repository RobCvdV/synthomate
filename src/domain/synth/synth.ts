import { el, ElemNode } from "@elemaudio/core";
import WebRenderer from "@elemaudio/web-renderer";
import {
  AudioNodeParams,
  AudioNodeType,
  AudioParams,
  AudioProps,
} from "./types";
import { AppNode } from "@/store/types";
import { WaveGeneratorData, WaveType } from "@/domain/WaveGenerator";
import { Exception } from "@/types/Exception";
import { SynthData } from "@/domain/synth/data";

export class Synth {
  isInitialized = false;
  audioNode?: AudioWorkletNode;

  constructor(
    readonly ctx = new AudioContext(),
    readonly core = new WebRenderer(),
  ) {}

  init() {
    if (this.isInitialized) {
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

  static getWaveType(type: WaveType, rate: ElemNode): ElemNode {
    switch (type) {
      case "sine":
        return el.cycle(rate);
      case "square":
        return el.square(rate);
      case "saw":
        return el.saw(rate);
      case "triangle":
        return el.triangle(rate);
      case "blepsquare":
        return el.blepsquare(rate);
      case "blepsaw":
        return el.blepsaw(rate);
      case "bleptriangle":
        return el.bleptriangle(rate);
      case "metro":
        return el.metro();
      case "noise":
        return el.noise();
      default:
        throw Exception.IsNotImplemented.because(type + " is not implemented");
    }
  }

  createWaveGenerator(data: WaveGeneratorData): ElemNode {
    const { frequency, waveGenerator, amplitude, id } = data;
    const amp = el.const({ key: id + "_amp", value: amplitude });
    const freq = el.const({ key: id + "_freq", value: frequency });
    const wave = Synth.getWaveType(waveGenerator, freq);
    return el.mul(amp, wave);
  }

  // createNode(node: SynthData) {
  //   switch (node.type) {
  //     case "waveGenerator":
  //       return this.createWaveGenerator(node);
  //     default:
  //       throw Exception.IsNotImplemented.because(
  //         node.type + " is not implemented",
  //       );
  //   }
  // }

  getRefConst(key: string, value: number) {
    return this.core.createRef("const", { key }, [value]);
  }

  getRefNode<N extends AudioNodeType>(
    node: N,
    props: AudioProps<N>,
    params: AudioParams<N>,
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

let _synthInstance: Synth;
export function getSynth(init?: boolean) {
  if (init) {
    if (_synthInstance) {
      return Promise.resolve(_synthInstance);
    }
    _synthInstance = new Synth();
    return _synthInstance.init().then((synth) => {
      console.log(
        "SynthRenderer: synthInstance initialized",
        typeof synth.render,
      );
      return synth;
    });
  }
  return Promise.resolve(_synthInstance);
}
