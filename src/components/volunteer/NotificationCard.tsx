import {
  Bell,
  CheckCircle2,
  Truck,
  Package,
} from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "delivery" | "success" | "pickup";
};

type Props = {
  notifications: Notification[];
};

export default function NotificationCard({
  notifications,
}: Props) {
  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "delivery":
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

      case "success":
        return (
          <CheckCircle2
            className="text-emerald-600"
            size={20}
          />
        );

      default:
        return (
          <Bell
            className="text-slate-500"
            size={20}
          />
        );
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">

      <div className="flex items-center gap-3">

        <Bell
          className="text-emerald-600"
          size={22}
        />

        <h2 className="text-xl font-bold text-slate-900">
          Notifications
        </h2>

      </div>

      {notifications.length === 0 ? (
        <div className="py-10 text-center">

          <Bell
            size={60}
            className="mx-auto text-slate-300"
          />

          <p className="mt-4 text-slate-500">
            No new notifications
          </p>

        </div>
      ) : (
        <div className="mt-6 space-y-4">

          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                {getIcon(notification.type)}
              </div>

              <div className="flex-1">

                <h3 className="font-semibold text-slate-900">
                  {notification.title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {notification.message}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {notification.time}
                </p>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}