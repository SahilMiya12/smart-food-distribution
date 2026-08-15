"use client";

import Link from "next/link";
import {
  Package,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";

type Delivery = {
  id: string;
  foodName: string;
  quantity: number;
  unit: string;
  pickupCity: string;
  expiryDate: string;
  donor: {
    firstName: string;
    lastName: string;
  };
};

type Props = {
  deliveries: Delivery[];
};

export default function DeliveryCard({
  deliveries,
}: Props) {
  if (!deliveries || deliveries.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
        <Package
          size={70}
          className="mx-auto text-slate-300"
        />

        <h2 className="mt-5 text-2xl font-bold text-slate-800">
          No Deliveries
        </h2>

        <p className="mt-2 text-slate-500">
          There are currently no deliveries available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      <h2 className="text-2xl font-bold">
        Available Deliveries
      </h2>

      {deliveries.map((delivery) => (
        <div
          key={delivery.id}
          className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >

          <div className="flex items-start justify-between">

            <div>

              <h3 className="text-xl font-bold text-slate-900">
                {delivery.foodName}
              </h3>

              <p className="mt-1 text-slate-500">
                Donated by{" "}
                {delivery.donor.firstName}{" "}
                {delivery.donor.lastName}
              </p>

            </div>

            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              AVAILABLE
            </span>

          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <div className="flex items-center gap-3">

              <Package
                className="text-emerald-600"
                size={20}
              />

              <div>

                <p className="text-xs text-slate-500">
                  Quantity
                </p>

                <p className="font-semibold">
                  {delivery.quantity} {delivery.unit}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <MapPin
                className="text-blue-600"
                size={20}
              />

              <div>

                <p className="text-xs text-slate-500">
                  Pickup
                </p>

                <p className="font-semibold">
                  {delivery.pickupCity}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <Clock
                className="text-red-500"
                size={20}
              />

              <div>

                <p className="text-xs text-slate-500">
                  Expiry
                </p>

                <p className="font-semibold">
                  {new Date(
                    delivery.expiryDate
                  ).toLocaleDateString()}
                </p>

              </div>

            </div>

          </div>

          <div className="mt-6 flex justify-end">

            <Link
              href={`/volunteer/deliveries/${delivery.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              View Details

              <ArrowRight size={18} />

            </Link>

          </div>

        </div>
      ))}

    </div>
  );
}