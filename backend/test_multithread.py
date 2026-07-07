from app.engine.pow_puzzle import ProofOfWorkPuzzle
from app.engine.solver import Solver
from app.strategies.multithread_strategy import MultiThreadStrategy

puzzle = ProofOfWorkPuzzle(
    data="HashPilot",
    difficulty=4,
)

solver = Solver(
    MultiThreadStrategy(threads=4)
)

result = solver.solve(puzzle)

print(result)