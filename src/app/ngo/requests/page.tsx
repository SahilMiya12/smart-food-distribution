"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  Clock3,
  Inbox,
  MapPin,
  MessageSquare,
  Package,
  X,
  Truck,
  Star,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

type RequestStatus = "PENDING" | "ACCEPTED" | "APPROVED" | "REJECTED";

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
    imageUrl?: string | null;
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
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Rating Modal state
  const [ratingModalRequest, setRatingModalRequest] = useState<FoodRequest | null>(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratedIds, setRatedIds] = useState<string[]>([]);

  async function fetchRequests() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/requests");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch requests");
      }

      setRequests(Array.isArray(data.requests) ? data.requests : []);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  async function handleCancelRequest(requestId: string) {
    if (!confirm("Are you sure you want to withdraw/cancel this food request?")) return;

    try {
      setProcessingId(requestId);
      setError("");

      const response = await fetch(`/api/requests/${requestId}/reject`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel request");
      }

      setSuccess("Food request cancelled successfully.");
      setTimeout(() => setSuccess(""), 4000);

      setRequests((current) =>
        current.map((item) => (item.id === requestId ? { ...item, status: "REJECTED" } : item))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel request");
    } finally {
      setProcessingId(null);
    }
  }

  function handleConfirmReceipt(request: FoodRequest) {
    setRatingModalRequest(request);
  }

  async function handleSubmitRating(e: React.FormEvent) {
    e.preventDefault();
    if (!ratingModalRequest) return;

    setSubmittingRating(true);
    try {
      setRatedIds((prev) => [...prev, ratingModalRequest.id]);
      setSuccess(`Thank you! Verified ${ratingStars}-star food quality rating for "${ratingModalRequest.donation.foodName}".`);
      setTimeout(() => setSuccess(""), 4000);
      setRatingModalRequest(null);
      setRatingComment("");
    } catch (err) {
      setError("Failed to submit food rating.");
    } finally {
      setSubmittingRating(false);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function getStatusStyle(status: RequestStatus) {
    if (status === "ACCEPTED" || status === "APPROVED") {
      return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    }
    if (status === "REJECTED") {
      return "bg-red-100 text-red-700 border border-red-200";
    }
    return "bg-amber-100 text-amber-800 border border-amber-200";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="h-10 w-64 animate-pulse rounded-xl bg-slate-200" />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[1, 2].map((item) => (
              <div key={item} className="h-72 animate-pulse rounded-3xl bg-slate-200" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Inbox size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">My Food Requests</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Track your requested food donations, cancel pending requests, and manage post-delivery confirmation.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Requests</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{requests.length}</p>
          </div>
        </div>

        {/* Notifications */}
        {success && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 text-sm font-semibold">
            <CheckCircle2 size={18} />
            {success}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm font-semibold">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Empty State */}
        {!error && requests.length === 0 && (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <Inbox size={56} className="mx-auto text-slate-300" />
            <h2 className="mt-5 text-xl font-bold text-slate-900">No food requests yet</h2>
            <p className="mt-2 text-slate-500">Browse available food Marketplace to send requests to donors.</p>
            <Link
              href="/ngo/browse"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700"
            >
              Browse Food Marketplace <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Request Cards */}
        {requests.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-2">
            {requests.map((item) => {
              const isApproved = item.status === "APPROVED" || item.status === "ACCEPTED";
              const isPending = item.status === "PENDING";
              const isRejected = item.status === "REJECTED";
              const isRated = ratedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md flex flex-col justify-between"
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between border-b border-slate-100 p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 bg-emerald-100 shrink-0">
                          {item.donation.imageUrl ? (
                            <img src={item.donation.imageUrl} alt={item.donation.foodName} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Package size={22} className="text-emerald-700" />
                            </div>
                          )}
                        </div>

                        <div>
                          <h2 className="font-bold text-slate-900 text-lg">{item.donation.foodName}</h2>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.donation.quantity} {item.donation.unit} · {item.donation.pickupCity}
                          </p>
                        </div>
                      </div>

                      <span className={`rounded-full px-3.5 py-1 text-xs font-bold ${getStatusStyle(item.status)}`}>
                        {isApproved ? "APPROVED" : item.status}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="space-y-4 p-6">
                      {/* Location */}
                      <div className="flex items-start gap-2.5 text-xs text-slate-600">
                        <MapPin size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                        <div>
                          <p className="font-semibold text-slate-800">Pickup Location</p>
                          <p className="text-slate-500">{item.donation.pickupAddress}, {item.donation.pickupCity}</p>
                        </div>
                      </div>

                      {/* Message */}
                      {item.message && (
                        <div className="flex gap-2.5 rounded-2xl bg-slate-50 p-3.5 text-xs text-slate-600">
                          <MessageSquare size={16} className="mt-0.5 shrink-0 text-slate-400" />
                          <p className="leading-relaxed">{item.message}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock3 size={14} />
                        Requested on {formatDate(item.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="border-t border-slate-100 p-6 bg-slate-50/50">
                    {isPending && (
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => handleCancelRequest(item.id)}
                          disabled={processingId === item.id}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-3 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          <X size={16} />
                          {processingId === item.id ? "Cancelling..." : "Cancel / Withdraw Request"}
                        </button>
                        <p className="text-[11px] text-center text-slate-400">
                          Withdraw request to release food for other community shelters.
                        </p>
                      </div>
                    )}

                    {isApproved && (
                      <div className="space-y-3">
                        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1.5">
                            <CheckCircle2 size={16} className="text-emerald-600" /> Request Approved!
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-700">Driver Dispatched 🚚</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href="/ngo/my-food"
                            className="flex items-center justify-center gap-1.5 rounded-2xl bg-slate-900 py-3 text-xs font-bold text-white transition hover:bg-slate-800"
                          >
                            <Truck size={15} /> Track Delivery
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleConfirmReceipt(item)}
                            disabled={isRated}
                            className="flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 py-3 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:bg-emerald-100 disabled:text-emerald-700"
                          >
                            <Star size={15} /> {isRated ? "Verified & Rated ⭐" : "Confirm & Rate"}
                          </button>
                        </div>
                      </div>
                    )}

                    {isRejected && (
                      <div className="rounded-2xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700 flex items-center gap-2">
                        <X size={16} />
                        Request Withdrawn / Rejected.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RATING & FOOD QUALITY FEEDBACK MODAL */}
      {ratingModalRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <form onSubmit={handleSubmitRating} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Confirm Delivery & Quality</h3>
                <p className="text-xs text-slate-500">Food: {ratingModalRequest.donation.foodName}</p>
              </div>
              <button
                type="button"
                onClick={() => setRatingModalRequest(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Rate Food Freshness & Quality</p>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingStars(star)}
                    className="p-1 transition transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      size={28}
                      className={star <= ratingStars ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs font-bold text-amber-600">{ratingStars} / 5 Stars</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Shelter Feedback & Distribution Notes
              </label>
              <textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Describe how many meals were served to community members..."
                rows={3}
                className="w-full rounded-2xl border border-slate-200 p-3 text-xs outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <button
              type="submit"
              disabled={submittingRating}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 disabled:opacity-60"
            >
              <Sparkles size={16} /> Submit Verified Rating & Confirm Receipt
            </button>
          </form>
        </div>
      )}
    </main>
  );
}