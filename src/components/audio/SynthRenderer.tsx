import { FC } from "react";
import { Synth, synth as synthInstance } from "../../domain/synth/synth";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/react/shallow";
import { AppState } from "../../store/types";

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export type SynthRendererProps = {
  synth?: Synth;
};

export const SynthRenderer: FC<SynthRendererProps> = ({
  synth = synthInstance,
}) => {
  const { nodes, edges } = useStore(useShallow(selector));
  return (
    <div>
      <div>
        Nodes<span>{nodes.length}</span>
      </div>
      <div>
        Edges<span>{edges.length}</span>
      </div>
    </div>
  );
};
