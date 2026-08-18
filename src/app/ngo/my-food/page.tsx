"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Truck, MapPin, CheckCircle2, Clock, Loader2, ArrowRight } from "lucide-react";

export default function NgoMyFoodPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [resReq, resDel] = await Promise.all([
        fetch("/api/requests"),
        fetch("/api/deliveries"),
      ]);

      const dataReq = await resReq.json();
      const dataDel = await resDel.json();

      const reqList = Array.isArray(dataReq.requests) ? dataReq.requests : [];
      setRequests(reqList.filter((r: any) => r.status === "ACCEPTED" || r.status === "APPROVED"));

      const delList = Array.isArray(dataDel.deliveries) ? dataDel.deliveries : [];
      setDeliveries(delList);
    } catch (err) {
      console.error("Failed to load NGO rescued food:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Rescued Food & Deliveries</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track approved food requests and monitor incoming volunteer deliveries to your organization.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Approved Food Requests</p>
          <p className="mt-2 text-3xl font-black text-emerald-600">{requests.length}</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Incoming Deliveries</p>
          <p className="mt-2 text-3xl font-black text-blue-600">
            {deliveries.filter((d) => d.status !== "DELIVERED" && d.status !== "CANCELLED").length}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed Deliveries</p>
          <p className="mt-2 text-3xl font-black text-purple-600">
            {deliveries.filter((d) => d.status === "DELIVERED").length}
          </p>
        </div>
      </div>

      {/* Approved Food Requests Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Approved Food Items</h2>

        {requests.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            <Package size={40} className="mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-700">No approved food requests yet.</p>
            <p className="text-xs text-slate-400 mt-1">Browse available food Marketplace to send requests to donors.</p>
            <Link
              href="/ngo/browse"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
            >
              Browse Marketplace <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((r) => (
              <div key={r.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">{r.donation?.foodName}</h3>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                    APPROVED
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Quantity:</span> {r.donation?.quantity} {r.donation?.unit}
                </p>
                <p className="text-xs text-slate-600 flex items-center gap-1">
                  <MapPin size={14} className="text-emerald-600" /> {r.donation?.pickupCity}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deliveries Status Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Incoming Food Deliveries</h2>

        {deliveries.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            <Truck size={40} className="mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-700">No delivery dispatches recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase text-slate-400">
                <tr>
                  <th className="p-3">Delivery ID</th>
                  <th className="p-3">Food Package</th>
                  <th className="p-3">Donor</th>
                  <th className="p-3">Assigned Volunteer</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveries.map((del) => (
                  <tr key={del.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono text-xs text-slate-500">{del.id.slice(0, 8)}...</td>
                    <td className="p-3 font-semibold text-slate-900">{del.donation?.foodName || "Surplus Food"}</td>
                    <td className="p-3">{del.donor ? `${del.donor.firstName} ${del.donor.lastName}` : "—"}</td>
                    <td className="p-3 font-semibold text-slate-800">
                      {del.volunteer ? `${del.volunteer.firstName} ${del.volunteer.lastName}` : (
                        <span className="text-amber-600 text-xs bg-amber-50 px-2 py-0.5 rounded-full">Awaiting Volunteer</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800">
                        {del.status}
                      </span>
                    </td>
                    <td className="p-3">{new Date(del.updatedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
