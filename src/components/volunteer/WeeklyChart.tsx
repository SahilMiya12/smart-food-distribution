const weeklyData = [
  { day: "Mon", deliveries: 4 },
  { day: "Tue", deliveries: 7 },
  { day: "Wed", deliveries: 5 },
  { day: "Thu", deliveries: 8 },
  { day: "Fri", deliveries: 6 },
  { day: "Sat", deliveries: 9 },
  { day: "Sun", deliveries: 3 },
];

export default function WeeklyChart() {
  const max = Math.max(
    ...weeklyData.map((d) => d.deliveries)
  );

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Weekly Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Deliveries completed this week
          </p>
        </div>

        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
          This Week
        </span>

      </div>

      <div className="mt-8 flex h-64 items-end justify-between gap-4">

        {weeklyData.map((item) => (
          <div
            key={item.day}
            className="flex flex-1 flex-col items-center"
          >

            <div
              className="flex w-full items-end rounded-t-xl bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all hover:scale-105"
              style={{
                height: `${(item.deliveries / max) * 180}px`,
              }}
            />

            <span className="mt-3 text-sm font-medium text-slate-700">
              {item.day}
            </span>

            <span className="text-xs text-slate-400">
              {item.deliveries}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}