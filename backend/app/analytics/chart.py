"""
HashPilot

Benchmark Chart Generator
"""

import json
from pathlib import Path
import matplotlib.pyplot as plt


class BenchmarkChart:

    def create(self, json_file):

        with open(json_file, "r") as f:
            data = json.load(f)

        strategies = [item["strategy"] for item in data]
        hashrates = [item["hashrate"] for item in data]

        plt.figure(figsize=(10, 6))

        plt.bar(strategies, hashrates)

        plt.title("HashPilot Benchmark")
        plt.xlabel("Strategy")
        plt.ylabel("Hash Rate (H/s)")

        plt.tight_layout()

        output = Path(json_file).with_suffix(".png")

        plt.savefig(output)

        plt.close()

        return output