"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetData, setResetData] = useState<{ message: string; resetUrl?: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResetData(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to process request");
      }

      setResetData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faf8] px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/login" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-900">
          <ArrowLeft size={16} /> Back to Sign In
        </Link>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Heart className="fill-emerald-700 text-emerald-700" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-emerald-950">Forgot Password?</h1>
            <p className="mt-2 text-xs text-gray-500">
              Enter your email address and we'll generate a password reset link for your account.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          {resetData ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 text-center">
                <CheckCircle2 className="mx-auto mb-2 text-emerald-600" size={32} />
                <h3 className="font-bold text-emerald-950 text-sm">Reset Token Generated</h3>
                <p className="mt-1 text-xs text-emerald-700">{resetData.message}</p>

                {resetData.resetUrl && (
                  <div className="mt-4 pt-3 border-t border-emerald-200">
                    <p className="text-[11px] text-emerald-800 mb-2 font-semibold">Click to reset your password:</p>
                    <Link
                      href={resetData.resetUrl}
                      className="inline-block w-full rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
                    >
                      Proceed to Reset Password
                    </Link>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setResetData(null)}
                className="w-full text-center text-xs text-emerald-700 hover:underline font-semibold"
              >
                Send another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60 text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating Link...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
