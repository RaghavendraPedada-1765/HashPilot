export default function LiveBenchmark({
  events,
}) {

  return (

    <div
      style={{
        background: "#111827",
        borderRadius: "16px",
        padding: "25px",
        marginBottom: "30px",
      }}
    >

      <h2>Live Benchmark</h2>

      {

        events.map((event, index) => (

          <div
            key={index}
            style={{
              marginTop: "12px",
            }}
          >

            {JSON.stringify(event)}

          </div>

        ))

      }

    </div>

  );

}