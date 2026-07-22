/**
 * HashPilot Desktop — Electron Main Process
 *
 * Responsibilities:
 *  1. Locate and spawn the bundled hashpilot_server.exe as a child process
 *  2. Wait until the FastAPI backend is ready (polls GET /)
 *  3. Open a BrowserWindow loading the bundled React frontend
 *  4. On app quit, cleanly terminate the Python process
 */

"use strict";

const { app, BrowserWindow, dialog, shell } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const BACKEND_PORT = 8000;
const BACKEND_HOST = "127.0.0.1";
const BACKEND_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`;
const HEALTH_CHECK_INTERVAL_MS = 250;
const HEALTH_CHECK_TIMEOUT_MS = 60_000; // 60 seconds (PyInstaller cold start)
const IS_DEV = process.argv.includes("--dev");

// ---------------------------------------------------------------------------
// Globals
// ---------------------------------------------------------------------------
let mainWindow = null;
let backendProcess = null;
let backendReady = false;

// ---------------------------------------------------------------------------
// Resolve resource paths
// ---------------------------------------------------------------------------
function getResourcesPath() {
  // In production (packaged), resources sit next to the .exe in `resources/`
  // In dev, we resolve relative to the desktop/ directory
  if (app.isPackaged) {
    return process.resourcesPath;
  }
  return path.join(__dirname, "..");
}

function getBackendExePath() {
  const resourcesPath = getResourcesPath();
  if (app.isPackaged) {
    return path.join(
      resourcesPath,
      "hashpilot_server",
      "hashpilot_server.exe"
    );
  }
  // Dev: expect a pre-built backend in backend/dist/
  return path.join(
    resourcesPath,
    "backend",
    "dist",
    "hashpilot_server",
    "hashpilot_server.exe"
  );
}

function getFrontendPath() {
  const resourcesPath = getResourcesPath();
  if (app.isPackaged) {
    return path.join(resourcesPath, "frontend", "index.html");
  }
  return path.join(resourcesPath, "frontend", "dist", "index.html");
}

// ---------------------------------------------------------------------------
// Start the Python backend
// ---------------------------------------------------------------------------
function startBackend() {
  const exePath = getBackendExePath();

  if (!fs.existsSync(exePath)) {
    console.error(`[HashPilot] Backend executable not found: ${exePath}`);
    dialog.showErrorBox(
      "HashPilot — Backend Missing",
      `The backend executable was not found at:\n${exePath}\n\nPlease rebuild the application.`
    );
    app.quit();
    return;
  }

  console.log(`[HashPilot] Starting backend: ${exePath}`);

  backendProcess = spawn(exePath, [], {
    env: {
      ...process.env,
      HASHPILOT_HOST: BACKEND_HOST,
      HASHPILOT_PORT: String(BACKEND_PORT),
    },
    stdio: IS_DEV ? "inherit" : "ignore",
    // Don't inherit the parent's stdio in production (no visible console)
    detached: false,
  });

  backendProcess.on("error", (err) => {
    console.error("[HashPilot] Backend process error:", err);
  });

  backendProcess.on("exit", (code, signal) => {
    console.log(`[HashPilot] Backend exited (code=${code}, signal=${signal})`);
    backendProcess = null;
  });
}

// ---------------------------------------------------------------------------
// Poll the backend until it's ready
// ---------------------------------------------------------------------------
function waitForBackend() {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + HEALTH_CHECK_TIMEOUT_MS;

    function attempt() {
      const req = http.get(`${BACKEND_URL}/`, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          retry();
        }
      });
      req.on("error", retry);
      req.setTimeout(500, () => {
        req.destroy();
        retry();
      });
    }

    function retry() {
      if (Date.now() >= deadline) {
        reject(new Error("Backend did not start within 30 seconds"));
        return;
      }
      setTimeout(attempt, HEALTH_CHECK_INTERVAL_MS);
    }

    attempt();
  });
}

// ---------------------------------------------------------------------------
// Create the main browser window
// ---------------------------------------------------------------------------
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: "HashPilot",
    // Use icon from assets (resolved by electron-builder)
    icon: path.join(__dirname, "assets", "icon.png"),
    backgroundColor: "#0f0f13",   // matches the app's dark background
    show: false,                   // show after content loads (avoids flash)
    titleBarStyle: "default",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Load the bundled React frontend
  const frontendPath = getFrontendPath();
  mainWindow.loadFile(frontendPath);

  // Gracefully show once ready
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    if (IS_DEV) mainWindow.webContents.openDevTools();
  });

  // Open external links in the system browser, not Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// ---------------------------------------------------------------------------
// App lifecycle
// ---------------------------------------------------------------------------
app.on("ready", async () => {
  startBackend();

  try {
    console.log("[HashPilot] Waiting for backend to be ready…");
    await waitForBackend();
    backendReady = true;
    console.log("[HashPilot] Backend is ready. Opening window…");
    createWindow();
  } catch (err) {
    dialog.showErrorBox(
      "HashPilot — Startup Failed",
      `The backend server did not start in time.\n\n${err.message}\n\nPlease restart the application.`
    );
    app.quit();
  }
});

app.on("window-all-closed", () => {
  // On macOS it is standard to keep the app running until Cmd+Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null && backendReady) {
    createWindow();
  }
});

// ---------------------------------------------------------------------------
// Clean shutdown — kill the Python process before Electron exits
// ---------------------------------------------------------------------------
app.on("before-quit", () => {
  if (backendProcess) {
    console.log("[HashPilot] Terminating backend process…");
    try {
      backendProcess.kill("SIGTERM");
    } catch (e) {
      // process may have already exited
    }
    backendProcess = null;
  }
});
