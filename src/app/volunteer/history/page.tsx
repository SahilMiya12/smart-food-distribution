"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, Package, MapPin, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

export default function HistoryPage() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  function fetchHistory() {
    setLoading(true);
    fetch("/api/deliveries")
      .then((res) => res.json())
      .then((data) => {
        const all = Array.isArray(data.deliveries) ? data.deliveries : [];
        // Filter delivered or cancelled deliveries for history
        setDeliveries(all.filter((d: any) => d.status === "DELIVERED" || d.status === "CANCELLED"));
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
      <div>
        <h1 className="text-3xl font-black text-slate-900">Delivery History</h1>
        <p className="text-sm text-slate-500">View record of your completed food deliveries and community contributions.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed Deliveries</p>
          <p className="mt-2 text-3xl font-black text-emerald-600">
            {deliveries.filter((d) => d.status === "DELIVERED").length}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total History Records</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{deliveries.length}</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Volunteer Rating</p>
          <p className="mt-2 text-3xl font-black text-amber-500">4.9 ★</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        {deliveries.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <History size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-800">No completed delivery history yet.</p>
            <p className="text-xs text-slate-400 mt-1">Once you complete food deliveries, they will appear in your log.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase text-slate-400">
              <tr>
                <th className="p-3">Delivery ID</th>
                <th className="p-3">Food Item</th>
                <th className="p-3">Donor</th>
                <th className="p-3">Status</th>
                <th className="p-3">Completed Date</th>
                <th className="p-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deliveries.map((del) => (
                <tr key={del.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono text-xs text-slate-500">{del.id.slice(0, 8)}...</td>
                  <td className="p-3 font-semibold text-slate-900">{del.donation?.foodName || "Surplus Food"}</td>
                  <td className="p-3">{del.donor ? `${del.donor.firstName} ${del.donor.lastName}` : "—"}</td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        del.status === "DELIVERED" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {del.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(del.updatedAt).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/volunteer/deliveries/${del.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                    >
                      View <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}