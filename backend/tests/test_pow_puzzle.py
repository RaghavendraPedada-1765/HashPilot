from app.engine.pow_puzzle import ProofOfWorkPuzzle


def test_generate():

    puzzle = ProofOfWorkPuzzle(
        data="HashPilot",
        difficulty=4,
    )

    assert puzzle.generate() == "HashPilot"


def test_difficulty():

    puzzle = ProofOfWorkPuzzle(
        data="HashPilot",
        difficulty=5,
    )

    assert puzzle.difficulty() == 5
