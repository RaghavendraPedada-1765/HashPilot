from app.engine.pow_puzzle import ProofOfWorkPuzzle
from app.engine.solver import Solver
from app.strategies.multiprocess_strategy import MultiProcessStrategy


def main():

    puzzle = ProofOfWorkPuzzle(
        data="HashPilot",
        difficulty=4,
    )

    solver = Solver(
        MultiProcessStrategy(processes=4)
    )

    result = solver.solve(puzzle)

    print(result)


if __name__ == "__main__":
    main()