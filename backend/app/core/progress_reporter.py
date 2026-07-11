class ProgressReporter:
    """
    Lightweight Event Bus for benchmark progress.
    Decouples strategies and the engine from FastAPI and WebSockets.
    """

    def __init__(self):
        self._callbacks = []

    def add_callback(self, callback):
        if callable(callback) and callback not in self._callbacks:
            self._callbacks.append(callback)

    def emit(self, event_data):
        for callback in self._callbacks:
            try:
                callback(event_data)
            except Exception:
                pass
