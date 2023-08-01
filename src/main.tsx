import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { Context, contextStore } from "./context";
import { DataverseContextProvider } from "@dataverse/hooks";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <DataverseContextProvider>
    <Context.Provider value={contextStore}>
      <App />
    </Context.Provider>
  </DataverseContextProvider>
);
