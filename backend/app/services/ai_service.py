"""
HashPilot AI Recommendation Service
"""


class AIService:

    @staticmethod
    def analyze(results):

        if not results:
            return None

        winner = max(
            results,
            key=lambda x: x["hashrate"]
        )

        max_hashrate = max(
            r["hashrate"] for r in results
        )

        min_hashrate = min(
            r["hashrate"] for r in results
        )

        if max_hashrate == min_hashrate:

            confidence = 100

        else:

            confidence = round(

                (

                    (winner["hashrate"] - min_hashrate)

                    /

                    (max_hashrate - min_hashrate)

                )

                * 100

            )

        reasons = [

            f"Highest Hash Rate ({winner['hashrate']:.0f} H/s)",

            "Best Overall Benchmark Performance"

        ]

        fastest = min(
            results,
            key=lambda x: x["time"]
        )

        if fastest["strategy"] == winner["strategy"]:

            reasons.append("Lowest Runtime")

        attempts = min(
            results,
            key=lambda x: x["attempts"]
        )

        if attempts["strategy"] == winner["strategy"]:

            reasons.append("Fewest Attempts")

        return {

            "recommended_strategy":
                winner["strategy"],

            "confidence":
                confidence,

            "winner":
                winner,

            "reasons":
                reasons

        }