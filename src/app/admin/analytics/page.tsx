"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, Package, Truck, HeartHandshake, Building, Bike, Loader2, CheckCircle2 } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const totalUsers = stats.totalUsers || 1;

  const rolePercentages = [
    { label: "Donors", count: stats.totalDonors || 0, color: "bg-emerald-500", textColor: "text-emerald-700", icon: HeartHandshake },
    { label: "NGOs", count: stats.totalNGOs || 0, color: "bg-amber-500", textColor: "text-amber-700", icon: Building },
    { label: "Volunteers", count: stats.totalVolunteers || 0, color: "bg-blue-500", textColor: "text-blue-700", icon: Bike },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">SYSTEM METRICS & INSIGHTS</p>
        <h1 className="mt-1 text-3xl font-black text-slate-900">Platform Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">Real-time data visualization of food waste reduction, logistics, and user distribution.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</p>
            <Users className="text-blue-600" size={24} />
          </div>
          <p className="mt-4 text-4xl font-black text-slate-900">{stats.totalUsers || 0}</p>
          <p className="mt-2 text-xs text-slate-500">Registered platform accounts</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Food Items Donated</p>
            <Package className="text-teal-600" size={24} />
          </div>
          <p className="mt-4 text-4xl font-black text-slate-900">{stats.totalDonations || 0}</p>
          <p className="mt-2 text-xs text-slate-500">Listed food packages</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Deliveries Completed</p>
            <CheckCircle2 className="text-emerald-600" size={24} />
          </div>
          <p className="mt-4 text-4xl font-black text-emerald-600">{stats.completedDeliveries || 0}</p>
          <p className="mt-2 text-xs text-slate-500">Successfully fulfilled pickups</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Fulfillment Efficiency</p>
            <TrendingUp className="text-purple-600" size={24} />
          </div>
          <p className="mt-4 text-4xl font-black text-purple-600">
            {stats.totalDeliveries > 0
              ? `${Math.round(((stats.completedDeliveries || 0) / stats.totalDeliveries) * 100)}%`
              : "100%"}
          </p>
          <p className="mt-2 text-xs text-slate-500">Delivery completion rate</p>
        </div>
      </div>

      {/* Role Breakdown Progress Bars */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-2">User Demographics & Ecosystem Roles</h2>
        <p className="text-xs text-slate-500 mb-6">Percentage distribution of accounts across platform roles.</p>

        <div className="space-y-6">
          {rolePercentages.map((r) => {
            const pct = Math.round((r.count / totalUsers) * 100) || 0;
            const Icon = r.icon;
            return (
              <div key={r.label}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="flex items-center gap-2 font-bold text-slate-800">
                    <Icon size={18} className={r.textColor} />
                    {r.label} ({r.count})
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-600">{pct}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${r.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
