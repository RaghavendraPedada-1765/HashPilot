# -*- mode: python ; coding: utf-8 -*-
# HashPilot — PyInstaller spec file
# Usage:  pyinstaller hashpilot_server.spec
# Output: dist/hashpilot_server/hashpilot_server.exe

import sys
from pathlib import Path
import os

block_cipher = None

# ---------------------------------------------------------------------------
# Conditionally include ML model files (may not exist on a fresh build)
# ---------------------------------------------------------------------------
_ml_datas = []
for _pkl in ["ml/strategy_model.pkl", "ml/label_encoder.pkl"]:
    if Path(_pkl).exists():
        _ml_datas.append((_pkl, "ml"))

# ---------------------------------------------------------------------------
# Analysis
# ---------------------------------------------------------------------------
a = Analysis(
    ["run_server.py"],
    pathex=[str(Path(".").resolve())],
    binaries=[],
    datas=_ml_datas,
    hiddenimports=[
        # multiprocessing freeze_support (critical for Windows frozen builds)
        "multiprocessing.spawn",
        "multiprocessing.forkserver",
        # scikit-learn internals that PyInstaller misses
        "sklearn.tree._classes",
        "sklearn.tree._criterion",
        "sklearn.tree._splitter",
        "sklearn.ensemble._forest",
        "sklearn.ensemble._gb",
        "sklearn.utils._cython_blas",
        "sklearn.neighbors.typedefs",
        "sklearn.neighbors.quad_tree",
        "sklearn.tree._utils",
        # SQLAlchemy dialects
        "sqlalchemy.dialects.sqlite",
        # uvicorn
        "uvicorn.logging",
        "uvicorn.loops",
        "uvicorn.loops.auto",
        "uvicorn.protocols",
        "uvicorn.protocols.http",
        "uvicorn.protocols.http.auto",
        "uvicorn.protocols.websockets",
        "uvicorn.protocols.websockets.auto",
        "uvicorn.lifespan",
        "uvicorn.lifespan.on",
        # app modules
        "app.api.analytics",
        "app.api.benchmark",
        "app.api.history",
        "app.api.predict",
        "app.api.report",
        "app.api.system",
        "app.api.websocket",
        "app.models.benchmark_model",
        "app.models.ml_training_model",
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=["psycopg2", "psycopg2-binary", "tkinter", "test"],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name="hashpilot_server",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,           # no console window in desktop mode
    disable_windowed_traceback=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=None,               # electron-builder provides the icon at install time
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name="hashpilot_server",
)
