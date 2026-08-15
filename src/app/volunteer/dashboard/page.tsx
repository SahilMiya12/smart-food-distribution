"use client";

import { useEffect, useState } from "react";
import DashboardStats from "@/components/volunteer/DashboardStats";
import DeliveryCard from "@/components/volunteer/DeliveryCard";
import QuickActions from "@/components/volunteer/QuickActions";
import WeeklyChart from "@/components/volunteer/WeeklyChart";
import RecentActivity from "@/components/volunteer/RecentActivity";
import NotificationCard from "@/components/volunteer/NotificationCard";
import { Loader2, AlertCircle } from "lucide-react";

export default function VolunteerDashboard() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/volunteer/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load dashboard data");
        return res.json();
      })
      .then((data) => {
        setDashboard(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load dashboard details");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const stats = dashboard?.stats || { available: 0, accepted: 0, completed: 0, rating: 4.9 };
  const deliveries = Array.isArray(dashboard?.deliveries) ? dashboard.deliveries : [];
  const activity = Array.isArray(dashboard?.activity) ? dashboard.activity : [];
  const notifications = Array.isArray(dashboard?.notifications) ? dashboard.notifications : [];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          Volunteer Dashboard 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage deliveries and help distribute surplus food to communities.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <DashboardStats stats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <DeliveryCard deliveries={deliveries} />
          <WeeklyChart />
        </div>

        <div className="space-y-6">
          <QuickActions />
          <RecentActivity activity={activity} />
          <NotificationCard notifications={notifications} />
        </div>
      </div>
    </div>
  );
}