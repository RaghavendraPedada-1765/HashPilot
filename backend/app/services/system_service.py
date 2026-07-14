"""
HashPilot System Information Service
"""

import platform

import psutil


def _get_cpu_name() -> str:
    """
    Return a human-readable CPU name.
    platform.processor() is often empty on Linux cloud VMs (e.g. AWS/Render),
    so we fall back to reading /proc/cpuinfo, then the architecture string.
    """
    name = platform.processor().strip()
    if name:
        return name

    # Linux fallback: parse /proc/cpuinfo for "model name"
    try:
        with open("/proc/cpuinfo", "r") as f:
            for line in f:
                if line.lower().startswith("model name"):
                    return line.split(":", 1)[1].strip()
    except OSError:
        pass

    # Last resort: return architecture (e.g. "x86_64")
    return platform.machine() or "Unknown"


class SystemService:

    @staticmethod
    def get_info():

        memory = psutil.virtual_memory()

        return {
            "cpu": _get_cpu_name(),
            "physical_cores": psutil.cpu_count(logical=False),
            "logical_threads": psutil.cpu_count(logical=True),
            "ram_gb": round(memory.total / (1024**3), 2),
            "os": f"{platform.system()} {platform.release()}",
            "python": platform.python_version(),
            "architecture": platform.machine(),
            "hostname": platform.node(),
        }
