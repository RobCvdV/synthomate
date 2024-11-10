import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { DndProvider } from "@/components/dragAndDrop/DndContext";
import { ReactFlowProvider } from "@xyflow/react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <ReactFlowProvider>
      <DndProvider>
        <App />
      </DndProvider>
    </ReactFlowProvider>
  </React.StrictMode>,
);
