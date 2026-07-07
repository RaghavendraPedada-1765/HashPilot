"""
HashPilot Configuration Loader
"""

from pathlib import Path
import yaml


class Config:

    def __init__(self, filename="config.yaml"):

        self.path = Path(filename)

        if not self.path.exists():
            raise FileNotFoundError(f"{filename} not found.")

        with open(self.path, "r") as f:
            self.data = yaml.safe_load(f)

    @property
    def puzzle(self):
        return self.data["puzzle"]

    @property
    def benchmark(self):
        return self.data["benchmark"]

    @property
    def output(self):
        return self.data["output"]

    @property
    def project(self):
        return self.data["project"]