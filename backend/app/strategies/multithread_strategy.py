"""
HashPilot

Multi-threaded Search Strategy
"""

import threading
import time
from app.utils.hashing import sha256
from app.strategies.base_strategy import Strategy


class MultiThreadStrategy(Strategy):

    def __init__(self, threads=4):
        self.threads = threads

    def solve(self, puzzle, progress_callback=None):

        found = threading.Event()

        result = {
            "nonce": None,
            "hash": None,
            "attempts": 0,
        }

        lock = threading.Lock()
        start_time = time.perf_counter()

        def worker(start):

            nonce = start
            local_attempts = 0

            while not found.is_set():

                candidate = f"{puzzle.data}{nonce}"

                hash_value = sha256(candidate)
                local_attempts += 1

                if local_attempts % 1000 == 0:
                    with lock:
                        result["attempts"] += 1000
                        current_total = result["attempts"]
                    
                    if progress_callback and current_total % 10000 == 0:
                        elapsed = time.perf_counter() - start_time
                        hashrate = current_total / elapsed if elapsed > 0 else 0
                        progress_callback({
                            "event": "progress",
                            "strategy": "MultiThreadStrategy",
                            "attempts": current_total,
                            "nonce": nonce,
                            "hashrate": round(hashrate, 2),
                            "elapsed": round(elapsed, 3),
                        })

                if hash_value.startswith("0" * puzzle.difficulty()):

                    with lock:

                        if not found.is_set():

                            # Add remaining local attempts
                            result["attempts"] += (local_attempts % 1000)
                            result["nonce"] = nonce
                            result["hash"] = hash_value

                            found.set()

                    return

                nonce += self.threads

        workers = []

        for i in range(self.threads):

            t = threading.Thread(target=worker, args=(i,))

            workers.append(t)

            t.start()

        for t in workers:

            t.join()

        return (
            result["nonce"],
            result["hash"],
            result["attempts"],
        )