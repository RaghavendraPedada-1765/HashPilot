"""
HashPilot

Multi-threaded Search Strategy
"""

import threading
from app.utils.hashing import sha256
from app.strategies.base_strategy import Strategy


class MultiThreadStrategy(Strategy):

    def __init__(self, threads=4):
        self.threads = threads

    def solve(self, puzzle):

        found = threading.Event()

        result = {
            "nonce": None,
            "hash": None,
            "attempts": 0,
        }

        lock = threading.Lock()

        def worker(start):

            nonce = start

            while not found.is_set():

                candidate = f"{puzzle.data}{nonce}"

                hash_value = sha256(candidate)

                with lock:
                    result["attempts"] += 1

                if hash_value.startswith("0" * puzzle.difficulty()):

                    with lock:

                        if not found.is_set():

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