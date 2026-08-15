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
} from "lucide-react";

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

  const [donation, setDonation] =
    useState<Donation | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Request states
  const [showRequestForm, setShowRequestForm] =
    useState(false);

  const [requestMessage, setRequestMessage] =
    useState("");

  const [requesting, setRequesting] =
    useState(false);

  const [requestSuccess, setRequestSuccess] =
    useState("");

  const [requestError, setRequestError] =
    useState("");

  useEffect(() => {
    async function fetchDonation() {
      try {
        const response = await fetch(
          `/api/donations/${donationId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Donation not found"
          );
        }

        setDonation(data.donation);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load donation"
        );
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

  async function handleRequestFood() {
    try {
      setRequesting(true);
      setRequestError("");
      setRequestSuccess("");

      const response = await fetch(
        `/api/donations/${donationId}/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: requestMessage.trim() || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setRequestError(
          data.message ||
            "Failed to submit food request"
        );

        return;
      }

      setRequestSuccess(
        "Food request submitted successfully!"
      );

      setRequestMessage("");
      setShowRequestForm(false);
    } catch (error) {
      console.error(
        "Food request error:",
        error
      );

      setRequestError(
        "Something went wrong. Please try again."
      );
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
          <Package
            size={64}
            className="mx-auto text-slate-300"
          />

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Donation Not Found
          </h1>

          <p className="mt-2 text-slate-500">
            {error ||
              "This donation is no longer available."}
          </p>

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

        {/* Back */}
        <Link
          href="/ngo/browse"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-600"
        >
          <ArrowLeft size={18} />
          Back to Donations
        </Link>

        {/* Success Message */}
        {requestSuccess && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800">
            <CheckCircle2 size={22} />

            <p className="font-semibold">
              {requestSuccess}
            </p>
          </div>
        )}

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Hero */}
<div className="relative h-80 overflow-hidden bg-slate-100">
  {donation.imageUrl ? (
    <img
      src={donation.imageUrl}
      alt={donation.foodName}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-100">
      <Package
        size={110}
        strokeWidth={1}
        className="text-emerald-500"
      />
    </div>
  )}

  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

  <span className="absolute right-6 top-6 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-emerald-700 shadow">
    <CheckCircle2 size={16} />
    {donation.status}
  </span>
</div>

          {/* Content */}
          <div className="p-6 sm:p-10">

            <div className="grid gap-10 lg:grid-cols-[1fr_320px]">

              {/* Left */}
              <div>

                <p className="mb-3 text-sm font-bold uppercase tracking-wider text-emerald-600">
                  {formatCategory(donation.category)}
                </p>

                <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                  {donation.foodName}
                </h1>

                {donation.description && (
                  <p className="mt-5 text-base leading-8 text-slate-600">
                    {donation.description}
                  </p>
                )}

                {/* Info Grid */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2">

                  <div className="rounded-2xl bg-slate-50 p-5">
  <Package
    size={22}
    className="text-emerald-600"
  />

  <p className="mt-3 text-sm text-slate-500">
    Available Quantity
  </p>

  <p className="mt-1 text-xl font-bold text-slate-900">
    {donation.quantity} {donation.unit}
  </p>

  <div className="mt-4 h-2 rounded-full bg-slate-200">
    <div
      className="h-2 rounded-full bg-emerald-500"
      style={{ width: "100%" }}
    />
  </div>
</div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <Clock
                      size={22}
                      className="text-emerald-600"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                      Expiry Date
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {formatDate(
                        donation.expiryDate
                      )}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <MapPin
                      size={22}
                      className="text-emerald-600"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                      Pickup Location
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {donation.pickupCity}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {donation.pickupAddress}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <Calendar
                      size={22}
                      className="text-emerald-600"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                      Posted On
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {formatDate(
                        donation.createdAt
                        
                      )}
                    </p>
                  </div>

                </div>
              </div>

              {/* Donor Sidebar */}
              <div>

                <div className="rounded-3xl border border-slate-200 p-6">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
                    <User
                      size={27}
                      className="text-emerald-700"
                    />
                  </div>

                  <p className="mt-5 text-sm text-slate-500">
                    Donated by
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {donation.donor.firstName}{" "}
                    {donation.donor.lastName}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
  {donation.donor.email}
</p>

                  {/* Request Error */}
                  {requestError && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {requestError}
                    </div>
                  )}

                  {!showRequestForm ? (
                    <>
                      <button
                        onClick={() =>
                          setShowRequestForm(true)
                        }
                        disabled={
                          donation.status !==
                          "AVAILABLE"
                        }
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        <Send size={18} />

                        {donation.status ===
                        "AVAILABLE"
                          ? "Request This Food"
                          : "Food Unavailable"}
                      </button>

                      <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                        Request this donation to begin
                        the food rescue process.
                      </p>
                    </>
                  ) : (
                    <div className="mt-6">

                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900">
                          Request Food
                        </h3>

                        <button
                          onClick={() => {
                            setShowRequestForm(false);
                            setRequestError("");
                          }}
                          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <label className="text-sm font-semibold text-slate-700">
                        Message
                        <span className="font-normal text-slate-400">
                          {" "}
                          (optional)
                        </span>
                      </label>

                      <textarea
                        value={requestMessage}
                        onChange={(event) =>
                          setRequestMessage(
                            event.target.value
                          )
                        }
                        placeholder="Tell the donor why you need this food..."
                        rows={5}
                        className="mt-2 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />

                      <button
                        onClick={
                          handleRequestFood
                        }
                        disabled={requesting}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Send size={17} />

                        {requesting
                          ? "Sending Request..."
                          : "Send Request"}
                      </button>

                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}