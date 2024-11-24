import { Controls, MiniMap, ReactFlow } from "@xyflow/react";
import s from "@/App.module.css";
import React from "react";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";
import { AppState } from "@/store/types";
import { WaveGeneratorNode } from "@flow/WaveGeneratorNode";
import { OutputNode } from "@flow/OutputNode";
import { useOnDrop } from "@/components/dragAndDrop/onDrop";
import { useOnDragOver } from "@/components/dragAndDrop/onDragOver";
import { SliderNode } from "@flow/SliderNode";
import { SampleNode } from "@flow/SampleNode";

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

const nodeTypes = {
  waveGenerator: WaveGeneratorNode,
  output: OutputNode,
  slider: SliderNode,
  sample: SampleNode,
};

export function SynthFlow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
    useShallow(selector),
  );

  const onDragOver = useOnDragOver();
  const onDrop = useOnDrop();

  return (
    <ReactFlow
      className={s.flow}
      nodeTypes={nodeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDrop={onDrop}
      onDragOver={onDragOver}
      fitView
    >
      {/*<HeaderToolbar />*/}
      <MiniMap
        // nodeColor={nodeColor}
        nodeStrokeWidth={3}
        zoomable
        pannable
        bgColor={"#00000022"}
      />
      <Controls />
    </ReactFlow>
  );
}
