export default function BenchmarkTable({ results }) {

  if (results.length === 0) {

    return (

      <div className="mx-12 my-10">

        <div className="bg-slate-800 rounded-xl p-10 text-center text-slate-400 shadow-lg">

          No benchmark executed yet.

        </div>

      </div>

    );

  }

  const winner = results.reduce((best, current) =>
    current.hashrate > best.hashrate ? current : best
  );

  return (

    <div className="mx-12 my-12">

      <h2 className="text-3xl font-bold mb-6">

        Benchmark Results

      </h2>

      <div className="overflow-hidden rounded-xl shadow-xl">

        <table className="w-full">

          <thead className="bg-slate-700">

            <tr>

              <th className="p-4 text-left">

                Strategy

              </th>

              <th className="p-4 text-center">

                Time

              </th>

              <th className="p-4 text-center">

                Attempts

              </th>

              <th className="p-4 text-center">

                Hash Rate

              </th>

              <th className="p-4 text-center">

                Status

              </th>

            </tr>

          </thead>

          <tbody>

            {

              results.map((item, index) => {

                const isWinner =
                  item.strategy === winner.strategy;

                return (

                  <tr

                    key={index}

                    className="
                                            border-b
                                            border-slate-700
                                            hover:bg-slate-800
                                            transition
                                        "

                  >

                    <td className="p-4 font-semibold">

                      {item.strategy}

                    </td>

                    <td className="text-center">

                      {item.time.toFixed(4)} s

                    </td>

                    <td className="text-center">

                      {item.attempts.toLocaleString()}

                    </td>

                    <td className="text-center">

                      {Math.round(item.hashrate).toLocaleString()} H/s

                    </td>

                    <td className="text-center">

                      {

                        isWinner

                          ?

                          <span className="bg-green-600 px-3 py-1 rounded-full">

                            🏆 Winner

                          </span>

                          :

                          <span className="bg-slate-600 px-3 py-1 rounded-full">

                            Runner Up

                          </span>

                      }

                    </td>

                  </tr>

                );

              })

            }

          </tbody>

        </table>

      </div>

    </div>

  );

}