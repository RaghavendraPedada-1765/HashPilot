"""
HashPilot Analytics Service
"""

from sqlalchemy import func

from app.database.db import SessionLocal
from app.models.benchmark_model import Benchmark


class AnalyticsService:

    def get_statistics(self):

        db = SessionLocal()

        try:

            total_runs = db.query(Benchmark).count()

            total_winners = db.query(Benchmark).filter(Benchmark.winner == True).count()

            avg_hashrate = db.query(func.avg(Benchmark.hashrate)).scalar()

            strategies = []

            strategy_names = [row[0] for row in db.query(Benchmark.strategy).distinct()]

            for strategy in strategy_names:

                wins = (
                    db.query(Benchmark)
                    .filter(Benchmark.strategy == strategy, Benchmark.winner == True)
                    .count()
                )

                avg = (
                    db.query(func.avg(Benchmark.hashrate))
                    .filter(Benchmark.strategy == strategy)
                    .scalar()
                )

                strategies.append(
                    {"strategy": strategy, "wins": wins, "average_hashrate": round(avg or 0, 2)}
                )

            best = None

            if strategies:

                best = max(strategies, key=lambda x: x["average_hashrate"])["strategy"]

            return {
                "total_runs": total_runs,
                "total_winners": total_winners,
                "average_hashrate": round(avg_hashrate or 0, 2),
                "best_strategy": best,
                "strategies": strategies,
            }

        finally:

            db.close()
