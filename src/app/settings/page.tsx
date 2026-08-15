"use client";

import {
  Bell,
  Lock,
  ShieldCheck,
  Settings as SettingsIcon,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">

      <div>
        <p className="text-sm font-semibold text-emerald-600">
          Account
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Settings
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your preferences and account security.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Bell size={22} />
          </div>

          <h2 className="font-bold text-slate-900">
            Notifications
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Manage how you receive updates about donations,
            requests, and deliveries.
          </p>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm font-semibold">
              Email Notifications
            </span>

            <input
              type="checkbox"
              defaultChecked
              className="h-5 w-5 accent-emerald-600"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <Lock size={22} />
          </div>

          <h2 className="font-bold text-slate-900">
            Security
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Keep your account secure and manage your password.
          </p>

          <button className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800">
            Change Password
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <ShieldCheck size={22} />
          </div>

          <h2 className="font-bold text-slate-900">
            Privacy
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Your account information is protected and securely stored.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <SettingsIcon size={22} />
          </div>

          <h2 className="font-bold text-slate-900">
            Preferences
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Customize your FoodBridge experience.
          </p>
        </div>

      </div>
    </div>
  );
}