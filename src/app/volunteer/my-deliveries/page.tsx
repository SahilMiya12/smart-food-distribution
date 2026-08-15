"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Truck, Package, MapPin, ArrowRight, Loader2, RefreshCw } from "lucide-react";

export default function MyDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyDeliveries();
  }, []);

  function fetchMyDeliveries() {
    setLoading(true);
    fetch("/api/deliveries")
      .then((res) => res.json())
      .then((data) => {
        const all = Array.isArray(data.deliveries) ? data.deliveries : [];
        setDeliveries(all.filter((d: any) => d.status !== "DELIVERED" && d.status !== "CANCELLED"));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">My Claimed Deliveries</h1>
          <p className="text-sm text-slate-500">Track and manage deliveries you have accepted.</p>
        </div>

        <button
          onClick={fetchMyDeliveries}
          className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {deliveries.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
          <Truck size={48} className="mx-auto mb-3 text-slate-300" />
          <h3 className="text-xl font-bold text-slate-800">No Active Deliveries</h3>
          <p className="mt-1 text-sm text-slate-400">You have no active claimed deliveries. Browse available deliveries to get started.</p>
          <Link
            href="/volunteer/deliveries"
            className="mt-6 inline-flex rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Browse Available Deliveries
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {deliveries.map((item) => (
            <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">{item.donation?.foodName || "Surplus Food"}</h3>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                  {item.status}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl">
                <p className="flex items-center gap-1.5"><Package size={14} className="text-emerald-600" /> {item.donation?.quantity} {item.donation?.unit}</p>
                <p className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-600" /> {item.pickupAddress || item.donation?.pickupCity}</p>
              </div>

              <div className="mt-6 flex justify-end">
                <Link
                  href={`/volunteer/deliveries/${item.id}`}
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
                >
                  Manage & Verify <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
