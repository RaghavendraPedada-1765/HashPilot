import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-lg",
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </>
  );
}

export default App;