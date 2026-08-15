import {
  Package,
  Truck,
  CheckCircle2,
  Star,
} from "lucide-react";

type Stats = {
  available: number;
  accepted: number;
  completed: number;
  rating: number;
};

type Props = {
  stats: Stats;
};

export default function DashboardStats({ stats }: Props) {
  const cards = [
    {
      title: "Available Deliveries",
      value: stats.available,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Accepted Today",
      value: stats.accepted,
      icon: Truck,
      color: "bg-amber-500",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "bg-emerald-500",
    },
    {
      title: "Volunteer Rating",
      value: stats.rating,
      icon: Star,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.color}`}
            >
              <Icon className="text-white" size={28} />
            </div>

            <h3 className="mt-5 text-sm font-medium text-slate-500">
              {card.title}
            </h3>

            <p className="mt-2 text-4xl font-bold text-slate-900">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}