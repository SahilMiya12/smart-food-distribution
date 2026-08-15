"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  MapPin,
  Calendar,
  Clock,
  Phone,
  User,
  CheckCircle,
  QrCode,
  KeyRound,
  Loader2,
  AlertCircle,
  Truck,
} from "lucide-react";

type Props = {
  params: Promise<{
    deliveryId: string;
  }>;
};

export default function DeliveryDetailsPage({ params }: Props) {
  const { deliveryId } = use(params);
  const [delivery, setDelivery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // OTP modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);

  // QR modal state
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [qrSuccess, setQrSuccess] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchDelivery();
  }, [deliveryId]);

  function fetchDelivery() {
    setLoading(true);
    fetch(`/api/deliveries/${deliveryId}`)
      .then((res) => res.json())
      .then((data) => {
        setDelivery(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  async function updateStatus(status: string) {
    try {
      setUpdating(true);
      setError("");

      const res = await fetch(`/api/deliveries/${deliveryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        const updated = await res.json();
        setDelivery(updated);
      } else {
        setError("Failed to update status");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setUpdating(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    try {
      setUpdating(true);
      setError("");

      const res = await fetch(`/api/deliveries/${deliveryId}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });

      if (res.ok) {
        setOtpSuccess(true);
        setTimeout(() => {
          setShowOtpModal(false);
          setOtpSuccess(false);
          fetchDelivery();
        }, 1500);
      } else {
        setError("Invalid OTP entered. Please try again.");
      }
    } catch (err) {
      setError("OTP Verification failed");
    } finally {
      setUpdating(false);
    }
  }

  async function handleVerifyQr(e: React.FormEvent) {
    e.preventDefault();
    try {
      setUpdating(true);
      setError("");

      const res = await fetch(`/api/deliveries/${deliveryId}/verify-qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrPayload: qrCode || `DELIVERY-${deliveryId}` }),
      });

      if (res.ok) {
        setQrSuccess(true);
        setTimeout(() => {
          setShowQrModal(false);
          setQrSuccess(false);
          fetchDelivery();
        }, 1500);
      } else {
        setError("Invalid QR payload entered.");
      }
    } catch (err) {
      setError("QR Verification failed");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!delivery || delivery.message) {
    return (
      <div className="mx-auto max-w-4xl p-8">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-800">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold">Delivery Not Found</h2>
          <p className="mt-2 text-sm">The requested delivery does not exist or has been removed.</p>
          <Link
            href="/volunteer/deliveries"
            className="mt-6 inline-flex rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Back to Deliveries
          </Link>
        </div>
      </div>
    );
  }

  const { donation, donor, volunteer, status, pickupAddress, deliveryAddress } = delivery;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href="/volunteer/deliveries"
        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
      >
        <ArrowLeft size={18} />
        Back to Available Deliveries
      </Link>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-red-800">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900">
                Delivery #{delivery.id.slice(0, 8)}
              </h1>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                {status}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">Food distribution & pickup tracking</p>
          </div>

          {volunteer && (
            <div className="text-right text-xs">
              <p className="text-slate-400 font-bold uppercase">Assigned Volunteer</p>
              <p className="font-bold text-slate-800 text-sm">{volunteer.firstName} {volunteer.lastName}</p>
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {/* Left details */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                <Package size={22} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Food Item</p>
                <h3 className="text-lg font-bold text-slate-900">{donation?.foodName || "Surplus Food"}</h3>
                <p className="text-sm text-slate-600">
                  {donation?.quantity} {donation?.unit} • Category: {donation?.category || "General"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                <User size={22} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Donor</p>
                <h3 className="text-lg font-bold text-slate-900">
                  {donor?.organizationName || `${donor?.firstName} ${donor?.lastName}`}
                </h3>
                {donor?.phone && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-slate-600">
                    <Phone size={14} /> {donor.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right addresses */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-red-100 p-3 text-red-600">
                <MapPin size={22} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Pickup Address</p>
                <p className="font-semibold text-slate-900">{pickupAddress || donation?.pickupAddress || "Pickup location provided upon claim"}</p>
                <p className="text-xs text-slate-500">{donation?.pickupCity}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-purple-100 p-3 text-purple-600">
                <Truck size={22} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Delivery Address</p>
                <p className="font-semibold text-slate-900">{deliveryAddress || "Destination NGO center address"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="mt-10 flex flex-wrap gap-4 border-t border-slate-100 pt-6">
          {status === "PENDING" && (
            <button
              onClick={() => updateStatus("ASSIGNED")}
              disabled={updating}
              className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              Accept Delivery
            </button>
          )}

          {status === "ASSIGNED" && (
            <button
              onClick={() => setShowOtpModal(true)}
              className="flex items-center gap-2 rounded-2xl bg-amber-600 px-6 py-3 font-semibold text-white transition hover:bg-amber-700"
            >
              <KeyRound size={18} /> Verify Pickup (OTP)
            </button>
          )}

          {(status === "PICKED_UP" || status === "IN_TRANSIT") && (
            <>
              <button
                onClick={() => updateStatus("IN_TRANSIT")}
                disabled={updating || status === "IN_TRANSIT"}
                className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                Mark In-Transit
              </button>

              <button
                onClick={() => setShowQrModal(true)}
                className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
              >
                <QrCode size={18} /> Verify Delivery (QR Code)
              </button>
            </>
          )}

          {status === "DELIVERED" && (
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm bg-emerald-50 px-4 py-3 rounded-2xl">
              <CheckCircle size={20} />
              Delivery Completed & Verified Successfully
            </div>
          )}
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">OTP Pickup Verification</h3>
            <p className="mt-1 text-xs text-slate-500">Ask the donor for the pickup OTP code to verify handoff.</p>

            {otpSuccess ? (
              <div className="mt-6 flex items-center gap-2 text-emerald-700 font-bold text-sm bg-emerald-50 p-4 rounded-2xl">
                <CheckCircle size={20} /> OTP Verified! Pickup confirmed.
              </div>
            ) : (
              <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500">4-Digit Pickup OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="e.g. 4829"
                    className="mt-2 w-full rounded-2xl border border-slate-200 p-4 text-center font-mono text-2xl font-bold tracking-widest focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowOtpModal(false)}
                    className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="rounded-2xl bg-amber-600 px-6 py-3 font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50"
                  >
                    {updating ? "Verifying..." : "Verify & Pick Up"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* QR Code Verification Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">QR Code Delivery Verification</h3>
            <p className="mt-1 text-xs text-slate-500">Scan or enter the NGO recipient's QR verification code.</p>

            {qrSuccess ? (
              <div className="mt-6 flex items-center gap-2 text-emerald-700 font-bold text-sm bg-emerald-50 p-4 rounded-2xl">
                <CheckCircle size={20} /> QR Code Verified! Delivery completed.
              </div>
            ) : (
              <form onSubmit={handleVerifyQr} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500">QR Payload Code</label>
                  <input
                    type="text"
                    value={qrCode}
                    onChange={(e) => setQrCode(e.target.value)}
                    placeholder={`DELIVERY-${deliveryId.slice(0, 8)}`}
                    className="mt-2 w-full rounded-2xl border border-slate-200 p-4 font-mono text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowQrModal(false)}
                    className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {updating ? "Verifying..." : "Confirm Delivery"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}