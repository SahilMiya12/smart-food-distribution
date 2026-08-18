"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Missing reset token. Please request a new password reset link.");
    }
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setSuccess(data.message);
      setTimeout(() => router.push("/login"), 2000);
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
            <h1 className="text-2xl font-bold text-emerald-950">Set New Password</h1>
            <p className="mt-2 text-xs text-gray-500">
              Enter your new secure password below to update your account.
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-600">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-700">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Save New Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf8]">
        <Loader2 className="animate-spin text-emerald-700" size={32} />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
