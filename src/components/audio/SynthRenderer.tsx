import { FC, useEffect } from "react";
import { Synth, synth as synthInstance } from "../../domain/synth/synth";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store/store";
import { AppState } from "@/store/types";
import { mergeClasses } from "@/utils/mergeClasses";
import { InputLabeled } from "@core/InputLabeled";
import { shallow } from "zustand/vanilla/shallow";

const selector = (state: AppState) => ({
  nodes: state.nodes.length,
  edges: state.edges.length,
  // todo: reduced elementary data here
});

export type SynthRendererProps = {
  synth?: Synth;
  className?: string;
};

export const SynthRenderer: FC<SynthRendererProps> = ({
  synth = synthInstance,
  className,
}) => {
  const { nodes, edges } = useStore(useShallow(selector));
  // const nodes = useStore((state) => state.nodes.length);
  // const edges = useStore((state) => state.edges.length);
  // const nodes = 1;
  // const edges = 1;
  useEffect(() => {
    console.log("SynthRenderer useEffect", synth.ctx.state);
  }, [synth]);
  // console.log("SynthRenderer", nodes, edges);
  return (
    <div
      className={mergeClasses("SynthRenderer", className)}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <InputLabeled label="Nodes" type="text" value={nodes} disabled />
      <InputLabeled label="Edges" type="text" value={edges} disabled />
    </div>
  );
};
