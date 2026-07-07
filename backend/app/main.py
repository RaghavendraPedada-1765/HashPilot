"""
HashPilot

Main Entry Point

Author: Raghavendra Pedada
License: MIT
"""

from app.engine.pow_puzzle import ProofOfWorkPuzzle
from app.engine.solver import Solver
from app.strategies.sequential import SequentialStrategy


def main():
    puzzle = ProofOfWorkPuzzle(
        data="HashPilot",
        difficulty=4,
    )

    strategy = SequentialStrategy()
    solver = Solver(strategy)

    result = solver.solve(puzzle)

    print("=" * 50)
    print("             HashPilot v0.1")
    print("=" * 50)
    print(f"Puzzle      : Proof of Work")
    print(f"Difficulty  : {puzzle.difficulty()}")
    print(f"Strategy    : Sequential Search")
    print()

    print("✅ Solution Found")
    print()

    print(f"Nonce       : {result['nonce']}")
    print(f"Hash        : {result['hash']}")
    print(f"Attempts    : {result['attempts']}")
    print(f"Time        : {result['time']:.4f} sec")
    print(f"Hash Rate   : {result['hashrate']:.2f} H/s")
    print("=" * 50)


if __name__ == "__main__":
    main()