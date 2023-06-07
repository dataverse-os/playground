import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { Context, contextStore } from "./context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Context.Provider value={contextStore}>
    <App />
  </Context.Provider>
);
