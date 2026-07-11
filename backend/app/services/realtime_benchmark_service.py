from app.core.websocket_manager import manager


class RealtimeBenchmarkService:

    @staticmethod
    async def send_started(strategy):

        await manager.broadcast({"event": "started", "strategy": strategy})

    @staticmethod
    async def send_progress(strategy, percent):

        await manager.broadcast({"event": "progress", "strategy": strategy, "progress": percent})

    @staticmethod
    async def send_finished(strategy, result):

        await manager.broadcast({"event": "finished", "strategy": strategy, "result": result})

    @staticmethod
    async def send_complete(results):

        await manager.broadcast({"event": "complete", "results": results})
