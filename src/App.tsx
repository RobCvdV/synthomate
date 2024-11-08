import React from "react";
import { useShallow } from "zustand/react/shallow";
import { ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import s from "./App.module.css";

import useStore from "store/store";
import { AppState } from "store/types";
import ColorChooserNode from "./components/flow/ColorChooseNode";

const nodeTypes = { colorChooser: ColorChooserNode };

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

function App() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
    useShallow(selector),
  );

  return (
    <div className={s.App}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
}

export default App;
