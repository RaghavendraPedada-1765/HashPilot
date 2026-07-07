"""
Benchmark History API
"""

from fastapi import APIRouter

from app.database.db import SessionLocal

from app.repositories.benchmark_repository import BenchmarkRepository

router = APIRouter(

    prefix="/history",

    tags=["History"],

)

repository = BenchmarkRepository()


@router.get("/")
def history():

    db = SessionLocal()

    try:

        rows = repository.get_history(db)

        return [

            {

                "id": row.id,

                "strategy": row.strategy,

                "difficulty": row.difficulty,

                "attempts": row.attempts,

                "hashrate": row.hashrate,

                "runtime": row.runtime,

                "winner": row.winner,

            }

            for row in rows

        ]

    finally:

        db.close()