"""
HashPilot Backend Launcher
--------------------------
Entry-point used by PyInstaller (see hashpilot_server.spec).
In desktop mode Electron spawns this executable directly.

Environment variables:
  HASHPILOT_PORT   - Port to listen on (default: 8000)
  HASHPILOT_HOST   - Host to bind to   (default: 127.0.0.1)
"""

import multiprocessing
import os
import sys


def _fix_frozen_paths() -> None:
    """
    In a PyInstaller one-dir bundle all modules live in _internal/ next to
    the .exe.  We must prepend that directory to sys.path so that
    `from app.main import app` resolves correctly.
    """
    if not getattr(sys, "frozen", False):
        return

    exe_dir = os.path.dirname(sys.executable)

    # _internal/ is where PyInstaller >=6 puts all bundled .pyc files
    internal_dir = os.path.join(exe_dir, "_internal")
    if os.path.isdir(internal_dir) and internal_dir not in sys.path:
        sys.path.insert(0, internal_dir)

    # _MEIPASS is the temp extraction dir (always present, may overlap)
    meipass = getattr(sys, "_MEIPASS", "")
    if meipass and meipass not in sys.path:
        sys.path.insert(0, meipass)

    # exe dir itself as last-resort fallback
    if exe_dir not in sys.path:
        sys.path.append(exe_dir)


def main() -> None:
    _fix_frozen_paths()

    host = os.getenv("HASHPILOT_HOST", "127.0.0.1")
    port = int(os.getenv("HASHPILOT_PORT", "8000"))

    # Import the FastAPI app object directly — passing it as an object to
    # uvicorn.run() bypasses the string-based module import that fails in
    # PyInstaller bundles because uvicorn uses importlib.import_module().
    import uvicorn

    from app.main import app  # noqa: PLC0415

    uvicorn.run(
        app,
        host=host,
        port=port,
        log_level="info",
        # Disable uvicorn's dictConfig-based logging — it references handlers
        # that don't exist in a PyInstaller frozen environment and causes
        # "Unable to configure formatter 'default'" crash dialogs.
        log_config=None,
    )


if __name__ == "__main__":
    # -----------------------------------------------------------------------
    # CRITICAL for PyInstaller + multiprocessing on Windows:
    # freeze_support() MUST be called before anything else in __main__.
    # Without it, each spawned worker process re-executes the entire
    # entry point instead of running the worker function, causing the
    # MultiProcess strategy to hang indefinitely at 75%.
    # -----------------------------------------------------------------------
    multiprocessing.freeze_support()

    # Force 'spawn' start method (default on Windows, but be explicit so
    # PyInstaller's frozen import hooks are triggered correctly in workers).
    if sys.platform == "win32":
        multiprocessing.set_start_method("spawn", force=True)

    main()
