"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  Edit3,
  Trash2,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  ImageIcon,
} from "lucide-react";
import ImageUploadInput from "@/components/common/ImageUploadInput";

type Donation = {
  id: string;
  foodName: string;
  description: string | null;
  category: string;
  quantity: number;
  unit: string;
  imageUrl: string | null;
  expiryDate: string;
  pickupAddress: string;
  pickupCity: string;
  status: string;
  createdAt: string;
};

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Edit Modal State
  const [editDonation, setEditDonation] = useState<Donation | null>(null);
  const [updating, setUpdating] = useState(false);

  async function fetchDonations() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/donations", {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch donations");
      }

      setDonations(data.donations || []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load donations");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDonations();
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete donation "${name}"?`)) return;
    try {
      const res = await fetch(`/api/donations/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSuccess(`Donation "${name}" deleted successfully.`);
        setTimeout(() => setSuccess(""), 3000);
        fetchDonations();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to delete donation");
      }
    } catch (err) {
      setError("An unexpected error occurred while deleting.");
    }
  }

  async function handleUpdateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editDonation) return;

    setUpdating(true);
    setError("");

    try {
      const res = await fetch(`/api/donations/${editDonation.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foodName: editDonation.foodName,
          category: editDonation.category,
          quantity: editDonation.quantity,
          unit: editDonation.unit,
          description: editDonation.description,
          expiryDate: editDonation.expiryDate,
          pickupAddress: editDonation.pickupAddress,
          pickupCity: editDonation.pickupCity,
          imageUrl: editDonation.imageUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Donation and image details updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
        setEditDonation(null);
        fetchDonations();
      } else {
        setError(data.message || "Failed to update donation");
      }
    } catch (err) {
      setError("Failed to submit update");
    } finally {
      setUpdating(false);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getStatusStyle(status: string) {
    switch (status) {
      case "AVAILABLE":
        return "bg-emerald-100 text-emerald-700";
      case "REQUESTED":
      case "ACCEPTED":
      case "ASSIGNED":
        return "bg-blue-100 text-blue-700";
      case "DELIVERED":
        return "bg-slate-100 text-slate-700";
      case "EXPIRED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <Link
              href="/donor/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-600"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              My Donations
            </h1>

            <p className="mt-2 text-slate-500">
              Manage, edit images & food details, and track all your surplus food donations.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchDonations}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <Link
              href="/donor/donations/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Plus size={18} />
              New Donation
            </Link>
          </div>
        </div>

        {/* Notifications */}
        {success && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
            <CheckCircle2 size={18} />
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Donations</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{donations.length}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Available</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {donations.filter((d) => d.status === "AVAILABLE").length}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Claimed / Active</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {donations.filter((d) => ["REQUESTED", "ACCEPTED", "ASSIGNED", "PICKED_UP", "IN_TRANSIT"].includes(d.status)).length}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Delivered</p>
            <p className="mt-2 text-3xl font-bold text-slate-700">
              {donations.filter((d) => d.status === "DELIVERED").length}
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
            <p className="mt-4 text-sm text-slate-500">Loading your donations...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && donations.length === 0 && !error && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
            <Package className="mx-auto text-slate-300" size={56} />
            <h2 className="mt-5 text-xl font-bold text-slate-900">No donations yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Start making an impact by sharing your surplus food with people in need.
            </p>
            <Link
              href="/donor/donations/create"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700"
            >
              <Plus size={18} />
              Create Your First Donation
            </Link>
          </div>
        )}

        {/* Donation Grid */}
        {!loading && donations.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {donations.map((donation) => (
              <div
                key={donation.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image Banner */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  {donation.imageUrl ? (
                    <img
                      src={donation.imageUrl}
                      alt={donation.foodName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-100">
                      <Package size={60} className="text-emerald-500" />
                    </div>
                  )}

                  <span
                    className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${getStatusStyle(
                      donation.status
                    )}`}
                  >
                    {donation.status}
                  </span>
                </div>

                {/* Card Content */}
                <div className="space-y-4 p-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{donation.foodName}</h2>
                    <p className="text-xs text-slate-500">{donation.category}</p>
                  </div>

                  {donation.description && (
                    <p className="line-clamp-2 text-xs leading-5 text-slate-600">{donation.description}</p>
                  )}

                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3.5 text-xs">
                    <span className="text-slate-500">Quantity</span>
                    <span className="font-bold text-slate-900">{donation.quantity} {donation.unit}</span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={15} className="text-emerald-600 shrink-0" />
                      <span>{donation.pickupAddress}, {donation.pickupCity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={15} className="text-emerald-600 shrink-0" />
                      <span>Expires: {formatDate(donation.expiryDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
                  <p className="text-xs text-slate-400">{formatDate(donation.createdAt)}</p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditDonation(donation)}
                      className="flex items-center gap-1 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs"
                    >
                      <Edit3 size={14} className="text-emerald-600" />
                      Edit & Image
                    </button>
                    <button
                      onClick={() => handleDelete(donation.id, donation.foodName)}
                      className="rounded-xl p-2 text-red-600 hover:bg-red-50 transition"
                      title="Delete Donation"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Donation & Image Modal */}
      {editDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900">Edit Donation & Image</h3>
              <button onClick={() => setEditDonation(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="mt-6 space-y-4">
              {/* Image Preview & URL Input */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Donation Image URL</label>
                <div className="flex gap-4 items-center">
                  <div className="h-20 w-24 shrink-0 rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center">
                    {editDonation.imageUrl ? (
                      <img src={editDonation.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="text-slate-400" size={24} />
                    )}
                  </div>
                  <input
                    type="url"
                    value={editDonation.imageUrl || ""}
                    onChange={(e) => setEditDonation({ ...editDonation, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500">Food Name</label>
                  <input
                    type="text"
                    value={editDonation.foodName}
                    onChange={(e) => setEditDonation({ ...editDonation, foodName: e.target.value })}
                    required
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500">Category</label>
                  <select
                    value={editDonation.category}
                    onChange={(e) => setEditDonation({ ...editDonation, category: e.target.value })}
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm font-semibold focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="PREPARED_MEALS">Prepared Meals</option>
                    <option value="FRUITS">Fruits</option>
                    <option value="VEGETABLES">Vegetables</option>
                    <option value="BAKERY">Bakery Items</option>
                    <option value="GROCERY">Grocery Items</option>
                    <option value="DAIRY">Dairy Products</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500">Quantity</label>
                  <input
                    type="number"
                    value={editDonation.quantity}
                    onChange={(e) => setEditDonation({ ...editDonation, quantity: Number(e.target.value) })}
                    required
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500">Unit</label>
                  <select
                    value={editDonation.unit}
                    onChange={(e) => setEditDonation({ ...editDonation, unit: e.target.value })}
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm font-semibold focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="KG">Kilograms</option>
                    <option value="LITERS">Liters</option>
                    <option value="MEALS">Meals</option>
                    <option value="PACKETS">Packets</option>
                    <option value="BOXES">Boxes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500">Description</label>
                <textarea
                  rows={3}
                  value={editDonation.description || ""}
                  onChange={(e) => setEditDonation({ ...editDonation, description: e.target.value })}
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500">Pickup Address</label>
                  <input
                    type="text"
                    value={editDonation.pickupAddress}
                    onChange={(e) => setEditDonation({ ...editDonation, pickupAddress: e.target.value })}
                    required
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500">Pickup City</label>
                  <input
                    type="text"
                    value={editDonation.pickupCity}
                    onChange={(e) => setEditDonation({ ...editDonation, pickupCity: e.target.value })}
                    required
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <ImageUploadInput
                value={editDonation.imageUrl || ""}
                onChange={(url) => setEditDonation({ ...editDonation, imageUrl: url })}
                label="Food Image"
              />

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setEditDonation(null)}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {updating ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}