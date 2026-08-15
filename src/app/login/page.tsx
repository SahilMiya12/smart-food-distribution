"use client";

import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.user.role === "DONOR") {
        router.push("/donor/dashboard");
      } else if (data.user.role === "NGO") {
        router.push("/ngo/dashboard");
      } else if (data.user.role === "VOLUNTEER") {
        router.push("/volunteer/dashboard");
      } else if (data.user.role === "ADMIN") {
        router.push("/admin/dashboard");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faf8] px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 text-xl font-bold text-emerald-800">
          <Heart className="fill-emerald-700 text-emerald-700" />
          FoodBridge
        </Link>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-emerald-950">Welcome back 👋</h1>
            <p className="mt-2 text-gray-500">Sign in to continue making an impact.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-emerald-700">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}