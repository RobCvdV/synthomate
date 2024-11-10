import React, { useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { Controls, MiniMap, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import s from "./App.module.css";
import { useStore } from "@/store/store";
import { AppNode, AppState } from "@/store/types";
import { ColorChooserNode } from "@flow/ColorChooserNode";
import { WaveGeneratorNode } from "@flow/WaveGeneratorNode";
import { HeaderToolbar } from "@/components/layout/HeaderToolbar";
import { useOnDrop } from "@/components/dragAndDrop/onDrop";
import { useOnDragOver } from "@/components/dragAndDrop/onDragOver";
import { OutputNode } from "@flow/OutputNode";

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

const nodeColor = (node: AppNode) => {
  return node.type === "colorChooser" ? node.data.color : "gray";
};

const nodeTypes = {
  colorChooser: ColorChooserNode,
  waveGenerator: WaveGeneratorNode,
  output: OutputNode,
};

function App() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
    useShallow(selector),
  );
  const reactFlowWrapper = useRef(null);

  const onDragOver = useOnDragOver();
  const onDrop = useOnDrop();

  return (
    <div className={s.App} ref={reactFlowWrapper}>
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
        <HeaderToolbar />
        <MiniMap
          nodeColor={nodeColor}
          nodeStrokeWidth={3}
          zoomable
          pannable
          bgColor={"#00000022"}
        />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;
