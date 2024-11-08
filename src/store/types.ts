import {
  BuiltInNode,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";

export type AppNode = ColorNode | BuiltInNode;

export type ColorNode = Node<
  {
    color: string;
  },
  "colorChooser"
>;

export type AppState = {
  nodes: AppNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
};

export type AudioState = {
  updateNodeColor: (nodeId: string, color: string) => void;
};
