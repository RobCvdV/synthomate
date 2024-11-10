import { StateCreator } from "zustand";
import { AppNode, AppState } from "@/store/types";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from "@xyflow/react";
import { initialNodes } from "./demo-data/nodes";
import { initialEdges } from "./demo-data/edges";
import { ColorNode } from "@/components/flow/ColorChooserNode";

function isColorChooserNode(node: AppNode): node is ColorNode {
  return node.type === "colorChooser";
}

export type FlowSlice = {
  nodes: AppNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNodes: (nodes: AppNode[]) => void;
  clearAll: () => void;

  updateNodeColor: (nodeId: string, color: string) => void;
};

export const createFlowSlice: StateCreator<AppState, [], [], FlowSlice> = (
  set,
  get,
) => ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  setNodes: (nodes) => {
    set({ nodes });
  },
  setEdges: (edges) => {
    set({ edges });
  },
  clearAll: () => {
    set({ nodes: [], edges: [] });
  },

  addNodes: (nodes) => {
    set({ nodes: get().nodes.concat(nodes) });
  },

  updateNodeColor: (nodeId, color) => {
    set({
      nodes: get().nodes.map((node: AppNode) => {
        if (node.id === nodeId && isColorChooserNode(node)) {
          // it's important to create a new object here, to inform React Flow about the changes
          return { ...node, data: { ...node.data, color } };
        }

        return node;
      }),
    });
  },
});
