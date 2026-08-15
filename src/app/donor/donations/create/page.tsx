"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Send,
  Upload,
  X,
} from "lucide-react";

type FormData = {
  foodName: string;
  category: string;
  quantity: string;
  unit: string;
  description: string;
  expiryDate: string;
  pickupAddress: string;
  pickupCity: string;
};

const initialFormData: FormData = {
  foodName: "",
  category: "",
  quantity: "",
  unit: "KG",
  description: "",
  expiryDate: "",
  pickupAddress: "",
  pickupCity: "",
};

export default function CreateDonationPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const payload = {
      foodName: formData.foodName.trim(),
      category: formData.category,
      quantity: formData.quantity,
      unit: formData.unit,
      description: formData.description.trim(),
      expiryDate: formData.expiryDate,
      pickupAddress: formData.pickupAddress.trim(),
      pickupCity: formData.pickupCity.trim(),
      imageUrl: imageUrl.trim() || null,
    };

    console.log("SENDING DATA:", payload);

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");

      let result;

      if (contentType?.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);

        throw new Error(
          "Server returned an unexpected response. Check your terminal."
        );
      }

      if (!response.ok) {
        const missingFields = result.missingFields
          ? ` Missing: ${result.missingFields.join(", ")}`
          : "";

        throw new Error(
          `${result.message || "Failed to create donation"}${missingFields}`
        );
      }

      setSuccess("Donation created successfully!");

      setFormData(initialFormData);
      setImageUrl("");

      setTimeout(() => {
        router.push("/donor/donations");
      }, 1200);
    } catch (error) {
      console.error("Donation error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-600"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                <Package size={16} />
                Food Donation
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Create a Donation
              </h1>

              <p className="mt-2 max-w-2xl text-slate-500">
                Share surplus food with NGOs and communities that need it.
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm md:flex">
              <CheckCircle2 className="text-emerald-500" size={20} />

              <div>
                <p className="text-xs text-slate-500">Your impact</p>
                <p className="text-sm font-bold text-slate-900">
                  Every donation matters
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <X className="mt-0.5 shrink-0" size={18} />
            <div>
              <p className="font-semibold">Could not create donation</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle2 size={18} />
            <p className="font-semibold">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Main Form */}
            <div className="space-y-6">
              {/* Basic Information */}
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    Basic Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Tell us about the food you want to donate.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Food Name */}
                  <div>
                    <label
                      htmlFor="foodName"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Food Name <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="foodName"
                      name="foodName"
                      type="text"
                      value={formData.foodName}
                      onChange={handleChange}
                      placeholder="Example: Fresh cooked meals"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="category"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Category <span className="text-red-500">*</span>
                    </label>

                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    >
                      <option value="">Select a category</option>
                      <option value="PREPARED_MEALS">Prepared Meals</option>
                      <option value="FRUITS">Fruits</option>
                      <option value="VEGETABLES">Vegetables</option>
                      <option value="BAKERY">Bakery Items</option>
                      <option value="GROCERY">Grocery Items</option>
                      <option value="DAIRY">Dairy Products</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  {/* Quantity and Unit */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="quantity"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Quantity <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Example: 25"
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="unit"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Unit <span className="text-red-500">*</span>
                      </label>

                      <select
                        id="unit"
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      >
                        <option value="KG">Kilograms</option>
                        <option value="LITERS">Liters</option>
                        <option value="MEALS">Meals</option>
                        <option value="PACKETS">Packets</option>
                        <option value="BOXES">Boxes</option>
                        <option value="ITEMS">Items</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Description
                    </label>

                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Describe the food, preparation details, packaging, and any other useful information..."
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>
              </section>

              {/* Expiry and Pickup */}
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    Expiry & Pickup Details
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Help NGOs understand when and where the food can be
                    collected.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Expiry Date */}
                  <div>
                    <label
                      htmlFor="expiryDate"
                      className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                    >
                      <Clock size={16} className="text-emerald-600" />
                      Expiry Date & Time{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="expiryDate"
                      name="expiryDate"
                      type="datetime-local"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>

                  {/* Pickup Address */}
                  <div>
                    <label
                      htmlFor="pickupAddress"
                      className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                    >
                      <MapPin size={16} className="text-emerald-600" />
                      Pickup Address{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <textarea
                      id="pickupAddress"
                      name="pickupAddress"
                      value={formData.pickupAddress}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Enter the complete pickup address"
                      required
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>

                  {/* Pickup City */}
                  <div>
                    <label
                      htmlFor="pickupCity"
                      className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                    >
                      <Calendar size={16} className="text-emerald-600" />
                      Pickup City <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="pickupCity"
                      name="pickupCity"
                      type="text"
                      value={formData.pickupCity}
                      onChange={handleChange}
                      placeholder="Example: Coimbatore"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>
              </section>

              {/* Image URL */}
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    Food Image
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Optional. Add an image URL for your donation.
                  </p>
                </div>

                <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center">
                  <Upload
                    size={28}
                    className="mx-auto mb-3 text-slate-400"
                  />

                  <p className="mb-3 text-sm text-slate-500">
                    You can add an image URL for now.
                  </p>

                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(event) => setImageUrl(event.target.value)}
                    placeholder="https://example.com/food-image.jpg"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="h-fit space-y-6 lg:sticky lg:top-6">
              {/* Summary */}
              <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
                <h2 className="text-lg font-bold">Donation Summary</h2>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                    <span className="text-sm text-slate-400">Food</span>

                    <span className="text-right text-sm font-semibold">
                      {formData.foodName || "Not added"}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                    <span className="text-sm text-slate-400">Quantity</span>

                    <span className="text-right text-sm font-semibold">
                      {formData.quantity
                        ? `${formData.quantity} ${formData.unit}`
                        : "Not added"}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                    <span className="text-sm text-slate-400">Category</span>

                    <span className="text-right text-sm font-semibold">
                      {formData.category || "Not selected"}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm text-slate-400">Location</span>

                    <span className="text-right text-sm font-semibold">
                      {formData.pickupCity || "Not added"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating Donation...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Publish Donation
                    </>
                  )}
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                  By publishing, you confirm that the food information is
                  accurate and safe for distribution.
                </p>
              </div>

              {/* Tips */}
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
                <h3 className="font-bold text-emerald-900">
                  Tips for a great donation
                </h3>

                <ul className="mt-4 space-y-3 text-sm leading-6 text-emerald-800">
                  <li>✓ Add accurate quantity information</li>
                  <li>✓ Mention the expiry time clearly</li>
                  <li>✓ Provide a complete pickup address</li>
                  <li>✓ Add useful details about the food</li>
                </ul>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}