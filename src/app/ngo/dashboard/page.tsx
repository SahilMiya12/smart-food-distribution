"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Package,
  Search,
  XCircle,
  MapPin,
  CalendarDays,
  Utensils,
  RefreshCw,
} from "lucide-react";

type DashboardData = {
  stats: {
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    availableDonations: number;
  };
  availableDonations: Donation[];
  recentRequests: RequestItem[];
};

type Donation = {
  id: string;
  foodName: string;
  category: string;
  quantity: number;
  unit: string;
  pickupCity: string;
  expiryDate: string;
  donor?: {
    firstName: string;
    lastName: string;
    organizationName?: string | null;
  };
};

type RequestItem = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  message?: string | null;
  createdAt: string;
  donation: {
    id: string;
    foodName: string;
    category: string;
    quantity: number;
    unit: string;
    pickupCity: string;
    expiryDate: string;
  };
};

export default function NgoDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/ngo/dashboard", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load dashboard");
      }

      setData(result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-8">
          <div className="h-32 rounded-3xl bg-white" />

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-32 rounded-2xl bg-white"
              />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-96 rounded-3xl bg-white lg:col-span-2" />
            <div className="h-96 rounded-3xl bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 p-6">
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />

          <h2 className="text-xl font-bold text-slate-900">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <button
            onClick={loadDashboard}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </main>
    );
  }

  const stats = [
    {
      label: "Total Requests",
      value: data.stats.totalRequests,
      icon: Package,
      description: "All your food requests",
      iconClass: "bg-blue-50 text-blue-600",
    },
    {
      label: "Pending",
      value: data.stats.pendingRequests,
      icon: Clock3,
      description: "Awaiting donor response",
      iconClass: "bg-amber-50 text-amber-600",
    },
    {
      label: "Approved",
      value: data.stats.approvedRequests,
      icon: CheckCircle2,
      description: "Successfully approved",
      iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Rejected",
      value: data.stats.rejectedRequests,
      icon: XCircle,
      description: "Requests declined",
      iconClass: "bg-red-50 text-red-600",
    },
    {
      label: "Available Food",
      value: data.stats.availableDonations,
      icon: Utensils,
      description: "Ready to request",
      iconClass: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 p-6 text-white shadow-lg sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-2 text-sm font-medium text-emerald-100">
              NGO IMPACT CENTER
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Make every meal matter.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50 sm:text-base">
              Discover available food donations, request what your
              community needs, and help reduce food waste.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/ngo/browse"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                <Search className="h-4 w-4" />
                Browse Food
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/ngo/requests"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                View My Requests
              </Link>
            </div>
          </div>

          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 right-20 h-72 w-72 rounded-full bg-white/10" />
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>

                    <p className="mt-3 text-3xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Main Content */}
        <section className="grid gap-6 lg:grid-cols-3">

          {/* Recent Requests */}
          <div className="rounded-3xl border border-slate-100 bg-white shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Requests
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Track the status of your food requests
                </p>
              </div>

              <Link
                href="/ngo/requests"
                className="hidden items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 sm:flex"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {data.recentRequests.length === 0 ? (
                <div className="p-10 text-center">
                  <Package className="mx-auto h-10 w-10 text-slate-300" />

                  <p className="mt-3 font-medium text-slate-700">
                    No requests yet
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Browse available food and make your first request.
                  </p>
                </div>
              ) : (
                data.recentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                        🍱
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {request.donation.foodName}
                        </h3>

                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                          <span>
                            {request.donation.quantity}{" "}
                            {request.donation.unit}
                          </span>

                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {request.donation.pickupCity}
                          </span>

                          <span>
                            {new Date(
                              request.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <StatusBadge status={request.status} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage your food distribution activities
            </p>

            <div className="mt-6 space-y-3">
              <Link
                href="/ngo/browse"
                className="group flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
                    <Search className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      Browse Food
                    </p>

                    <p className="text-xs text-slate-500">
                      Find available donations
                    </p>
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
              </Link>

              <Link
                href="/ngo/requests"
                className="group flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
                    <Package className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      My Requests
                    </p>

                    <p className="text-xs text-slate-500">
                      Track request status
                    </p>
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
              </Link>

              <Link
                href="/profile"
                className="group flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition hover:border-purple-300 hover:bg-purple-50"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-100 p-2 text-purple-600">
                    <Utensils className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      Organization Profile
                    </p>

                    <p className="text-xs text-slate-500">
                      Manage your NGO details
                    </p>
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-purple-600" />
              </Link>
            </div>
          </div>
        </section>

        {/* Available Donations */}
        <section className="rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Available Food Near You
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Fresh donations waiting to reach communities
              </p>
            </div>

            <Link
              href="/ngo/browse"
              className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Browse all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {data.availableDonations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                🍽️
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No food currently available
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                New donations will appear here when donors share food.
              </p>

              <Link
                href="/ngo/browse"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Check Again
                <RefreshCw className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 p-6 sm:grid-cols-2 xl:grid-cols-3">
              {data.availableDonations.map((donation) => (
                <Link
                  key={donation.id}
                  href={`/ngo/browse/${donation.id}`}
                  className="group rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {donation.category.replaceAll("_", " ")}
                    </span>

                    <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    {donation.foodName}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {donation.quantity} {donation.unit}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {donation.pickupCity}
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Expires{" "}
                      {new Date(
                        donation.expiryDate
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatusBadge({
  status,
}: {
  status: RequestItem["status"];
}) {
  const styles = {
    PENDING:
      "bg-amber-50 text-amber-700 border-amber-200",
    APPROVED:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    REJECTED:
      "bg-red-50 text-red-700 border-red-200",
    CANCELLED:
      "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}