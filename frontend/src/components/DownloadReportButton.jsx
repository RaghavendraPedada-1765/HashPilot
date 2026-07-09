import api from "../api/api";

export default function DownloadReportButton({
  difficulty,
  threads,
  processes,
}) {

  async function downloadReport() {

    try {

      const response = await api.get("/report", {

        params: {

          difficulty,

          threads,

          processes,

        },

        responseType: "blob",

      });

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        "HashPilot_Report.pdf"
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    }

    catch (err) {

      console.error(err);

      alert("Failed to download report.");

    }

  }

  return (

    <button

      onClick={downloadReport}

      style={{

        background: "#059669",

        color: "white",

        padding: "14px 28px",

        border: "none",

        borderRadius: "12px",

        cursor: "pointer",

        fontSize: "16px",

        fontWeight: "bold",

      }}

    >

      📄 Download Report

    </button>

  );

}