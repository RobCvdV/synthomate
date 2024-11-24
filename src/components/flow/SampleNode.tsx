import React, { useCallback, useEffect, useMemo } from "react";
import { NodeProps } from "@xyflow/react";
import s from "./Sample.module.css";
import { AudioInputHandle } from "@flow/AudioInputHandle";
import { SampleNodeType } from "@/domain/Sample";
import { useStore } from "@/store/store";
import { InputLabeled } from "@/components/core/InputLabeled";
import { mergeClasses } from "@/utils/mergeClasses";
import { Label } from "@core/Label";
import { AudioOutputHandle } from "@flow/AudioOutputHandle";
import { withLogger } from "@/utils/withLogger";
import _ from "lodash";
import { Button } from "@core/Button";
import { useOpenAudioFilePicker } from "@/data/useOpenAudioFilePicker";
import { getSynth } from "@/domain/synth/synth";

function getStep(value: number) {
  if (value < 1) return 0.01;
  if (value < 10) return 0.1;
  if (value < 100) return 1;
  return 10;
}

export const SampleNode = withLogger<NodeProps<SampleNodeType>>(
  "SampleNode",
  ({ id, data }: NodeProps<SampleNodeType>) => {
    const onUpdate = useStore((state) => state.updateSynthNode);

    const onChangeAmplitude = useCallback(
      (value: string) => onUpdate({ id, amplitude: parseFloat(value) }),
      [onUpdate, id],
    );
    const onChangeFrequency = useCallback(
      (value: string) => onUpdate({ id, frequency: parseFloat(value) }),
      [onUpdate, id],
    );

    const onChangeAmplitudeInputs = useCallback(
      (values: string[]) => onUpdate({ id, amplitudeIn: values }),
      [onUpdate, id],
    );
    const onChangeFrequencyInputs = useCallback(
      (values: string[]) => onUpdate({ id, frequencyIn: values }),
      [onUpdate, id],
    );
    const onChangeTriggerInput = useCallback(
      (value: string[]) => onUpdate({ id, trigger: value[0] ?? 1 }),
      [onUpdate, id],
    );
    const onChangeTriggerValue = useCallback(
      (value: string) => onUpdate({ id, trigger: parseFloat(value) }),
      [onUpdate, id],
    );

    const triggerValue = useMemo<number>(() => {
      return _.isString(data.trigger) ? 0 : data.trigger;
    }, [data.trigger]);

    const [_openFile, content, loading, errors] = useOpenAudioFilePicker();
    const openFile = useCallback(() => _openFile(), [_openFile]);

    useEffect(() => {
      const file = content[0];
      if (file) {
        getSynth(true)
          .then((synth) => synth.loadSample(file.name, file.content))
          .then(() => onUpdate({ id, path: file.name }));
      }
    }, [content, onUpdate, id]);

    return (
      <div className={s.Sample}>
        <Label text={"Sample player"} />
        <Button className={s.Button} onClick={openFile} label={"pick a file"} />
        {loading ? (
          <Label text={"Loading..."} />
        ) : errors.length ? (
          <Label text={`Error: ${errors}`} />
        ) : (
          <>
            <Label text={content[0]?.name} />
            <Label text={content[0]?.type} />
          </>
        )}
        <div className={s.Controls}>
          <AudioInputHandle
            nodeId={id}
            id="trigger"
            onChange={onChangeTriggerInput}
          />
          <InputLabeled
            label="Trigger"
            type="number"
            disabled={_.isString(data.trigger)}
            step={1}
            value={triggerValue}
            onChange={onChangeTriggerValue}
            className={mergeClasses("nodrag", s.Input)}
          />
        </div>
        <div className={s.Controls}>
          <AudioInputHandle
            nodeId={id}
            id="amplitudeIn"
            onChange={onChangeAmplitudeInputs}
          />
          <InputLabeled
            label="Amp"
            type="number"
            step={getStep(data.amplitude)}
            value={data.amplitude}
            onChange={onChangeAmplitude}
            className={mergeClasses("nodrag", s.Input)}
          />
        </div>
        <div className={s.Controls}>
          <AudioInputHandle
            nodeId={id}
            id="frequencyIn"
            onChange={onChangeFrequencyInputs}
          />
          <InputLabeled
            label="Freq"
            type="number"
            step={getStep(data.frequency)}
            value={data.frequency}
            onChange={onChangeFrequency}
            className={mergeClasses("nodrag", s.Input)}
          />
        </div>
        <AudioOutputHandle id="out" />
      </div>
    );
  },
);

type DndProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export function SampleDnd({
  onDragStart,
  label,
}: DndProps & { label: string }) {
  return (
    <div draggable className={s.Dnd} onDragStart={onDragStart}>
      <span>{label}</span>
    </div>
  );
}
