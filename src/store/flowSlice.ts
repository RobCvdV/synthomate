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
});
