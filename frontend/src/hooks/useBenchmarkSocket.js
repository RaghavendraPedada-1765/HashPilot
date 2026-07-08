import { useEffect, useRef } from "react";

export default function useBenchmarkSocket(onMessage) {

  const socket = useRef(null);

  useEffect(() => {

    socket.current = new WebSocket(
      "ws://127.0.0.1:8000/ws/benchmark"
    );

    socket.current.onmessage = (event) => {
      onMessage(JSON.parse(event.data));
    };

    socket.current.onopen = () => {
      socket.current.send("connect");
    };

    return () => socket.current.close();

  }, []);

}