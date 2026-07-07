"""
HashPilot

Benchmark Runner
"""

from app.core.config import Config

from app.engine.pow_puzzle import ProofOfWorkPuzzle
from app.engine.benchmark import BenchmarkEngine

from app.strategies.sequential import SequentialStrategy
from app.strategies.random_strategy import RandomStrategy
from app.strategies.multithread_strategy import MultiThreadStrategy
from app.strategies.multiprocess_strategy import MultiProcessStrategy

from app.analytics.exporter import BenchmarkExporter
from app.analytics.chart import BenchmarkChart


def main():

    # Load configuration
    config = Config()

    # Create puzzle from config
    puzzle = ProofOfWorkPuzzle(
        data=config.puzzle["data"],
        difficulty=config.puzzle["difficulty"],
    )

    # Create benchmark engine
    benchmark = BenchmarkEngine(puzzle)

    # Register strategies
    benchmark.add_strategy(SequentialStrategy())
    benchmark.add_strategy(RandomStrategy())

    benchmark.add_strategy(
        MultiThreadStrategy(
            threads=config.benchmark["threads"]
        )
    )

    benchmark.add_strategy(
        MultiProcessStrategy(
            processes=config.benchmark["processes"]
        )
    )

    # Run benchmark
    results = benchmark.run()

    json_file = None
    chart_file = None

    # Export JSON
    if config.output["save_json"]:

        exporter = BenchmarkExporter()

        json_file = exporter.export(results)

    # Generate chart
    if config.output["save_chart"] and json_file:

        chart = BenchmarkChart()

        chart_file = chart.create(json_file)

    # Print report
    print("\n" + "=" * 75)
    print(f"               {config.project['name']} Benchmark")
    print("=" * 75)

    print(
        f"{'Strategy':<22}"
        f"{'Time(s)':>10}"
        f"{'Attempts':>15}"
        f"{'Hash Rate(H/s)':>20}"
    )

    print("-" * 75)

    for result in results:

        print(
            f"{result['strategy']:<22}"
            f"{result['time']:>10.4f}"
            f"{result['attempts']:>15}"
            f"{result['hashrate']:>20.2f}"
        )

    winner = max(results, key=lambda x: x["hashrate"])

    print("-" * 75)
    print(f"🏆 Winner : {winner['strategy']}")

    if json_file:
        print(f"📁 JSON   : {json_file}")

    if chart_file:
        print(f"📊 Chart  : {chart_file}")

    print("=" * 75)


if __name__ == "__main__":
    main()