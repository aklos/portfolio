import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ContextProvider } from "./context";
import App from "./components/App";

const container = document.getElementById("app");

if (!container) {
  throw Error("No #app container element found.");
}

const root = createRoot(container);

root.render(
  <Router>
    <ContextProvider>
      <App />
    </ContextProvider>
  </Router>
);
