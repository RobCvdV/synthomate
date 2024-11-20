import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getSynth, Synth } from "@/domain/synth/synth";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store/store";
import { AppState } from "@/store/types";
import { mergeClasses } from "@/utils/mergeClasses";
import { InputLabeled } from "@core/InputLabeled";
import { withLogger } from "@core/withLogger";
import s from "./SynthRenderer.module.css";
import { ToggleButton } from "@core/ToggleButton";
import { el } from "@elemaudio/core";
import { OutputData } from "@/domain/Output";
import { memoize } from "lodash";

function createSynthNodesFromFlow(state: AppState) {
  const nodes = state.nodes;
  const edges = state.edges;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const outputData = nodes
    .filter((node) => node.type === "output" && node.data)
    .map<OutputData>((node) => node.data as OutputData)[0];
  // console.log("outputs", outputData);
  if (!outputData?.volume) {
    return undefined;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return outputData;
}

const selector = (state: AppState) => ({
  nodes: state.nodes.length,
  edges: state.edges.length,
  // todo: reduced elementary data here
  outputData: createSynthNodesFromFlow(state),
});

export type SynthRendererProps = {
  className?: string;
};

const playToggleStates = [
  { label: "▶", value: false },
  { label: "◼︎", value: true, bgColor: "green" },
];

export const SynthRenderer = withLogger<SynthRendererProps>(
  "SynthRenderer",
  ({ className, log }) => {
    const { nodes, edges } = useStore(useShallow(selector));
    const outputData = useStore(useShallow(selector)).outputData;
    const [play, setPlay] = useState(false);

    const onPlayToggle = useCallback(
      (playing: boolean) => {
        getSynth(true).then(() => setPlay(playing));
      },
      [setPlay],
    );

    useEffect(() => {
      getSynth().then((synth) => {
        if (!synth) {
          return;
        }
        const { volume = 0, id } = outputData ?? {};
        const vol = el.const({ key: `${id}`, value: volume });
        const { left = el.cycle(220), right = el.cycle(221) } =
          outputData ?? {};

        if (play) {
          // log("rendering cycle");
          synth.render(el.mul(vol, left), el.mul(vol, right));
        } else {
          synth.render(el.sin(0), el.sin(0));
        }
      });
    }, [play, outputData]);

    return (
      <div
        className={mergeClasses("SynthRenderer", className, s.SynthRenderer)}
      >
        <ToggleButton<boolean>
          states={playToggleStates}
          onChange={onPlayToggle}
          width={"50pt"}
          style={{ fontSize: "1.2em" }}
        />
        <div className={s.Status}>
          <InputLabeled label="Nodes" type="text" value={nodes} disabled />
          <InputLabeled label="Edges" type="text" value={edges} disabled />
        </div>
      </div>
    );
  },
);
