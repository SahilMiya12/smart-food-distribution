import Link from "next/link";
import {
  Truck,
  ClipboardList,
  History,
  User,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    title: "Available Deliveries",
    description: "Browse and accept nearby deliveries",
    href: "/volunteer/deliveries",
    icon: Truck,
    color: "bg-emerald-500",
  },
  {
    title: "My Deliveries",
    description: "Manage accepted deliveries",
    href: "/volunteer/my-deliveries",
    icon: ClipboardList,
    color: "bg-blue-500",
  },
  {
    title: "Delivery History",
    description: "View completed deliveries",
    href: "/volunteer/history",
    icon: History,
    color: "bg-orange-500",
  },
  {
    title: "My Profile",
    description: "Update volunteer profile",
    href: "/volunteer/profile",
    icon: User,
    color: "bg-purple-500",
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">

      <h2 className="text-xl font-bold text-slate-900">
        Quick Actions
      </h2>

      <div className="mt-6 space-y-4">

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-400 hover:bg-emerald-50"
            >

              <div className="flex items-center gap-4">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color}`}
                >
                  <Icon
                    size={22}
                    className="text-white"
                  />
                </div>

                <div>

                  <h3 className="font-semibold text-slate-900">
                    {action.title}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {action.description}
                  </p>

                </div>

              </div>

              <ArrowRight
                size={18}
                className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600"
              />

            </Link>
          );
        })}

      </div>

    </div>
  );
}