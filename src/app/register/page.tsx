"use client";

import Link from "next/link";
import { Heart, User, Building2, Bike, Shield, CheckCircle2, Loader2, KeyRound } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const roles = [
  { id: "DONOR", title: "Food Donor", description: "I want to donate surplus food.", icon: User },
  { id: "NGO", title: "NGO / Organization", description: "I want to receive food donations.", icon: Building2 },
  { id: "VOLUNTEER", title: "Volunteer", description: "I want to help deliver food.", icon: Bike },
  { id: "ADMIN", title: "Administrator", description: "Manage platform, users, and operations.", icon: Shield },
];

export default function RegisterPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("DONOR");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    organizationName: "",
    adminKey: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: selectedRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8faf8] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 text-xl font-bold text-emerald-800">
          <Heart className="fill-emerald-700 text-emerald-700" />
          FoodBridge
        </Link>

        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">Join our community</p>
          <h1 className="text-3xl font-black text-emerald-950">Create an Account 🌱</h1>
          <p className="mt-2 text-sm text-gray-500">Choose your role to get started.</p>
        </div>

        {/* Roles Selector */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={`rounded-2xl border-2 p-4 text-left transition ${
                  isSelected ? "border-emerald-600 bg-emerald-50 shadow-sm" : "border-gray-200 bg-white hover:border-emerald-300"
                }`}
              >
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${
                  isSelected ? "bg-emerald-700 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">{role.title}</h3>
                <p className="mt-1 text-xs text-gray-500 leading-tight">{role.description}</p>
                {isSelected && (
                  <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                    <CheckCircle2 size={14} />
                    Selected
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-emerald-950">
              Register as {roles.find((r) => r.id === selectedRole)?.title}
            </h2>
            <p className="mt-1 text-xs text-gray-500">Enter your details to create your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">First Name</label>
                <input
                  name="firstName"
                  type="text"
                  placeholder="Sahil"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  placeholder="Miya"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
              <p className="mt-2 text-xs text-gray-400">Password must be at least 6 characters.</p>
            </div>

            {selectedRole === "NGO" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Organization Name</label>
                <input
                  name="organizationName"
                  type="text"
                  placeholder="Enter organization name"
                  value={formData.organizationName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            )}

            {selectedRole === "ADMIN" && (
              <div>
                <label className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
                  <span>Admin Secret Key</span>
                  <span className="text-xs text-gray-400 font-normal">Optional / Default: ADMIN123</span>
                </label>
                <div className="relative">
                  <input
                    name="adminKey"
                    type="password"
                    placeholder="Enter admin secret key"
                    value={formData.adminKey}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 pl-11 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                  <KeyRound size={18} className="absolute left-4 top-3.5 text-gray-400" />
                </div>
              </div>
            )}

            <label className="flex items-start gap-3 text-sm text-gray-600">
              <input type="checkbox" required className="mt-1 h-4 w-4 accent-emerald-700" />
              <span>
                I agree to the <span className="font-medium text-emerald-700">Terms of Service</span> and{" "}
                <span className="font-medium text-emerald-700">Privacy Policy</span>.
              </span>
            </label>

            {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>}
            {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{success}</div>}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                `Create ${roles.find((r) => r.id === selectedRole)?.title} Account`
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}