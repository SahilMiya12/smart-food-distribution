"use client";

import { useEffect, useState } from "react";
import { Truck, Search, Filter, Loader2, Edit3, CheckCircle2, AlertCircle, X } from "lucide-react";

export default function AdminDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Edit status modal
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("PENDING");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  function fetchDeliveries() {
    setLoading(true);
    setError("");
    fetch("/api/admin/deliveries")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDeliveries(data);
        } else {
          setDeliveries([]);
          setError(data.message || "Failed to load deliveries");
        }
        setLoading(false);
      })
      .catch(() => {
        setDeliveries([]);
        setError("Error loading deliveries list");
        setLoading(false);
      });
  }

  async function handleUpdateStatus(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDelivery) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/deliveries/${selectedDelivery.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setSuccess("Delivery status updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
        setSelectedDelivery(null);
        fetchDeliveries();
      } else {
        const err = await res.json();
        setError(err.message || "Failed to update delivery status");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setUpdating(false);
    }
  }

  const filteredDeliveries = deliveries.filter((d) => {
    const matchesSearch =
      `${d.id} ${d.donation?.foodName || ""} ${d.donor?.firstName || ""} ${d.donor?.lastName || ""} ${d.volunteer?.firstName || ""} ${d.volunteer?.lastName || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Delivery Operations Monitoring</h1>
        <p className="text-sm text-slate-500">Track and manage real-time food pickup and delivery tasks.</p>
      </div>

      {/* Notifications */}
      {success && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-emerald-800 text-sm font-semibold">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-red-800 text-sm font-semibold">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search deliveries by ID, food, donor, or volunteer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 focus:border-emerald-600 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="PICKED_UP">PICKED_UP</option>
            <option value="IN_TRANSIT">IN_TRANSIT</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <Truck size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-800">No delivery records found.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase text-slate-400">
              <tr>
                <th className="p-3">Delivery ID</th>
                <th className="p-3">Food Item</th>
                <th className="p-3">Donor</th>
                <th className="p-3">Assigned Volunteer</th>
                <th className="p-3">Status</th>
                <th className="p-3">Updated Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDeliveries.map((del) => (
                <tr key={del.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono text-xs font-semibold text-slate-700">{del.id.slice(0, 8)}...</td>
                  <td className="p-3 font-semibold text-slate-900">{del.donation?.foodName || "—"}</td>
                  <td className="p-3">{del.donor?.firstName} {del.donor?.lastName}</td>
                  <td className="p-3">
                    {del.volunteer ? `${del.volunteer.firstName} ${del.volunteer.lastName}` : (
                      <span className="text-amber-600 font-semibold text-xs bg-amber-50 px-2 py-0.5 rounded-full">Unassigned</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-800">
                      {del.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(del.updatedAt).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedDelivery(del);
                        setNewStatus(del.status);
                      }}
                      className="rounded-xl p-2 text-emerald-600 transition hover:bg-emerald-50"
                      title="Update Delivery Status"
                    >
                      <Edit3 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Status Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Update Delivery Status</h3>
              <button onClick={() => setSelectedDelivery(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="mt-6 space-y-4">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Delivery ID</p>
                <p className="font-mono text-sm font-bold text-slate-900">{selectedDelivery.id}</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500">Select Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm font-bold focus:border-emerald-600 focus:outline-none"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="PICKED_UP">PICKED_UP</option>
                  <option value="IN_TRANSIT">IN_TRANSIT</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedDelivery(null)}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Update Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
