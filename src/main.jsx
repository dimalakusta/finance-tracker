import React from "react";
import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import App from "./App";

import "./index.css";

import {
  FinanceProvider,
} from "./context/FinanceContext";

import {
  SettingsProvider,
} from "./context/SettingsContext";


ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <BrowserRouter>

      <SettingsProvider>

        <FinanceProvider>

          <App />

        </FinanceProvider>

      </SettingsProvider>

    </BrowserRouter>

  </React.StrictMode>
);