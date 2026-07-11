/**
 * BenchmarkSocketContext
 *
 * Provides a SINGLE shared WebSocket connection for the entire app.
 *
 * Problems this solves
 * --------------------
 * Previously both LiveBenchmark.jsx and useBenchmarkSocket.js opened their
 * own WebSocket.  When one closed (e.g. component unmount), the server sent
 * a close frame that the other client misinterpreted as a data frame,
 * producing the "Invalid Frame Header" error and a reconnect loop.
 *
 * React StrictMode race (the screenshot bug)
 * ------------------------------------------
 * StrictMode mounts → unmounts → remounts every component in dev.
 * The old approach used an `intentionalCloseRef` boolean, but the race was:
 *
 *   1. Mount #1  → connect() sets intentionalClose=false, WS opens
 *   2. Unmount #1 → cleanup sets intentionalClose=true, calls ws.close()
 *   3. Mount #2  → connect() sets intentionalClose=false again
 *   4. Old ws.onclose fires (async) → sees intentionalClose=false → schedules reconnect ❌
 *
 * Fix: every call to connect() increments a `connectionId`. The onclose handler
 * captures the id it was created with and silently exits if the active id has
 * moved on — i.e. it's a stale socket from a previous connection attempt.
 *
 * Additional production hardening
 * --------------------------------
 * - Exponential-backoff reconnect (max 30 s delay)
 * - 25-second heartbeat ping (matches server-side ping interval)
 * - Ignores server-side "ping" events so they don't leak into callbacks
 * - Proper cleanup on unmount (cancels timers, closes socket)
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getBenchmarkSocketUrl } from "../config/runtime";

/** @typedef {"connecting" | "connected" | "degraded" | "offline"} ConnectionState */

const BenchmarkSocketContext = createContext(null);

const MAX_BACKOFF_MS = 30_000;
const PING_INTERVAL_MS = 25_000;

export function BenchmarkSocketProvider({ children }) {
  const socketRef      = useRef(null);
  const listenersRef   = useRef(new Set());
  const reconnectTimer = useRef(null);
  const pingTimer      = useRef(null);
  const attemptRef     = useRef(0);

  /**
   * Monotonically-increasing ID.  Each call to connect() claims a new ID.
   * The onclose / onerror handlers capture their ID and bail out if
   * activeIdRef.current has advanced (i.e. they're stale).
   */
  const activeIdRef = useRef(0);

  /** Set to true when the provider itself is unmounting. */
  const destroyedRef = useRef(false);

  const [connectionState, setConnectionState] = useState(
    /** @type {ConnectionState} */ ("connecting")
  );

  // ─── Stable subscribe API ─────────────────────────────────────────────────
  const subscribe = useCallback((fn) => {
    listenersRef.current.add(fn);
    return () => listenersRef.current.delete(fn);
  }, []);

  // ─── Connection factory ───────────────────────────────────────────────────
  function connect() {
    if (destroyedRef.current) return;

    // Cancel any pending reconnect timer.
    clearTimeout(reconnectTimer.current);

    // Silently close the previous socket without triggering its handlers.
    const prev = socketRef.current;
    if (prev) {
      prev.onopen    = null;
      prev.onmessage = null;
      prev.onerror   = null;
      prev.onclose   = null;
      if (prev.readyState === WebSocket.CONNECTING || prev.readyState === WebSocket.OPEN) {
        prev.close();
      }
    }

    // Claim a new connection ID — any onclose from the old socket that fires
    // after this point will carry a stale id and will be ignored.
    const myId = ++activeIdRef.current;
    socketRef.current = null;

    setConnectionState("connecting");

    const ws = new WebSocket(getBenchmarkSocketUrl());
    socketRef.current = ws;

    // ── Open ──────────────────────────────────────────────────────────────
    ws.onopen = () => {
      if (activeIdRef.current !== myId) return; // stale
      setConnectionState("connected");
      attemptRef.current = 0;
      clearInterval(pingTimer.current);
      pingTimer.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.send("ping");
      }, PING_INTERVAL_MS);
    };

    // ── Message ───────────────────────────────────────────────────────────
    ws.onmessage = (event) => {
      if (activeIdRef.current !== myId) return; // stale
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }
      if (data?.event === "ping") return; // server keepalive — ignore
      listenersRef.current.forEach((fn) => {
        try { fn(data); } catch (err) {
          console.error("[BenchmarkSocket] Listener error:", err);
        }
      });
    };

    // ── Error ─────────────────────────────────────────────────────────────
    ws.onerror = () => {
      if (activeIdRef.current !== myId) return;
      setConnectionState("degraded");
    };

    // ── Close ─────────────────────────────────────────────────────────────
    ws.onclose = () => {
      if (activeIdRef.current !== myId) return; // stale — ignore
      clearInterval(pingTimer.current);
      if (destroyedRef.current) return; // unmounting — don't reconnect

      setConnectionState("offline");

      // Exponential backoff with jitter.
      const delay = Math.min(
        1_000 * 2 ** attemptRef.current + Math.random() * 500,
        MAX_BACKOFF_MS
      );
      attemptRef.current += 1;
      console.warn(
        `[BenchmarkSocket] Disconnected. Reconnecting in ${Math.round(delay / 1000)} s…`
      );
      reconnectTimer.current = setTimeout(connect, delay);
    };
  }

  // ─── Mount / unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    destroyedRef.current = false;
    connect();

    return () => {
      // Mark as destroyed BEFORE closing so any async onclose is ignored.
      destroyedRef.current = true;
      // Advance the id so stale handlers bail immediately.
      activeIdRef.current += 1;
      clearTimeout(reconnectTimer.current);
      clearInterval(pingTimer.current);
      const ws = socketRef.current;
      if (ws) {
        ws.onopen = ws.onmessage = ws.onerror = ws.onclose = null;
        if (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = { connectionState, subscribe };

  return (
    <BenchmarkSocketContext.Provider value={value}>
      {children}
    </BenchmarkSocketContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
/**
 * @returns {{ connectionState: ConnectionState, subscribe: (fn: Function) => () => void }}
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useBenchmarkSocketContext() {
  const ctx = useContext(BenchmarkSocketContext);
  if (!ctx) {
    throw new Error(
      "useBenchmarkSocketContext must be used inside <BenchmarkSocketProvider>"
    );
  }
  return ctx;
}
