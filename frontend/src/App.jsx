import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Analytics from "./pages/Analytics";

export default function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Dashboard />}
      />

      <Route
        path="/history"
        element={<History />}
      />

      <Route
        path="/analytics"
        element={<Analytics />}
      />

    </Routes>

  );

}