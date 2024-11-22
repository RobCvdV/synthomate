import { el, ElemNode } from "@elemaudio/core";
import WebRenderer from "@elemaudio/web-renderer";
import { AudioNodeType, AudioParams, AudioProps } from "./types";
import { WaveGeneratorData, WaveType } from "@/domain/WaveGenerator";
import { Exception } from "@/types/Exception";
import { SynthData } from "@/store/synthSlice";
import { OutputData } from "@/domain/Output";
import { getNodesById } from "@/store/store";

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
    return el.sin(0);
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
    const {
      frequency,
      waveGenerator,
      amplitude,
      id,
      frequencyIn = [],
      amplitudeIn = [],
    } = data;
    let freq = el.const({ key: id + "_freq", value: frequency });
    if (frequencyIn.length) {
      const freqIn = el.add(...frequencyIn.map((d) => this.createNode(d)));
      freq = el.mul(freq, freqIn);
    }

    let amp = el.const({ key: id + "_amp", value: amplitude });
    if (amplitudeIn.length) {
      const ampIn = el.add(...amplitudeIn.map((d) => this.createNode(d)));
      amp = el.mul(amp, ampIn);
    }

    const wave = Synth.getWaveType(waveGenerator, freq);
    return el.mul(amp, wave);
  }

  createOutput(data: OutputData): [ElemNode, ElemNode] {
    const { volume, id, left = [], right = [] } = data;
    const leftNodes = left.map((d) => this.createNode(d));
    const rightNodes = right.map((d) => this.createNode(d));
    if (!leftNodes.length) {
      leftNodes.push(Synth.silence());
    }
    if (!rightNodes.length) {
      rightNodes.push(Synth.silence());
    }
    const vol = el.const({ key: id + "_vol", value: volume });
    return [
      el.mul(vol, el.add(...leftNodes)),
      el.mul(vol, el.add(...rightNodes)),
    ];
  }

  createNode(nodeId: string) {
    const data = getNodesById(nodeId)?.[0].data as SynthData;
    if (!data?.type) {
      return Synth.silence();
    }
    switch (data.type) {
      case "waveGenerator":
        return this.createWaveGenerator(data as WaveGeneratorData);
      case "output":
        return Synth.silence();
    }
  }

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
