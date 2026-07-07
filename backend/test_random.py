from app.engine.pow_puzzle import ProofOfWorkPuzzle
from app.engine.solver import Solver
from app.strategies.random_strategy import RandomStrategy

puzzle = ProofOfWorkPuzzle(
    data="HashPilot",
    difficulty=4,
)

solver = Solver(RandomStrategy())

result = solver.solve(puzzle)

print(result)