"""
HashPilot Report API
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.services.ai_service import AIService
from app.services.benchmark_service import BenchmarkService
from app.services.report_service import ReportService
from app.services.system_service import SystemService

router = APIRouter(
    prefix="/report",
    tags=["Report"],
)

service = BenchmarkService()


@router.get("/")
def generate_report(
    difficulty: int = 4,
    threads: int = 4,
    processes: int = 4,
):
    """
    Run a benchmark and generate a PDF report.
    """

    results = service.run(
        difficulty=difficulty,
        threads=threads,
        processes=processes,
    )

    if not results:
        raise HTTPException(status_code=404, detail="No benchmark results found.")

    analysis = AIService.analyze(results)

    system_info = SystemService.get_info()

    pdf = ReportService.generate_report(
        results,
        analysis,
        system_info,
    )

    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=HashPilot_Report.pdf"},
    )
