// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./router";
import "./index.css"; // optional: create to style basics

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
