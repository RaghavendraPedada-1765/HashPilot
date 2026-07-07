import { NavLink } from "react-router-dom";

export default function Navbar() {

  return (

    <nav className="flex items-center justify-between px-8 py-5 bg-slate-900 border-b border-slate-700">

      <h1 className="text-3xl font-bold text-cyan-400">

        🚀 HashPilot

      </h1>

      <div className="flex gap-8 text-lg">

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-cyan-400 font-bold"
              : "text-slate-300"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            isActive
              ? "text-cyan-400 font-bold"
              : "text-slate-300"
          }
        >
          History
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            isActive
              ? "text-cyan-400 font-bold"
              : "text-slate-300"
          }
        >
          Analytics
        </NavLink>

      </div>

    </nav>

  );

}