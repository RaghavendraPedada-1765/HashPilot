# HashPilot Desktop — Build Guide

> **Platform:** Windows 10/11 (x64) — macOS/Linux support planned

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Python | 3.13+ | https://python.org |
| Node.js | 20+ | https://nodejs.org |
| Git | any | https://git-scm.com |

> **Note:** You do **not** need Docker to build the desktop app.

---

## Quick Build (Windows)

From the project root, run the one-shot build script:

```powershell
.\scripts\build-desktop.ps1
```

For a full clean rebuild:

```powershell
.\scripts\build-desktop.ps1 -Clean
```

The finished installer will be at:

```
dist-desktop\HashPilot Setup 1.0.0.exe
```

---

## Manual Step-by-Step Build

If you prefer to run each step yourself:

### Step 1 — Bundle the Python backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
pip install pyinstaller
pyinstaller hashpilot_server.spec --noconfirm
```

**Output:** `backend/dist/hashpilot_server/hashpilot_server.exe`

### Step 2 — Build the React frontend

```powershell
cd frontend
npm install
npm run build
```

**Output:** `frontend/dist/index.html` + assets

### Step 3 — Build the Windows installer

```powershell
cd desktop
npm install
npm run dist:win
```

**Output:** `dist-desktop/HashPilot Setup 1.0.0.exe`

---

## Development Mode (without building the full installer)

You can run the Electron shell pointing at a **pre-built backend exe** without packaging:

```powershell
# Terminal 1 — run the backend exe directly
backend\dist\hashpilot_server\hashpilot_server.exe

# Terminal 2 — start Electron in dev mode
cd desktop
npm install
npx electron . --dev
```

This opens the native Electron window loading `frontend/dist/index.html`.

---

## Architecture

```
dist-desktop\HashPilot Setup 1.0.0.exe
  └── installs to C:\Users\<you>\AppData\Local\Programs\HashPilot\
        ├── HashPilot.exe          (Electron shell)
        ├── resources\
        │   ├── hashpilot_server\  (PyInstaller bundle)
        │   │   └── hashpilot_server.exe
        │   └── frontend\          (Vite build)
        │       └── index.html
        └── ...
```

User data (SQLite DB) is stored separately at:

```
C:\Users\<you>\AppData\Roaming\HashPilot\hashpilot.db
```

This path is **outside the install directory** so it survives app updates.

---

## Releasing a New Version

1. Update the version in `desktop/package.json`
2. Commit and push:
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```
3. GitHub Actions automatically builds and publishes the release

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `hashpilot_server.exe not found` | Run Step 1 (PyInstaller) first |
| Backend takes >30s to start | Kill any leftover processes on port 8000 |
| Blank white window | Ensure `frontend/dist/index.html` exists |
| ML model missing warning | Normal on first launch — train from the app |
| `psycopg2` import error | This package is excluded from desktop builds |
