import {
  CheckCircle2,
  Package,
  Truck,
} from "lucide-react";

type Activity = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "accepted" | "pickup" | "completed";
};

type Props = {
  activity: Activity[];
};

export default function RecentActivity({
  activity,
}: Props) {
  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "accepted":
        return (
          <Package
            className="text-blue-600"
            size={20}
          />
        );

      case "pickup":
        return (
          <Truck
            className="text-orange-600"
            size={20}
          />
        );

      case "completed":
        return (
          <CheckCircle2
            className="text-emerald-600"
            size={20}
          />
        );

      default:
        return (
          <Package
            className="text-slate-500"
            size={20}
          />
        );
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">

      <h2 className="text-xl font-bold text-slate-900">
        Recent Activity
      </h2>

      {activity.length === 0 ? (
        <div className="py-10 text-center">

          <Package
            size={55}
            className="mx-auto text-slate-300"
          />

          <p className="mt-4 text-slate-500">
            No recent activity
          </p>

        </div>
      ) : (
        <div className="mt-6 space-y-5">

          {activity.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4"
            >

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                {getIcon(item.type)}
              </div>

              <div className="flex-1">

                <h3 className="font-semibold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {item.description}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {item.time}
                </p>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}