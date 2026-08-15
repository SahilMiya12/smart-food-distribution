"use client";

import { useEffect, useState } from "react";
import {
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";

type Delivery = {
  id: string;
  status: string;
  pickupAddress: string;
  deliveryAddress: string;
  donation: {
    foodName: string;
    quantity: number;
    unit: string;
    category: string;
  };
};

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeliveries() {
      try {
        const response = await fetch("/api/deliveries");

        if (!response.ok) {
          throw new Error("Failed to fetch deliveries");
        }

        const data = await response.json();

        setDeliveries(data.deliveries || []);
      } catch (error) {
        console.error("Fetch deliveries error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDeliveries();
  }, []);

  function formatStatus(status: string) {
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-700";

      case "IN_TRANSIT":
        return "bg-blue-100 text-blue-700";

      case "PICKED_UP":
        return "bg-purple-100 text-purple-700";

      case "ASSIGNED":
        return "bg-amber-100 text-amber-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-6xl">
          <div className="h-10 w-64 animate-pulse rounded-xl bg-slate-200" />

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-3xl bg-slate-200"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
              <Truck
                size={25}
                className="text-emerald-700"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Deliveries
              </h1>

              <p className="mt-1 text-slate-500">
                Track and manage your food deliveries.
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {deliveries.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <Truck
                size={38}
                className="text-slate-400"
              />
            </div>

            <h2 className="mt-6 text-xl font-bold text-slate-900">
              No deliveries yet
            </h2>

            <p className="mt-2 text-slate-500">
              Your delivery activity will appear here.
            </p>
          </div>
        )}

        {/* Delivery Cards */}
        {deliveries.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {deliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                      {delivery.donation.category}
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      {delivery.donation.foodName}
                    </h2>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                      delivery.status
                    )}`}
                  >
                    {formatStatus(delivery.status)}
                  </span>
                </div>

                {/* Food Info */}
                <div className="mt-6 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                  <Package
                    size={22}
                    className="text-emerald-600"
                  />

                  <div>
                    <p className="text-xs text-slate-500">
                      Food Quantity
                    </p>

                    <p className="font-bold text-slate-900">
                      {delivery.donation.quantity}{" "}
                      {delivery.donation.unit}
                    </p>
                  </div>
                </div>

                {/* Pickup */}
                <div className="mt-5 flex gap-3">
                  <MapPin
                    size={20}
                    className="mt-1 shrink-0 text-emerald-600"
                  />

                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      PICKUP LOCATION
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {delivery.pickupAddress}
                    </p>
                  </div>
                </div>

                {/* Delivery */}
                <div className="mt-4 flex gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-1 shrink-0 text-blue-600"
                  />

                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      DELIVERY LOCATION
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {delivery.deliveryAddress}
                    </p>
                  </div>
                </div>

                {/* Status Footer */}
                <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-5 text-sm text-slate-500">
                  <Clock size={16} />
                  Delivery status:{" "}
                  <span className="font-semibold text-slate-700">
                    {formatStatus(delivery.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}