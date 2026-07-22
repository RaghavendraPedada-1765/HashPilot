param(
    [switch]$Clean
)

$ErrorActionPreference = "Stop"

# Paths
$Root        = Split-Path -Parent $PSScriptRoot
$BackendDir  = Join-Path $Root "backend"
$FrontendDir = Join-Path $Root "frontend"
$DesktopDir  = Join-Path $Root "desktop"
$DistDir     = Join-Path $Root "dist-desktop"
$VenvDir     = Join-Path $BackendDir ".venv"
$PipExe      = Join-Path $VenvDir "Scripts\pip.exe"
$PyiExe      = Join-Path $VenvDir "Scripts\pyinstaller.exe"

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  HashPilot Desktop -- Windows Build     " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# ---------------------------------------------------------------------------
# Clean (optional)
# ---------------------------------------------------------------------------
if ($Clean) {
    Write-Host "[CLEAN] Removing previous build artifacts..." -ForegroundColor Yellow
    foreach ($path in @(
        (Join-Path $BackendDir "dist"),
        (Join-Path $BackendDir "build"),
        (Join-Path $FrontendDir "dist"),
        $DistDir
    )) {
        if (Test-Path $path) {
            Remove-Item $path -Recurse -Force
            Write-Host "  Removed: $path"
        }
    }
}

# ---------------------------------------------------------------------------
# Step 1 -- Python venv + dependencies
# ---------------------------------------------------------------------------
Write-Host "[1/4] Installing backend Python dependencies..." -ForegroundColor Green
Set-Location $BackendDir

if (-not (Test-Path $VenvDir)) {
    Write-Host "  Creating virtual environment..."
    python -m venv .venv
}

& $PipExe install -r requirements.txt --quiet
& $PipExe install pyinstaller --quiet
Write-Host "  Done: backend dependencies installed."

# ---------------------------------------------------------------------------
# Step 2 -- PyInstaller
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host "[2/4] Bundling Python backend with PyInstaller..." -ForegroundColor Green

# Warn if ML models are missing (not a hard failure)
foreach ($model in @(
    (Join-Path $BackendDir "ml\strategy_model.pkl"),
    (Join-Path $BackendDir "ml\label_encoder.pkl")
)) {
    if (-not (Test-Path $model)) {
        Write-Warning "ML model not found: $model"
        Write-Warning "The app will still work -- train the model from inside the app after first launch."
    }
}

& $PyiExe hashpilot_server.spec --noconfirm
Write-Host "  Done: backend bundled to backend\dist\hashpilot_server\"

# ---------------------------------------------------------------------------
# Step 3 -- Vite frontend build
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host "[3/4] Building React frontend..." -ForegroundColor Green
Set-Location $FrontendDir

if (-not (Test-Path (Join-Path $FrontendDir "node_modules"))) {
    Write-Host "  Installing npm packages..."
    npm install
}

npm run build
Write-Host "  Done: frontend built to frontend\dist\"

# ---------------------------------------------------------------------------
# Step 4 -- electron-builder
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host "[4/4] Building Windows installer with electron-builder..." -ForegroundColor Green
Set-Location $DesktopDir

if (-not (Test-Path (Join-Path $DesktopDir "node_modules"))) {
    Write-Host "  Installing Electron packages..."
    npm install
}

npm run dist:win
Write-Host "  Done: installer built to dist-desktop\"

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
Set-Location $Root
Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "  Build Complete!                        " -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Installer location:" -ForegroundColor White
Write-Host "  $DistDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "Look for:  HashPilot Setup *.exe" -ForegroundColor White
Write-Host ""
