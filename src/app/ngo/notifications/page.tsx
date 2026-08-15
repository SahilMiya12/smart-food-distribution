"use client";

import { useEffect, useState } from "react";
import { Bell, Loader2 } from "lucide-react";

export default function NgoNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function markAllRead() {
    await fetch("/api/notifications/read-all", { method: "POST" });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">NGO Notifications</h1>
          <p className="text-slate-500">Updates on food requests and donation approvals.</p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            <Bell size={36} className="mx-auto mb-3 text-slate-300" />
            No notifications yet.
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-5 transition ${
                item.isRead ? "border-slate-200 bg-white" : "border-emerald-200 bg-emerald-50/50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{item.message}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                {!item.isRead && (
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
