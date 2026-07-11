const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000";
const DEFAULT_BENCHMARK_WS_PATH = "/ws/benchmark";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

export function getBenchmarkSocketUrl() {
  if (import.meta.env.VITE_BENCHMARK_WS_URL) {
    return import.meta.env.VITE_BENCHMARK_WS_URL;
  }

  const apiUrl = new URL(API_BASE_URL);
  apiUrl.protocol = apiUrl.protocol === "https:" ? "wss:" : "ws:";
  apiUrl.pathname = DEFAULT_BENCHMARK_WS_PATH;
  apiUrl.search = "";
  apiUrl.hash = "";

  return apiUrl.toString();
}
