/**
 * HashPilot Desktop — Electron Preload Script
 *
 * Runs in the renderer process with a privileged context before the page loads.
 * Uses contextBridge to safely expose only what the frontend needs.
 *
 * Security rules:
 *  - contextIsolation: true   (renderer cannot access Node.js directly)
 *  - nodeIntegration: false   (no require() in the renderer)
 *  - sandbox: true            (additional OS-level sandboxing)
 */

"use strict";

const { contextBridge } = require("electron");

// Expose a minimal, typed API surface to the renderer process.
contextBridge.exposeInMainWorld("hashpilot", {
  /** Runtime platform info (useful for platform-specific UI tweaks) */
  platform: process.platform,

  /** App version injected by electron-builder via package.json */
  version: process.env.npm_package_version || "1.0.0",

  /**
   * Tell the renderer it's running inside Electron.
   * The frontend uses this to always point API calls at localhost:8000
   * instead of reading VITE_API_BASE_URL.
   */
  isDesktop: true,
});
