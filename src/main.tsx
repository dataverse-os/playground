import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { DataverseContextProvider } from "@dataverse/hooks";
import { PlaygroundContextProvider } from "./context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <DataverseContextProvider>
    <PlaygroundContextProvider>
      <App />
    </PlaygroundContextProvider>
  </DataverseContextProvider>,
);
