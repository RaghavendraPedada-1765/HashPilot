import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaHistory,
  FaChartBar,
  FaRocket,
} from "react-icons/fa";

const navStyle = ({ isActive }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "14px 18px",
  marginBottom: "10px",
  borderRadius: "12px",
  textDecoration: "none",
  color: "white",
  backgroundColor: isActive ? "#2563eb" : "transparent",
  transition: "0.3s",
  fontWeight: 600,
});

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "250px",
        background: "#111827",
        borderRight: "1px solid #1e293b",
        minHeight: "100vh",
        padding: "30px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "40px",
        }}
      >
        <FaRocket size={32} color="#38bdf8" />

        <div>
          <h2
            style={{
              margin: 0,
              color: "white",
            }}
          >
            HashPilot
          </h2>

          <small
            style={{
              color: "#94a3b8",
            }}
          >
            v1.0
          </small>
        </div>
      </div>

      <NavLink to="/" style={navStyle}>
        <FaTachometerAlt />
        Dashboard
      </NavLink>

      <NavLink to="/history" style={navStyle}>
        <FaHistory />
        History
      </NavLink>

      <NavLink to="/analytics" style={navStyle}>
        <FaChartBar />
        Analytics
      </NavLink>
    </aside>
  );
}