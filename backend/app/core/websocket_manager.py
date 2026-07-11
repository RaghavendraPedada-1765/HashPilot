"""
HashPilot WebSocket Connection Manager

Thread-safe connection manager used by the benchmark engine to broadcast
real-time events to all connected WebSocket clients.
"""

import asyncio
from typing import List

from fastapi import WebSocket

from app.core.logger import logger


class ConnectionManager:
    """
    Manages active WebSocket connections and broadcasts events to all of them.

    The manager stores the running event loop so that non-async threads
    (strategy workers) can safely schedule coroutines via
    `asyncio.run_coroutine_threadsafe`.
    """

    def __init__(self) -> None:
        self.connections: List[WebSocket] = []
        self.loop: asyncio.AbstractEventLoop | None = None

    async def connect(self, websocket: WebSocket) -> None:
        """Accept a new WebSocket connection and register it."""
        if self.loop is None:
            self.loop = asyncio.get_running_loop()
        await websocket.accept()
        self.connections.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        """Remove a WebSocket connection from the active list."""
        if websocket in self.connections:
            self.connections.remove(websocket)

    async def broadcast(self, message: dict) -> None:
        """
        Send *message* as JSON to every connected client.

        Connections that raise an exception (dropped/closed) are removed
        silently so they do not block future broadcasts.
        """
        disconnected: List[WebSocket] = []

        for ws in list(self.connections):
            try:
                await ws.send_json(message)
            except Exception as exc:
                logger.debug("Broadcast failed for a client — removing: %s", exc)
                disconnected.append(ws)

        for ws in disconnected:
            self.disconnect(ws)


# Singleton instance shared across the application.
manager = ConnectionManager()
