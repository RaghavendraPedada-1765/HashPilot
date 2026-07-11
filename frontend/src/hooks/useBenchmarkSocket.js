/**
 * useBenchmarkSocket
 *
 * Subscribes *onMessage* to the shared BenchmarkSocketContext.
 * Does NOT open a new WebSocket — that fixes the dual-connection bug.
 *
 * Usage
 * -----
 * const { connectionState } = useBenchmarkSocket((data) => {
 *   // handle WS event
 * });
 */

import { useEffect, useRef } from "react";
import { useBenchmarkSocketContext } from "../context/BenchmarkSocketContext";

/**
 * @param {(data: object) => void} onMessage  Callback for each WS event.
 * @returns {{ connectionState: string }}
 */
export default function useBenchmarkSocket(onMessage) {
  const { connectionState, subscribe } = useBenchmarkSocketContext();

  // Keep a stable ref so subscribe() never needs to re-run when the
  // parent re-renders with a new inline function reference.
  const callbackRef = useRef(onMessage);
  useEffect(() => {
    callbackRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const unsubscribe = subscribe((data) => {
      callbackRef.current?.(data);
    });
    return unsubscribe;
  }, [subscribe]);

  return { connectionState };
}
