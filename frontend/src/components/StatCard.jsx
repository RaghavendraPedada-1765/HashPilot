export default function StatCard({
  title,
  value,
  color = "bg-slate-800"
}) {

  return (

    <div
      className={`
                ${color}
                rounded-xl
                p-6
                shadow-lg
                text-center
                border
                border-slate-700
            `}
    >

      <h3 className="text-slate-400 text-sm uppercase">

        {title}

      </h3>

      <p className="text-3xl font-bold mt-3">

        {value}

      </p>

    </div>

  );

}