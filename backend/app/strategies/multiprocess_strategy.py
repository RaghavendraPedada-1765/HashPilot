"""
HashPilot

Multiprocessing Search Strategy
"""

import multiprocessing as mp
import threading
import time

from app.strategies.base_strategy import Strategy
from app.utils.hashing import sha256


def worker(start, step, data, difficulty, found, result, total_attempts, lock, queue, start_time):

    nonce = start
    local_attempts = 0

    while not found.is_set():

        candidate = f"{data}{nonce}"
        hash_value = sha256(candidate)

        local_attempts += 1

        if local_attempts % 1000 == 0:
            with lock:
                total_attempts.value += 1000
                current_total = total_attempts.value

            if queue is not None and current_total % 10000 == 0:
                elapsed = time.perf_counter() - start_time
                hashrate = current_total / elapsed if elapsed > 0 else 0
                queue.put(
                    {
                        "event": "progress",
                        "strategy": "MultiProcessStrategy",
                        "attempts": current_total,
                        "nonce": nonce,
                        "hashrate": round(hashrate, 2),
                        "elapsed": round(elapsed, 3),
                    }
                )

        if hash_value.startswith("0" * difficulty):

            with lock:

                if not found.is_set():
                    result["nonce"] = nonce
                    result["hash"] = hash_value
                    result["attempts"] = total_attempts.value + (local_attempts % 1000)

                    found.set()

            return

        nonce += step


class MultiProcessStrategy(Strategy):

    def __init__(self, processes=4):
        self.processes = processes

    def solve(self, puzzle, progress_callback=None):

        manager = mp.Manager()

        found = manager.Event()
        result = manager.dict()
        total_attempts = manager.Value("i", 0)
        lock = manager.Lock()

        queue = manager.Queue() if progress_callback else None
        start_time = time.perf_counter()

        # We need a way to stop the monitor thread
        stop_monitor = threading.Event()

        def monitor():
            while not stop_monitor.is_set():
                try:
                    # Use timeout to allow checking stop_monitor
                    msg = queue.get(timeout=0.1)
                    if progress_callback:
                        progress_callback(msg)
                except Exception:
                    continue

        monitor_thread = None
        if queue is not None:
            monitor_thread = threading.Thread(target=monitor, daemon=True)
            monitor_thread.start()

        jobs = []

        for i in range(self.processes):

            p = mp.Process(
                target=worker,
                args=(
                    i,
                    self.processes,
                    puzzle.data,
                    puzzle.difficulty(),
                    found,
                    result,
                    total_attempts,
                    lock,
                    queue,
                    start_time,
                ),
            )

            jobs.append(p)
            p.start()

        for p in jobs:
            p.join()

        if monitor_thread:
            stop_monitor.set()
            monitor_thread.join(timeout=1.0)

        # In case a worker found it before it could update total_attempts accurately
        attempts = result.get("attempts", total_attempts.value)

        return (
            result.get("nonce"),
            result.get("hash"),
            attempts,
        )
