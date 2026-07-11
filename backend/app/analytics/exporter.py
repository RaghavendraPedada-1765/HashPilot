"""
HashPilot

Benchmark Exporter
"""

import json
from datetime import datetime
from pathlib import Path


class BenchmarkExporter:

    def __init__(self):

        self.folder = Path("benchmarks")
        self.folder.mkdir(exist_ok=True)

    def export(self, results):

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        filename = self.folder / f"benchmark_{timestamp}.json"

        with open(filename, "w") as f:
            json.dump(results, f, indent=4)

        return filename
