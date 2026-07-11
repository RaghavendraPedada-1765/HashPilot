import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// ─── Lazy-loaded pages for code splitting ─────────────────────────────────────
const Dashboard = lazy(() => import("./pages/Dashboard"));
const History   = lazy(() => import("./pages/History"));
const Analytics = lazy(() => import("./pages/Analytics"));
const NotFound  = lazy(() => import("./pages/NotFound"));

// ─── Minimal suspense fallback ─────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-slate-500 tracking-widest uppercase">
          Loading
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-lg",
          success: {
            iconTheme: { primary: "#22c55e", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/history"   element={<History />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*"          element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;