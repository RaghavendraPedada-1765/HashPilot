"""
HashPilot System Information Service
"""

import platform

import psutil


class SystemService:

    @staticmethod
    def get_info():

        memory = psutil.virtual_memory()

        return {
            "cpu": platform.processor(),
            "physical_cores": psutil.cpu_count(logical=False),
            "logical_threads": psutil.cpu_count(logical=True),
            "ram_gb": round(memory.total / (1024**3), 2),
            "os": f"{platform.system()} {platform.release()}",
            "python": platform.python_version(),
            "architecture": platform.machine(),
            "hostname": platform.node(),
        }
