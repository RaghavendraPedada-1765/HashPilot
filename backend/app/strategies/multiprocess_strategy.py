"""
HashPilot

Multiprocessing Search Strategy
"""

import multiprocessing as mp

from app.utils.hashing import sha256
from app.strategies.base_strategy import Strategy


def worker(start, step, data, difficulty, found, result):

    nonce = start
    attempts = 0

    while not found.is_set():

        candidate = f"{data}{nonce}"
        hash_value = sha256(candidate)

        attempts += 1

        if hash_value.startswith("0" * difficulty):

            if not found.is_set():

                result["nonce"] = nonce
                result["hash"] = hash_value
                result["attempts"] = attempts

                found.set()

            return

        nonce += step


class MultiProcessStrategy(Strategy):

    def __init__(self, processes=4):
        self.processes = processes

    def solve(self, puzzle):

        manager = mp.Manager()

        found = manager.Event()
        result = manager.dict()

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
                ),
            )

            jobs.append(p)
            p.start()

        for p in jobs:
            p.join()

        return (
            result["nonce"],
            result["hash"],
            result["attempts"],
        )