"use client";

import { useEffect, useState } from "react";
import { Package, Trash2, Search, Filter, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchDonations();
  }, []);

  function fetchDonations() {
    setLoading(true);
    setError("");
    fetch("/api/admin/donations")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDonations(data);
        } else {
          setDonations([]);
          setError(data.message || "Failed to load donations");
        }
        setLoading(false);
      })
      .catch(() => {
        setDonations([]);
        setError("Error loading donations list");
        setLoading(false);
      });
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete food donation "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/donations?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSuccess(`Donation "${name}" deleted successfully.`);
        setTimeout(() => setSuccess(""), 3000);
        fetchDonations();
      } else {
        const err = await res.json();
        setError(err.message || "Failed to delete donation");
      }
    } catch (err) {
      setError("An unexpected error occurred while deleting donation.");
    }
  }

  const filteredDonations = donations.filter((d) => {
    const matchesSearch =
      `${d.foodName} ${d.category} ${d.pickupCity || ""} ${d.donor?.firstName || ""} ${d.donor?.lastName || ""} ${d.donor?.organizationName || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Food Donations Control</h1>
        <p className="text-sm text-slate-500">Monitor all surplus food items listed across the platform by donors.</p>
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
            placeholder="Search donations by food name, donor, category..."
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
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="REQUESTED">REQUESTED</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="PICKED_UP">PICKED_UP</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="EXPIRED">EXPIRED</option>
          </select>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <Package size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-800">No donations found.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase text-slate-400">
              <tr>
                <th className="p-3">Food Item</th>
                <th className="p-3">Category</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Donor</th>
                <th className="p-3">Status</th>
                <th className="p-3">Expiry Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDonations.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-900">{d.foodName}</td>
                  <td className="p-3">{d.category}</td>
                  <td className="p-3">{d.quantity} {d.unit}</td>
                  <td className="p-3">{d.donor?.organizationName || `${d.donor?.firstName} ${d.donor?.lastName}`}</td>
                  <td className="p-3">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                      {d.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(d.expiryDate).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDelete(d.id, d.foodName)}
                      className="rounded-xl p-2 text-red-600 transition hover:bg-red-50"
                      title="Delete Donation"
                    >
                      <Trash2 size={18} />
                    </button>
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
