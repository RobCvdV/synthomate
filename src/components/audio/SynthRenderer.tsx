import { FC } from "react";
import { Synth, synth as synthInstance } from "../../domain/synth/synth";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store/store";
import { AppState } from "@/store/types";
import { mergeClasses } from "@/utils/mergeClasses";
import { InputLabeled } from "@core/InputLabeled";

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export type SynthRendererProps = {
  synth?: Synth;
  className?: string;
};

export const SynthRenderer: FC<SynthRendererProps> = ({
  synth = synthInstance,
  className,
}) => {
  // const { nodes, edges } = useStore(selector);
  const { nodes, edges } = useStore(useShallow(selector));
  console.log("SynthRenderer", nodes, edges);
  return (
    <div
      className={mergeClasses("SynthRenderer", className)}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <InputLabeled label="Nodes" type="text" value={nodes.length} disabled />
      <InputLabeled label="Edges" type="text" value={edges.length} disabled />
    </div>
  );
};
