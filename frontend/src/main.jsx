import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { BenchmarkSocketProvider } from "./context/BenchmarkSocketContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      {/*
        BenchmarkSocketProvider opens ONE WebSocket for the whole app.
        All components subscribe via useBenchmarkSocket() without opening
        additional connections — this fixes the "Invalid Frame Header" bug.
      */}
      <BenchmarkSocketProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </BenchmarkSocketProvider>
    </ThemeProvider>
  </React.StrictMode>
);