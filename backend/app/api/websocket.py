"""
HashPilot WebSocket API

Handles the /ws/benchmark endpoint. Each client gets a persistent
connection that receives broadcast events from the benchmark engine.

Production-safe improvements:
  - Proper logger instead of print()
  - Graceful disconnect on WebSocketDisconnect and generic Exception
  - Keepalive ping loop to prevent "Invalid Frame Header" from idle connections
"""

import asyncio

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.core.logger import logger
from app.core.websocket_manager import manager

router = APIRouter(tags=["WebSocket"])

# How often (seconds) to send a server-side ping to keep the connection alive.
_PING_INTERVAL = 25


@router.websocket("/ws/benchmark")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for live benchmark telemetry.

    Clients connect here and receive JSON broadcast messages from the
    benchmark engine (strategy_started, progress, strategy_completed).
    A keepalive ping is sent every 25 s to prevent proxy/browser timeouts
    that cause the 'Invalid Frame Header' error on reconnect.
    """
    await manager.connect(websocket)
    logger.info("WebSocket client connected | total=%d", len(manager.connections))

    # Run the ping loop and the receive loop concurrently.
    # When either exits (client disconnects) the other is cancelled.
    receive_task = asyncio.create_task(_receive_loop(websocket))
    ping_task = asyncio.create_task(_ping_loop(websocket))

    try:
        done, pending = await asyncio.wait(
            {receive_task, ping_task},
            return_when=asyncio.FIRST_COMPLETED,
        )
        for task in pending:
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass
    finally:
        manager.disconnect(websocket)
        logger.info("WebSocket client disconnected | remaining=%d", len(manager.connections))


async def _receive_loop(websocket: WebSocket) -> None:
    """Drain incoming frames from the client (heartbeat/pings)."""
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
    except Exception as exc:
        logger.warning("WebSocket receive error: %s", exc)


async def _ping_loop(websocket: WebSocket) -> None:
    """Send a lightweight ping every _PING_INTERVAL seconds."""
    try:
        while True:
            await asyncio.sleep(_PING_INTERVAL)
            await websocket.send_json({"event": "ping"})
    except Exception:
        # Any send failure means the client is gone — exit silently.
        pass
