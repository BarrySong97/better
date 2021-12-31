import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "virtual:windi.css";
import App from "./App";

import { BrowserRouter } from "react-router-dom";
import { setStatusBarStyle } from "./API/statusbar";
import main from "./API/App";

if (import.meta.env.MODE !== "development") {
  setStatusBarStyle();
}

const { habitatController } = main();

// StatusBar.setOverlaysWebView({ overlay: true });
// StatusBar.setBackgroundColor({ color: "transparent" });
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
