"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  HeartHandshake,
  Building,
  Bike,
  Package,
  Truck,
  Loader2,
  PlusCircle,
  BarChart3,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  function fetchStats() {
    setLoading(true);
    setError("");
    fetch("/api/admin/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch admin stats");
        return res.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      });
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentUsers = Array.isArray(data?.recentUsers) ? data.recentUsers : [];
  const recentDonations = Array.isArray(data?.recentDonations) ? data.recentDonations : [];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">SYSTEM ADMINISTRATION</p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">Admin Control Center</h1>
          <p className="mt-1 text-sm text-slate-500">Monitor system analytics, user accounts, and platform food distribution.</p>
        </div>

        <button
          onClick={fetchStats}
          className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Primary Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="Total Users"
          value={stats.totalUsers || 0}
          icon={<Users className="text-blue-600" size={24} />}
          subText={`${stats.totalDonors || 0} Donors • ${stats.totalNGOs || 0} NGOs`}
          href="/admin/users"
        />
        <AdminStatCard
          label="Food Donors"
          value={stats.totalDonors || 0}
          icon={<HeartHandshake className="text-emerald-600" size={24} />}
          subText="Registered restaurants & stores"
          href="/admin/donors"
        />
        <AdminStatCard
          label="Partner NGOs"
          value={stats.totalNGOs || 0}
          icon={<Building className="text-amber-600" size={24} />}
          subText="Verified non-profit organizations"
          href="/admin/ngos"
        />
        <AdminStatCard
          label="Volunteer Fleet"
          value={stats.totalVolunteers || 0}
          icon={<Bike className="text-purple-600" size={24} />}
          subText="Active drivers & delivery helpers"
          href="/admin/volunteers"
        />
      </div>

      {/* Secondary Logistics Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="Total Food Items"
          value={stats.totalDonations || 0}
          icon={<Package className="text-teal-600" size={24} />}
          subText="Donated items recorded"
          href="/admin/donations"
        />
        <AdminStatCard
          label="Total Deliveries"
          value={stats.totalDeliveries || 0}
          icon={<Truck className="text-indigo-600" size={24} />}
          subText="Pickup & delivery dispatches"
          href="/admin/deliveries"
        />
        <AdminStatCard
          label="Pending Requests"
          value={stats.pendingRequests || 0}
          icon={<Package className="text-orange-600" size={24} />}
          subText="Awaiting donor approval"
          href="/admin/donations"
        />
        <AdminStatCard
          label="Completed Deliveries"
          value={stats.completedDeliveries || 0}
          icon={<CheckCircle2 className="text-emerald-600" size={24} />}
          subText="Successfully delivered food"
          href="/admin/deliveries"
        />
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 to-slate-900 p-6 text-white shadow-lg">
        <h2 className="text-lg font-bold">Admin Management Actions</h2>
        <p className="text-xs text-emerald-200 mt-1">Quick shortcuts to execute operational administrative tasks.</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/admin/users"
            className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <Users size={16} /> Manage Users
          </Link>
          <Link
            href="/admin/donations"
            className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <Package size={16} /> Manage Donations
          </Link>
          <Link
            href="/admin/deliveries"
            className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <Truck size={16} /> Track Deliveries
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <BarChart3 size={16} /> Analytics
          </Link>
          <Link
            href="/admin/reports"
            className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <FileText size={16} /> Reports & Export
          </Link>
        </div>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Registered Users */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Recent User Registrations</h2>
            <Link href="/admin/users" className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {recentUsers.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No recent users registered yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentUsers.map((u: any) => (
                <div key={u.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{u.firstName} {u.lastName}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Food Donations */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Recent Food Donations</h2>
            <Link href="/admin/donations" className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {recentDonations.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No recent food donations listed.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentDonations.map((d: any) => (
                <div key={d.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{d.foodName}</p>
                    <p className="text-xs text-slate-500">
                      {d.quantity} {d.unit} • {d.donor?.firstName} {d.donor?.lastName}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminStatCard({
  label,
  value,
  icon,
  subText,
  href,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  subText: string;
  href: string;
}) {
  return (
    <Link href={href} className="block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-500 hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
        {icon}
      </div>
      <p className="mt-4 text-4xl font-black text-slate-900">{value}</p>
      <p className="mt-2 text-xs text-slate-500 truncate">{subText}</p>
    </Link>
  );
}