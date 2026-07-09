from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.core.websocket_manager import manager

router = APIRouter()


@router.websocket("/ws/benchmark")
async def websocket_endpoint(websocket: WebSocket):

    print("🔥 WebSocket connection requested")

    await manager.connect(websocket)

    print("✅ Client connected")

    try:
        while True:
            # Only receive heartbeat messages.
            await websocket.receive_text()

    except WebSocketDisconnect:

        print("❌ Client disconnected")

        manager.disconnect(websocket)