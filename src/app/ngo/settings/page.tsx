"use client";

import { useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";

export default function NgoSettingsPage() {
  const [newFoodAlerts, setNewFoodAlerts] = useState(true);
  const [approvalAlerts, setApprovalAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">NGO Settings</h1>
        <p className="text-slate-500">Configure alert preferences and notifications.</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-emerald-800">
          <CheckCircle2 size={18} />
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Bell className="text-emerald-600" size={20} />
            Notifications
          </h2>

          <div className="mt-6 space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-semibold text-slate-900">New Food Alerts</p>
                <p className="text-xs text-slate-500">Get notified when new food donations are posted nearby</p>
              </div>
              <input
                type="checkbox"
                checked={newFoodAlerts}
                onChange={(e) => setNewFoodAlerts(e.target.checked)}
                className="h-5 w-5 rounded accent-emerald-600"
              />
            </label>

            <div className="border-t border-slate-100" />

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-semibold text-slate-900">Request Approval Alerts</p>
                <p className="text-xs text-slate-500">Get notified when a donor approves your request</p>
              </div>
              <input
                type="checkbox"
                checked={approvalAlerts}
                onChange={(e) => setApprovalAlerts(e.target.checked)}
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
