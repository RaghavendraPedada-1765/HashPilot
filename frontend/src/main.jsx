import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";

import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { BenchmarkSocketProvider } from "./context/BenchmarkSocketContext";

import "./index.css";

// In Electron the frontend is loaded via file:// protocol.
// BrowserRouter relies on the HTTP server for path-based routing and shows
// a 404 for any route other than "/".  HashRouter uses #/path which works
// correctly with file:// — so we switch automatically in desktop mode.
const isDesktop =
  typeof window !== "undefined" && window.hashpilot?.isDesktop === true;

const Router = isDesktop ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      {/*
        BenchmarkSocketProvider opens ONE WebSocket for the whole app.
        All components subscribe via useBenchmarkSocket() without opening
        additional connections — this fixes the "Invalid Frame Header" bug.
      */}
      <BenchmarkSocketProvider>
        <Router>
          <App />
        </Router>
      </BenchmarkSocketProvider>
    </ThemeProvider>
  </React.StrictMode>
);