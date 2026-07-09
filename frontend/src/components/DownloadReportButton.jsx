import { useState } from "react";
import { CheckCircle, FileText } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/api";
import { Button } from "./ui/Button";

export default function DownloadReportButton({ difficulty, threads, processes }) {
  const [downloading, setDownloading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function downloadReport() {
    setDownloading(true);
    const toastId = toast.loading("Generating PDF Report...");

    try {
      const response = await api.get("/report", {
        params: { difficulty, threads, processes },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `hashpilot_report_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Report downloaded successfully!", { id: toastId });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to download PDF report.", { id: toastId });
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Button
      variant={success ? "secondary" : "primary"}
      onClick={downloadReport}
      disabled={downloading}
      className={`min-w-[200px] shadow-lg transition-all ${success ? "bg-emerald-500 hover:bg-emerald-400 text-slate-900 border-none shadow-[0_0_20px_rgba(16,185,129,0.4)]" : ""}`}
    >
      {downloading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Processing...
        </>
      ) : success ? (
        <>
          <CheckCircle size={18} />
          Downloaded
        </>
      ) : (
        <>
          <FileText size={18} />
          Download PDF Report
        </>
      )}
    </Button>
  );
}
