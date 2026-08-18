"use client";

import { useState } from "react";
import Link from "next/link";
import { Settings, Shield, CheckCircle2, ArrowLeft } from "lucide-react";

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoApproveVolunteers, setAutoApproveVolunteers] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-black text-slate-900">Admin Settings</h1>
        <p className="text-slate-500">Configure global application and system parameters.</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-emerald-800">
          <CheckCircle2 size={18} />
          Admin configuration saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Shield className="text-emerald-600" size={20} />
            System Control & Verification
          </h2>

          <div className="mt-6 space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-semibold text-slate-900">Auto-Approve Volunteers</p>
                <p className="text-xs text-slate-500">Automatically grant active volunteer status upon registration</p>
              </div>
              <input
                type="checkbox"
                checked={autoApproveVolunteers}
                onChange={(e) => setAutoApproveVolunteers(e.target.checked)}
                className="h-5 w-5 rounded accent-emerald-600"
              />
            </label>

            <div className="border-t border-slate-100" />

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-semibold text-slate-900">Maintenance Mode</p>
                <p className="text-xs text-slate-500">Restrict access to admin users during system maintenance</p>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="h-5 w-5 rounded accent-emerald-600"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Save Admin Settings
          </button>
        </div>
      </form>
    </div>
  );
}
