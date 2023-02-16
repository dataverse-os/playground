import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { DataverseKernel } from "@dataverse/dataverse-kernel";
DataverseKernel.init();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
