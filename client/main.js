import React from "react";
import Root from "./Root";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { BrowserRouter as Router } from "react-router-dom";
import ReactRoot from "./ReactRoot";


const root = createRoot(document.getElementById("app"));

root.render(
  <Provider store={store}>
    <Router>
      <ReactRoot />
    </Router>
  </Provider>
);
