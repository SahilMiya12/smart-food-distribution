"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Shield,
  Phone,
  MapPin,
  Save,
} from "lucide-react";

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
};

export default function ProfilePage() {
  const [user, setUser] =
    useState<UserData | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch(
          "/api/auth/me"
        );

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
        }
      } catch (error) {
        console.error(
          "Failed to load profile",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-slate-200" />
        <div className="mt-8 h-96 animate-pulse rounded-3xl bg-slate-200" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-red-700">
        Failed to load profile.
      </div>
    );
  }

  const initials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`;

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      {/* Header */}
      <div>
        <p className="text-sm font-semibold text-emerald-600">
          Account
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          My Profile
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your personal information and account details.
        </p>
      </div>

      {/* Profile Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-100 text-3xl font-bold text-emerald-700">
            {initials}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {user.firstName} {user.lastName}
            </h2>

            <p className="mt-1 text-slate-500">
              {user.email}
            </p>

            <span className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
            <User size={20} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Personal Information
            </h2>

            <p className="text-sm text-slate-500">
              Your account information
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              First Name
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <User size={18} className="text-slate-400" />
              <span>{user.firstName}</span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Last Name
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <User size={18} className="text-slate-400" />
              <span>{user.lastName}</span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Mail size={18} className="text-slate-400" />
              <span>{user.email}</span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Account Role
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Shield size={18} className="text-slate-400" />
              <span>{user.role}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}