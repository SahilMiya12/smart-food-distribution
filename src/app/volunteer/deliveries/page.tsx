"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Truck,
  Package,
  MapPin,
  Clock,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  User,
} from "lucide-react";

export default function DeliveriesPage() {
  const [activeTab, setActiveTab] = useState<"available" | "my">("available");
  const [availableDeliveries, setAvailableDeliveries] = useState<any[]>([]);
  const [myDeliveries, setMyDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError("");

      const [resAvail, resMy] = await Promise.all([
        fetch("/api/deliveries/available"),
        fetch("/api/deliveries"),
      ]);

      const dataAvail = await resAvail.json();
      const dataMy = await resMy.json();

      setAvailableDeliveries(Array.isArray(dataAvail.deliveries) ? dataAvail.deliveries : []);
      
      const allMy = Array.isArray(dataMy.deliveries) ? dataMy.deliveries : [];
      // Active deliveries assigned to volunteer (not completed)
      setMyDeliveries(allMy.filter((d: any) => d.status !== "DELIVERED" && d.status !== "CANCELLED"));
    } catch (err) {
      console.error(err);
      setError("Failed to load deliveries");
    } finally {
      setLoading(false);
    }
  }

  async function handleClaimDelivery(deliveryId: string) {
    try {
      setClaimingId(deliveryId);
      setError("");

      const res = await fetch(`/api/deliveries/${deliveryId}/accept`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Delivery accepted successfully! View it under My Deliveries.");
        setTimeout(() => setSuccess(""), 4000);
        fetchData();
        setActiveTab("my");
      } else {
        setError(data.message || "Failed to accept delivery");
      }
    } catch (err) {
      setError("An error occurred while accepting delivery.");
    } finally {
      setClaimingId(null);
    }
  }

  const listToRender = activeTab === "available" ? availableDeliveries : myDeliveries;

  const filteredList = listToRender.filter((item) => {
    const foodName = item.donation?.foodName || item.foodName || "";
    const city = item.donation?.pickupCity || item.pickupCity || "";
    const donorName = item.donor ? `${item.donor.firstName} ${item.donor.lastName}` : "";
    return `${foodName} ${city} ${donorName}`.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Volunteer Deliveries</h1>
          <p className="mt-1 text-sm text-slate-500">
            Browse available food donations or manage your active claimed deliveries.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Navigation Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex rounded-2xl bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab("available")}
            className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${
              activeTab === "available"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Available ({availableDeliveries.length})
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${
              activeTab === "my"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            My Deliveries ({myDeliveries.length})
          </button>
        </div>

        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by food item, city, donor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-emerald-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : filteredList.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
          <Truck size={48} className="mx-auto mb-3 text-slate-300" />
          <h3 className="text-xl font-bold text-slate-800">No Deliveries Found</h3>
          <p className="mt-1 text-sm text-slate-400">
            {activeTab === "available"
              ? "There are currently no new unassigned deliveries available."
              : "You have not accepted any active deliveries yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredList.map((item) => {
            const donation = item.donation || item;
            const donor = item.donor || donation.donor;
            const isClaiming = claimingId === item.id;

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-slate-900">{donation.foodName}</h3>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                      {item.status || "AVAILABLE"}
                    </span>
                  </div>

                  {donor && (
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                      <User size={14} className="text-emerald-600" />
                      Donated by {donor.firstName} {donor.lastName}
                    </p>
                  )}

                  <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Package size={15} className="text-emerald-600" /> Quantity
                      </span>
                      <span className="font-bold text-slate-900">{donation.quantity} {donation.unit}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <MapPin size={15} className="text-blue-600" /> City
                      </span>
                      <span className="font-bold text-slate-900">{donation.pickupCity}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                  <Link
                    href={`/volunteer/deliveries/${item.id}`}
                    className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    View Details <ArrowRight size={14} />
                  </Link>

                  {activeTab === "available" ? (
                    <button
                      onClick={() => handleClaimDelivery(item.id)}
                      disabled={isClaiming}
                      className="rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {isClaiming ? "Accepting..." : "Accept Delivery"}
                    </button>
                  ) : (
                    <Link
                      href={`/volunteer/deliveries/${item.id}`}
                      className="rounded-2xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
                    >
                      Manage & Verify
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}