import { FaMicrochip, FaMemory, FaWindows, FaPython, FaServer, FaDesktop } from "react-icons/fa";

export default function SystemInfo({ info }) {

  if (!info) return null;

  const cardStyle = {
    background: "#111827",
    borderRadius: "18px",
    padding: "30px",
    marginBottom: "30px",
    border: "1px solid #334155",
    boxShadow: "0 15px 35px rgba(0,0,0,.35)"
  };

  const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 0",
    borderBottom: "1px solid #1e293b"
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#94a3b8",
    fontWeight: 600
  };

  const valueStyle = {
    color: "white",
    fontWeight: 700
  };

  return (

    <div style={cardStyle}>

      <h2
        style={{
          marginBottom: "25px",
          color: "#38bdf8"
        }}
      >
        🖥 System Information
      </h2>

      <div style={rowStyle}>
        <span style={labelStyle}>
          <FaMicrochip />
          CPU
        </span>

        <span style={valueStyle}>
          {info.cpu || "Unknown"}
        </span>
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>
          <FaDesktop />
          Physical Cores
        </span>

        <span style={valueStyle}>
          {info.physical_cores}
        </span>
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>
          <FaServer />
          Logical Threads
        </span>

        <span style={valueStyle}>
          {info.logical_threads}
        </span>
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>
          <FaMemory />
          RAM
        </span>

        <span style={valueStyle}>
          {info.ram_gb} GB
        </span>
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>
          <FaWindows />
          Operating System
        </span>

        <span style={valueStyle}>
          {info.os}
        </span>
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>
          <FaPython />
          Python
        </span>

        <span style={valueStyle}>
          {info.python}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "14px"
        }}
      >
        <span style={labelStyle}>
          Architecture
        </span>

        <span style={valueStyle}>
          {info.architecture}
        </span>
      </div>

    </div>

  );

}