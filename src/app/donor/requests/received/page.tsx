"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Clock,
  Package,
  User,
  X,
} from "lucide-react";

type RequestItem = {
  id: string;
  status: string;
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

export default function ReceivedRequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function fetchRequests() {
    try {
      const response = await fetch("/api/requests");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load requests"
        );
      }

      setRequests(data.requests);
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
  action: "approve" | "reject"
) {
  try {
    setActionId(requestId);

    const response = await fetch(
      `/api/requests/${requestId}/${action}`,
      {
        method: "PATCH",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Action failed");
      return;
    }

    alert(
      action === "approve"
        ? "Request approved successfully"
        : "Request rejected successfully"
    );

    // Refresh requests from database
    await fetchRequests();

  } catch (error) {
    console.error("Request action error:", error);
    alert("Something went wrong");
  } finally {
    setActionId(null);
  }
}

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        dateStyle: "medium",
      }
    );
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-10">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
        <div className="mt-8 h-48 animate-pulse rounded-3xl bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
            Donor Center
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Received Requests
          </h1>

          <p className="mt-2 text-slate-500">
            Review NGOs requesting your donated food.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {requests.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-12 text-center">
            <Package
              size={56}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No requests yet
            </h2>

            <p className="mt-2 text-slate-500">
              NGOs will appear here when they request your donated food.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {requests.map((item) => {
              const isPending =
                item.status === "PENDING";

              return (
                <div
                  key={item.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
                        <Package
                          className="text-emerald-700"
                          size={26}
                        />
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          {item.donation.foodName}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          {item.donation.quantity}{" "}
                          {item.donation.unit} ·{" "}
                          {item.donation.pickupCity}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          Requested on{" "}
                          {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${
                        item.status === "PENDING"
                          ? "bg-amber-100 text-amber-700"
                          : item.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="my-6 h-px bg-slate-100" />

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                        <User
                          size={20}
                          className="text-slate-600"
                        />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {item.ngo.firstName}{" "}
                          {item.ngo.lastName}
                        </p>

                        <p className="text-sm text-slate-500">
                          {item.ngo.email}
                        </p>
                      </div>
                    </div>

                    {isPending && (
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            updateRequest(
                              item.id,
                              "reject"
                            )
                          }
                          disabled={
                            actionId === item.id
                          }
                          className="flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <X size={17} />
                          Reject
                        </button>

                        <button
                          onClick={() =>
                            updateRequest(
                              item.id,
                              "approve"
                            )
                          }
                          disabled={
                            actionId === item.id
                          }
                          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                        >
                          <Check size={17} />
                          {actionId === item.id
                            ? "Processing..."
                            : "Approve"}
                        </button>
                      </div>
                    )}

                    {!isPending && (
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock size={17} />
                        Request processed
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}