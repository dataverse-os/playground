import React from "react";
import ReactDOM from "react-dom/client";

import { DataverseContextProvider } from "@dataverse/hooks";

import App from "./App";
import { PlaygroundContextProvider } from "./context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <DataverseContextProvider>
    <PlaygroundContextProvider>
      <App />
    </PlaygroundContextProvider>
  </DataverseContextProvider>,
);
