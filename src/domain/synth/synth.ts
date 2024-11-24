import { el, ElemNode } from "@elemaudio/core";
import WebRenderer from "@elemaudio/web-renderer";
import { AudioNodeType, AudioParams, AudioProps } from "./types";
import { WaveGeneratorData, WaveType } from "@/domain/WaveGenerator";
import { Exception, AnyObject } from "@/types";
import { SynthData } from "@/store/synthSlice";
import { OutputData } from "@/domain/Output";
import { getNodesById } from "@/store/store";
import { SliderData } from "@/domain";
import { SampleData } from "@/domain/Sample";
import { LogClass, Logger } from "@/utils/withLogger";

type SynthRef<N extends AudioNodeType> = [
  ElemNode,
  (newProps: AudioProps<N>) => Promise<void>,
];

export interface Synth extends LogClass {}
@Logger("Synth", "blue")
export class Synth {
  isInitialized = false;
  audioNode?: AudioWorkletNode;

  constructor(
    readonly ctx = new AudioContext(),
    readonly core = new WebRenderer(),
    readonly samples: AnyObject<Float32Array> = {},
    readonly refs = new Map<string, any>(),
  ) {
    this.log("Synth created");
  }

  init() {
    if (this.isInitialized) {
      this.log("Synth is already initialized");
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
        this.log("Synth initialized");
        node.connect(this.ctx.destination);
        this.log("Synth connected to destination");
        this.isInitialized = true;
        return this;
      });
  }

  get isRunning() {
    return this.ctx.state === "running";
  }

  render(node1: ElemNode, node2: ElemNode) {
    if (!this.isInitialized) {
      this.log("Synth is not initialized. Call synth.init() first");
    }
    this.core.render(node1, node2).catch((e) => {
      this.error("Error rendering synth", e);
    });
  }

  static silence() {
    return el.sin(0);
  }

  static getWaveType(
    type: WaveType,
    rate: ElemNode,
    reset?: ElemNode,
  ): ElemNode {
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
      case "train":
        return el.train(rate);
      case "pinknoise":
        return el.pinknoise();
      case "noise":
        return el.noise();
      case "phasor":
        return el.phasor(rate);
      case "syncphasor":
        if (!reset)
          throw Exception.IsNotValid.because(
            "Sync Phasor requires a reset signal",
          );
        return el.syncphasor(rate, reset);
      default:
        console.log("WaveType not found", type);
        throw Exception.IsNotImplemented.because(type + " is not implemented");
    }
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

  createSample(data: SampleData): ElemNode {
    const {
      frequency,
      path,
      amplitude,
      trigger,
      id,
      frequencyIn = [],
      amplitudeIn = [],
    } = data;
    let freq = el.const({ key: id + "_freq", value: frequency });
    if (frequencyIn.length) {
      const freqIn = el.add(...frequencyIn.map((d) => this.createNode(d)));
      freq = el.mul(freq, freqIn);
    }

    let pulse: ElemNode;
    if (typeof trigger === "number") {
      pulse = el.train(el.const({ key: id + "_train", value: trigger }));
    } else {
      pulse = this.createNode(trigger);
    }

    let amp = el.const({ key: id + "_amp", value: amplitude });
    if (amplitudeIn.length) {
      const ampIn = el.add(...amplitudeIn.map((d) => this.createNode(d)));
      amp = el.mul(amp, ampIn);
    }

    this.log("Sample", { id, path, freq, pulse, amp });
    const wave = el.sample(
      { key: `${id}_sample`, path: path + "_0", mode: "oneshot" },
      pulse,
      freq,
    );
    return el.mul(amp, wave);
  }

  createSlider(data: SliderData): ElemNode {
    const { value, id } = data;
    // const [n] = this.getRefConst(id as string, value);
    // return n;
    return el.const({ key: `${id}`, value });
  }

  createNode(nodeId: string) {
    const data = getNodesById(nodeId)?.[0].data as SynthData;
    if (!data?.type) {
      return Synth.silence();
    }
    switch (data.type) {
      case "waveGenerator":
        return this.createWaveGenerator(data as WaveGeneratorData);
      case "slider":
        return this.createSlider(data as SliderData);
      case "sample":
        return this.createSample(data as SampleData);
      default:
        throw Exception.IsNotImplemented.because(
          data.type + " is not implemented",
        );
    }
  }

  async loadSample(name: string, buf: ArrayBuffer) {
    let sampleBuffer = await this.ctx.decodeAudioData(buf);
    for (let i = 0; i < sampleBuffer.numberOfChannels; i++) {
      const name_c = `${name}_${i + 1}`;
      this.log("Sample loaded", { name: name_c });
      this.samples[name_c] = sampleBuffer.getChannelData(i);
    }
    this.log("Samples", Object.keys(this.samples));
    return this.core
      .updateVirtualFileSystem(this.samples)
      .then((args) => {
        this.log("Virtual file system updated", args);
      })
      .catch((e) => {
        this.error("Error updating virtual file system", e);
      });
  }

  getRefConst(key: string, value: number) {
    return this.getRef(key, "const", { value }, []);
  }

  getRef<N extends AudioNodeType>(
    key: string,
    node: N,
    props: AudioProps<N>,
    params: AudioParams<N>,
  ) {
    let r = this.refs.get(key);
    if (!r) {
      r = this.core.createRef(node, props, params) as SynthRef<N>;
      this.refs.set(key, r);
    }
    return r as SynthRef<N>;
  }
}

let _synthInstance: Synth;
export function getSynth(init?: boolean) {
  if (init) {
    if (_synthInstance) {
      return Promise.resolve(_synthInstance);
    }
    return new Synth().init().then((synth) => {
      console.log(
        "SynthRenderer: synthInstance initialized",
        typeof synth.render,
      );
      _synthInstance = synth;
      return synth;
    });
  }
  return Promise.resolve(_synthInstance);
}
