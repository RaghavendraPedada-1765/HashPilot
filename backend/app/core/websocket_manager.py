import asyncio
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.connections = []
        self.loop = None

    async def connect(self, websocket: WebSocket):
        if self.loop is None:
            self.loop = asyncio.get_running_loop()
        await websocket.accept()
        self.connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.connections:
            self.connections.remove(websocket)

    async def broadcast(self, message: dict):
        disconnected = []

        for ws in self.connections:
            try:
                await ws.send_json(message)
            except Exception:
                disconnected.append(ws)

        for ws in disconnected:
            self.disconnect(ws)


manager = ConnectionManager()