import { FaCheckCircle, FaSpinner, FaClock } from "react-icons/fa";

export default function ProgressPanel({
  loading,
  progress,
  stage,
}) {
  if (!loading) return null;

  const steps = [
    "Sequential",
    "Random",
    "MultiThread",
    "MultiProcess",
  ];

  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "20px",
        padding: "30px",
        marginBottom: "35px",
        border: "1px solid #334155",
        boxShadow: "0 12px 30px rgba(0,0,0,.35)",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
        }}
      >
        🚀 Running Benchmark
      </h2>

      <div
        style={{
          width: "100%",
          height: "14px",
          background: "#1e293b",
          borderRadius: "999px",
          overflow: "hidden",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background:
              "linear-gradient(90deg,#2563eb,#06b6d4)",
            transition: "0.4s",
          }}
        />
      </div>

      <h3
        style={{
          marginBottom: "20px",
          color: "#38bdf8",
        }}
      >
        {progress}%
      </h3>

      {steps.map((step, index) => {
        let icon = <FaClock color="#94a3b8" />;
        let color = "#94a3b8";

        if (index < stage) {
          icon = <FaCheckCircle color="#22c55e" />;
          color = "#22c55e";
        } else if (index === stage) {
          icon = <FaSpinner
            className="animate-spin"
            color="#38bdf8"
          />;
          color = "#38bdf8";
        }

        return (
          <div
            key={step}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "14px",
              color,
              fontWeight: 600,
            }}
          >
            {icon}
            {step}
          </div>
        );
      })}
    </div>
  );
}