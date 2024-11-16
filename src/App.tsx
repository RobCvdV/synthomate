import React, { useEffect } from "react";
import "@xyflow/react/dist/base.css";
import s from "./App.module.css";
import { HeaderToolbar } from "@/components/layout/HeaderToolbar";
import { SynthFlow } from "@flow/SynthFlow";

let _app = 0;
function App() {
  useEffect(() => {
    console.log("App useEffect", _app++);
  });

  return (
    <div className={s.App}>
      <HeaderToolbar />
      <SynthFlow />
    </div>
  );
}

export default App;
