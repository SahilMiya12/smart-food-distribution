"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Check,
  Clock3,
  Inbox,
  MapPin,
  MessageSquare,
  Package,
  X,
} from "lucide-react";

type RequestStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED";

type FoodRequest = {
  id: string;
  status: RequestStatus;
  message: string | null;
  createdAt: string;

  donation: {
    id: string;
    foodName: string;
    category: string;
    quantity: number;
    unit: string;
    pickupCity: string;
    pickupAddress: string;
    status: string;
  };

  ngo: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
};

export default function RequestsPage() {
  const [requests, setRequests] =
    useState<FoodRequest[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  async function fetchRequests() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/requests"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch requests"
        );
      }

      setRequests(Array.isArray(data.requests) ? data.requests : []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load requests"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  async function updateRequest(
    requestId: string,
    status: "ACCEPTED" | "REJECTED"
  ) {
    try {
      setProcessingId(requestId);

      const response = await fetch(
        `/api/requests/${requestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update request"
        );
      }

      setRequests((currentRequests) =>
        currentRequests.map((item) =>
          item.id === requestId
            ? {
                ...item,
                status,
              }
            : item
        )
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setProcessingId(null);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  function getStatusStyle(
    status: RequestStatus
  ) {
    if (status === "ACCEPTED") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (status === "REJECTED") {
      return "bg-red-100 text-red-700";
    }

    return "bg-amber-100 text-amber-700";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="h-10 w-64 animate-pulse rounded-xl bg-slate-200" />

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-3xl bg-slate-200"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 lg:p-8">

      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <Inbox
                  className="text-emerald-700"
                  size={24}
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Food Requests
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage requests from NGOs and food rescue organizations.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Total Requests
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {requests.length}
            </p>
          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!error &&
          requests.length === 0 && (
            <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">

              <Inbox
                size={56}
                className="mx-auto text-slate-300"
              />

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No requests yet
              </h2>

              <p className="mt-2 text-slate-500">
                Requests from NGOs will appear here.
              </p>

            </div>
          )}

        {/* Request Cards */}
        {requests.length > 0 && (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">

            {requests.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >

                {/* Card Header */}
                <div className="flex items-start justify-between border-b border-slate-100 p-6">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                      <Package
                        size={22}
                        className="text-emerald-700"
                      />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        {item.donation.foodName}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {item.donation.quantity}{" "}
                        {item.donation.unit}
                      </p>
                    </div>

                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>

                </div>

                {/* Card Content */}
                <div className="space-y-5 p-6">

                  {/* NGO */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Requested By
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {item.ngo.firstName}{" "}
                      {item.ngo.lastName}
                    </p>

                    <p className="text-sm text-slate-500">
                      {item.ngo.email}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="flex gap-3">
                    <MapPin
                      size={19}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Pickup Location
                      </p>

                      <p className="text-sm text-slate-500">
                        {item.donation.pickupAddress},{" "}
                        {item.donation.pickupCity}
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  {item.message && (
                    <div className="flex gap-3 rounded-2xl bg-slate-50 p-4">

                      <MessageSquare
                        size={18}
                        className="mt-0.5 shrink-0 text-slate-500"
                      />

                      <p className="text-sm leading-6 text-slate-600">
                        {item.message}
                      </p>

                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Clock3 size={16} />

                    Requested on{" "}
                    {formatDate(item.createdAt)}
                  </div>

                  {/* Actions */}
                  {item.status === "PENDING" && (
                    <div className="grid grid-cols-2 gap-3 pt-2">

                      <button
                        onClick={() =>
                          updateRequest(
                            item.id,
                            "ACCEPTED"
                          )
                        }
                        disabled={
                          processingId ===
                          item.id
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Check size={18} />

                        {processingId ===
                        item.id
                          ? "Processing..."
                          : "Accept"}
                      </button>

                      <button
                        onClick={() =>
                          updateRequest(
                            item.id,
                            "REJECTED"
                          )
                        }
                        disabled={
                          processingId ===
                          item.id
                        }
                        className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <X size={18} />

                        Reject
                      </button>

                    </div>
                  )}

                  {/* Accepted Message */}
                  {item.status ===
                    "ACCEPTED" && (
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                      <Check size={18} />

                      Request accepted successfully.
                    </div>
                  )}

                  {/* Rejected Message */}
                  {item.status ===
                    "REJECTED" && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                      <X size={18} />

                      Request rejected.
                    </div>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </main>
  );
}