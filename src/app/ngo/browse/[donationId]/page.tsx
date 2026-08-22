"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  User,
  Send,
  X,
  CreditCard,
  Sparkles,
  Truck,
  ShieldCheck,
} from "lucide-react";
import RazorpayModal from "@/components/payment/RazorpayModal";

type Donation = {
  id: string;
  foodName: string;
  description: string | null;
  category: string;
  quantity: number;
  unit: string;
  imageUrl: string | null;
  preparationDate: string | null;
  expiryDate: string;
  pickupAddress: string;
  pickupCity: string;
  status: string;
  createdAt: string;
  donor: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

export default function DonationDetailsPage() {
  const params = useParams();
  const donationId = params.donationId as string;

  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Request & Payment Checkout States
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestMode, setRequestMode] = useState<"FREE" | "LOGISTICS_FUNDED">("FREE");
  const [logisticsAmount, setLogisticsAmount] = useState(100);
  const [requesting, setRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState("");
  const [requestError, setRequestError] = useState("");
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  useEffect(() => {
    async function fetchDonation() {
      try {
        const response = await fetch(`/api/donations/${donationId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Donation not found");
        }

        setDonation(data.donation);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load donation");
      } finally {
        setLoading(false);
      }
    }

    fetchDonation();
  }, [donationId]);

  function formatDate(date: string) {
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function formatCategory(category: string) {
    return category
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  async function handleConfirmRequest(paymentDetails?: any) {
    try {
      setRequesting(true);
      setRequestError("");
      setRequestSuccess("");

      const response = await fetch(`/api/donations/${donationId}/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: requestMessage.trim()
            ? `${requestMessage.trim()}${paymentDetails ? ` [Paid Logistics Support: ₹${paymentDetails.amount}]` : ""}`
            : paymentDetails ? `Paid Logistics Support: ₹${paymentDetails.amount}` : null,
          isLogisticsFunded: !!paymentDetails,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setRequestError(data.message || "Failed to submit food request");
        return;
      }

      setRequestSuccess(
        paymentDetails
          ? `Food request submitted & logistics funded with ₹${paymentDetails.amount}!`
          : "Food request submitted successfully!"
      );

      setRequestMessage("");
      setShowRequestModal(false);
    } catch (error) {
      console.error("Food request error:", error);
      setRequestError("Something went wrong. Please try again.");
    } finally {
      setRequesting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-5xl">
          <div className="h-10 w-40 animate-pulse rounded-xl bg-slate-200" />
          <div className="mt-8 h-96 animate-pulse rounded-3xl bg-slate-200" />
        </div>
      </main>
    );
  }

  if (error || !donation) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="text-center">
          <Package size={64} className="mx-auto text-slate-300" />
          <h1 className="mt-5 text-2xl font-bold text-slate-900">Donation Not Found</h1>
          <p className="mt-2 text-slate-500">{error || "This donation is no longer available."}</p>
          <Link
            href="/ngo/browse"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            <ArrowLeft size={18} />
            Back to Donations
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/ngo/browse"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-600"
        >
          <ArrowLeft size={18} />
          Back to Donations
        </Link>

        {requestSuccess && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800">
            <CheckCircle2 size={22} />
            <p className="font-semibold">{requestSuccess}</p>
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Hero Image Banner */}
          <div className="relative h-80 overflow-hidden bg-slate-100">
            {donation.imageUrl ? (
              <img src={donation.imageUrl} alt={donation.foodName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-100">
                <Package size={110} strokeWidth={1} className="text-emerald-500" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <span className="absolute right-6 top-6 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-emerald-700 shadow">
              <CheckCircle2 size={16} />
              {donation.status}
            </span>
          </div>

          <div className="p-6 sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
              {/* Left Details */}
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-wider text-emerald-600">
                  {formatCategory(donation.category)}
                </p>
                <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{donation.foodName}</h1>

                {donation.description && (
                  <p className="mt-5 text-base leading-8 text-slate-600">{donation.description}</p>
                )}

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <Package size={22} className="text-emerald-600" />
                    <p className="mt-3 text-sm text-slate-500">Available Quantity</p>
                    <p className="mt-1 text-xl font-bold text-slate-900">
                      {donation.quantity} {donation.unit}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <Clock size={22} className="text-emerald-600" />
                    <p className="mt-3 text-sm text-slate-500">Expiry Date</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">{formatDate(donation.expiryDate)}</p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <MapPin size={22} className="text-emerald-600" />
                    <p className="mt-3 text-sm text-slate-500">Pickup Location</p>
                    <p className="mt-1 font-bold text-slate-900">{donation.pickupCity}</p>
                    <p className="mt-1 text-sm text-slate-500">{donation.pickupAddress}</p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <Calendar size={22} className="text-emerald-600" />
                    <p className="mt-3 text-sm text-slate-500">Posted On</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">{formatDate(donation.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Right Request Sidebar */}
              <div>
                <div className="rounded-3xl border border-slate-200 p-6 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <User size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Donated by</p>
                      <h3 className="font-bold text-slate-900 text-base">
                        {donation.donor.firstName} {donation.donor.lastName}
                      </h3>
                      <p className="text-xs text-slate-400">{donation.donor.email}</p>
                    </div>
                  </div>

                  {requestError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
                      {requestError}
                    </div>
                  )}

                  <button
                    onClick={() => setShowRequestModal(true)}
                    disabled={donation.status !== "AVAILABLE"}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:shadow-emerald-600/40 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    <Send size={18} />
                    {donation.status === "AVAILABLE" ? "Request Food (Checkout)" : "Food Unavailable"}
                  </button>

                  <p className="text-center text-xs leading-relaxed text-slate-400">
                    Request this donation with optional delivery transport sponsorship.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* E-COMMERCE STYLE CHECKOUT & PAYMENT MODAL FOR REQUEST */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Food Request Checkout</h3>
                <p className="text-xs text-slate-500">Reserving: {donation.foodName}</p>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Request Mode Selection (Free vs Sponsored Logistics) */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRequestMode("FREE")}
                className={`rounded-2xl border-2 p-3.5 text-left transition ${
                  requestMode === "FREE"
                    ? "border-emerald-600 bg-emerald-50 shadow-sm"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <Truck size={18} className={requestMode === "FREE" ? "text-emerald-600 mb-1.5" : "text-slate-400 mb-1.5"} />
                <p className="font-bold text-xs text-slate-900">Standard Free Request</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Normal volunteer dispatch</p>
              </button>

              <button
                type="button"
                onClick={() => setRequestMode("LOGISTICS_FUNDED")}
                className={`rounded-2xl border-2 p-3.5 text-left transition ${
                  requestMode === "LOGISTICS_FUNDED"
                    ? "border-emerald-600 bg-emerald-50 shadow-sm"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <CreditCard size={18} className={requestMode === "LOGISTICS_FUNDED" ? "text-emerald-600 mb-1.5" : "text-slate-400 mb-1.5"} />
                <p className="font-bold text-xs text-slate-900">Fund Logistics (Razorpay)</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Priority volunteer pickup</p>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Message to Donor (Optional)
              </label>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Briefly state how your shelter will distribute this food..."
                rows={2}
                className="w-full rounded-2xl border border-slate-200 p-3 text-xs outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            {requestMode === "LOGISTICS_FUNDED" ? (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="rounded-2xl bg-emerald-50 p-3.5 border border-emerald-200 text-xs text-emerald-900 space-y-0.5">
                  <p className="font-bold">⭐ Priority Delivery Guarantee</p>
                  <p className="text-[11px] opacity-90">
                    Sponsoring transport fuel ensures immediate volunteer driver assignment.
                  </p>
                </div>

                <RazorpayModal
                  compact={true}
                  defaultAmount={100}
                  purpose={`Logistics Support for Food Request: ${donation.foodName}`}
                  buttonLabel="Pay & Submit Request"
                  onSuccess={(payment) => handleConfirmRequest(payment)}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleConfirmRequest()}
                disabled={requesting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 disabled:opacity-60"
              >
                {requesting ? "Submitting Request..." : "Confirm Standard Food Request"}
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}