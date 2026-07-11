"""
HashPilot Benchmark Repository
"""

from sqlalchemy.orm import Session

from app.models.benchmark_model import Benchmark


class BenchmarkRepository:

    def save_results(
        self,
        db: Session,
        results,
        difficulty: int,
    ):

        winner = max(results, key=lambda r: r["hashrate"])

        for result in results:

            record = Benchmark(
                strategy=result["strategy"],
                difficulty=difficulty,
                attempts=result["attempts"],
                hashrate=result["hashrate"],
                runtime=result["time"],
                winner=result["strategy"] == winner["strategy"],
            )

            db.add(record)

        db.commit()

    def get_history(self, db: Session):

        return db.query(Benchmark).order_by(Benchmark.id.desc()).all()
