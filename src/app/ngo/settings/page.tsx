"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, CheckCircle2 } from "lucide-react";

export default function NgoSettingsPage() {
  const [approvalAlerts, setApprovalAlerts] = useState(true);
  const [success, setSuccess] = useState(false);

  function handleSave() {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/ngo/dashboard"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-black text-slate-900">NGO Settings</h1>
        <p className="text-slate-500">Configure food request status alerts and notifications.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-emerald-800 text-sm font-semibold">
          <CheckCircle2 size={18} /> Settings saved successfully!
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Bell size={20} className="text-emerald-600" /> Food Approval Alerts
          </h2>
          <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
            <div>
              <p className="text-sm font-bold text-slate-900">Request Status Notifications</p>
              <p className="text-xs text-slate-500">Receive alerts when a donor approves or rejects your request.</p>
            </div>
            <input
              type="checkbox"
              checked={approvalAlerts}
              onChange={(e) => setApprovalAlerts(e.target.checked)}
              className="h-5 w-5 rounded text-emerald-600 focus:ring-emerald-500"
            />
          </label>
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
