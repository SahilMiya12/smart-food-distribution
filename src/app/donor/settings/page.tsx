"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, Lock, Shield, CheckCircle2 } from "lucide-react";

export default function DonorSettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [requestNotifications, setRequestNotifications] = useState(true);
  const [success, setSuccess] = useState(false);

  function handleSave() {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/donor/dashboard"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-black text-slate-900">Donor Settings</h1>
        <p className="text-slate-500">Manage account security, alerts, and notification preferences.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-emerald-800 text-sm font-semibold">
          <CheckCircle2 size={18} /> Settings saved successfully!
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Bell size={20} className="text-emerald-600" /> Notifications & Alerts
          </h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
              <div>
                <p className="text-sm font-bold text-slate-900">New Request Alerts</p>
                <p className="text-xs text-slate-500">Notify when an NGO requests your surplus food.</p>
              </div>
              <input
                type="checkbox"
                checked={requestNotifications}
                onChange={(e) => setRequestNotifications(e.target.checked)}
                className="h-5 w-5 rounded text-emerald-600 focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
              <div>
                <p className="text-sm font-bold text-slate-900">Email Summaries</p>
                <p className="text-xs text-slate-500">Receive weekly donation impact summaries.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-5 w-5 rounded text-emerald-600 focus:ring-emerald-500"
              />
            </label>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Lock size={20} className="text-emerald-600" /> Security
          </h2>
          <p className="text-sm text-slate-500 mb-4">Password updates and authentication protection.</p>
          <button
            onClick={() => alert("Password reset link sent to your registered email.")}
            className="rounded-2xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            Change Password
          </button>
        </div>

        <div className="border-t border-slate-100 pt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
