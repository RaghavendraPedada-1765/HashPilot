const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000";
const DEFAULT_BENCHMARK_WS_PATH = "/ws/benchmark";

/**
 * Resolve the API base URL.
 *
 * Priority:
 *  1. Electron desktop mode  → always http://127.0.0.1:8000 (local backend)
 *  2. VITE_API_BASE_URL env  → custom URL set at build time (staging/prod)
 *  3. Default                → http://127.0.0.1:8000
 */
function resolveApiBaseUrl() {
  // window.hashpilot is injected by desktop/preload.js when running in Electron
  if (typeof window !== "undefined" && window.hashpilot?.isDesktop) {
    return DEFAULT_API_BASE_URL;
  }
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
}

export const API_BASE_URL = resolveApiBaseUrl();

export function getBenchmarkSocketUrl() {
  if (import.meta.env.VITE_BENCHMARK_WS_URL && !window.hashpilot?.isDesktop) {
    return import.meta.env.VITE_BENCHMARK_WS_URL;
  }

  const apiUrl = new URL(API_BASE_URL);
  apiUrl.protocol = apiUrl.protocol === "https:" ? "wss:" : "ws:";
  apiUrl.pathname = DEFAULT_BENCHMARK_WS_PATH;
  apiUrl.search = "";
  apiUrl.hash = "";

  return apiUrl.toString();
}
