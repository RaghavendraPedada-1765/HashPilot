import {
  FaBell,
  FaUserCircle,
  FaSearch,
} from "react-icons/fa";

function Navbar() {
  return (
    <header
      style={{
        height: "72px",
        background: "#111827",
        borderBottom: "1px solid #1e293b",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
      }}
    >
      {/* Left Section */}

      <div>

        <h2
          style={{
            margin: 0,
            color: "white",
            fontSize: "24px",
          }}
        >
          🚀 HashPilot Dashboard
        </h2>

        <small
          style={{
            color: "#94a3b8",
          }}
        >
          AI-Powered Computational Benchmark Platform
        </small>

      </div>

      {/* Right Section */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >

        {/* Search */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#1e293b",
            padding: "8px 14px",
            borderRadius: "10px",
            gap: "10px",
            color: "#94a3b8",
          }}
        >
          <FaSearch />

          <input
            type="text"
            placeholder="Search..."
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              outline: "none",
              width: "180px",
            }}
          />
        </div>

        {/* Notifications */}

        <div
          style={{
            cursor: "pointer",
            fontSize: "22px",
            color: "#cbd5e1",
          }}
        >
          <FaBell />
        </div>

        {/* User */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FaUserCircle
            size={34}
            color="#38bdf8"
          />

          <div>

            <div
              style={{
                fontWeight: 600,
              }}
            >
              Raghavendra
            </div>

            <small
              style={{
                color: "#94a3b8",
              }}
            >
              Administrator
            </small>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;