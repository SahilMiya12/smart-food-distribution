"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Package,
  Search,
  SlidersHorizontal,
} from "lucide-react";

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
  donor: {
    firstName: string;
    lastName: string;
  };
};

export default function BrowseDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");

  async function fetchDonations() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (city) params.append("city", city);

      const response = await fetch(
        `/api/donations/available?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch donations"
        );
      }

      setDonations(data.donations || []);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load donations"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDonations();
    }, 400);

    return () => clearTimeout(timer);
  }, [search, category, city]);

  function formatDate(date: string) {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function getCategoryLabel(category: string) {
    return category
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-emerald-600">
            <Package size={18} />
            Food Rescue Marketplace
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Find Food Donations
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Discover available food donations from donors and help distribute
            them to people in need.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <SlidersHorizontal
              size={20}
              className="text-emerald-600"
            />

            <h2 className="font-bold text-slate-900">
              Find the right donation
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr]">
            {/* Search */}
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search food donations..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            >
              <option value="">All Categories</option>
              <option value="PREPARED_MEALS">
                Prepared Meals
              </option>
              <option value="FRUITS">Fruits</option>
              <option value="VEGETABLES">Vegetables</option>
              <option value="BAKERY">Bakery Items</option>
              <option value="GROCERY">Grocery Items</option>
              <option value="DAIRY">Dairy Products</option>
              <option value="OTHER">Other</option>
            </select>

            {/* City */}
            <input
              type="text"
              placeholder="Filter by city..."
              value={city}
              onChange={(event) =>
                setCity(event.target.value)
              }
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Available Donations
            </h2>

            {!loading && (
              <p className="mt-1 text-sm text-slate-500">
                {donations.length} donation
                {donations.length !== 1 ? "s" : ""} available
              </p>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-3xl bg-slate-200"
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && donations.length === 0 && !error && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
            <Package
              size={58}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No donations found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        )}

        {/* Donation Cards */}
        {!loading && donations.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {donations.map((donation) => (
              <div
                key={donation.id}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Card Top */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  {donation.imageUrl ? (
                    <img
                      src={donation.imageUrl}
                      alt={donation.foodName}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-100">
                      <Package
                        size={70}
                        strokeWidth={1.2}
                        className="text-emerald-500 transition duration-300 group-hover:scale-110"
                      />
                    </div>
                  )}

                  <span className="absolute right-4 top-4 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm">
                    AVAILABLE
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                      {getCategoryLabel(donation.category)}
                    </p>

                    <h3 className="text-xl font-bold text-slate-900">
                      {donation.foodName}
                    </h3>

                    {donation.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {donation.description}
                      </p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                    <span className="text-sm text-slate-500">
                      Available Quantity
                    </span>

                    <span className="font-bold text-slate-900">
                      {donation.quantity} {donation.unit}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-start gap-3">
                      <MapPin
                        size={18}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />

                      <span>
                        {donation.pickupCity}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar
                        size={18}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />

                      <span>
                        Expires {formatDate(donation.expiryDate)}
                      </span>
                    </div>
                  </div>

                  {/* Donor */}
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-400">
                      Donated by
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {donation.donor.firstName}{" "}
                      {donation.donor.lastName}
                    </p>
                  </div>

                  {/* Button */}
                  <Link
                    href={`/ngo/browse/${donation.id}`}
                    className="mt-5 flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    View Donation
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}