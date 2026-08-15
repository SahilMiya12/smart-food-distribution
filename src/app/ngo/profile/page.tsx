"use client";

import { useEffect, useState } from "react";
import { Shield, CheckCircle2, Loader2 } from "lucide-react";

export default function NgoProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          organizationName: profile.organizationName,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">NGO Profile</h1>
        <p className="text-slate-500">Manage organization details and contact info.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-emerald-800">
          <CheckCircle2 size={18} />
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-100 text-2xl font-bold text-emerald-700">
            {profile?.organizationName?.[0] || profile?.firstName?.[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {profile?.organizationName || `${profile?.firstName} ${profile?.lastName}`}
            </h2>
            <p className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <Shield size={14} /> Registered NGO
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Organization Name</label>
            <input
              type="text"
              value={profile?.organizationName || ""}
              onChange={(e) => setProfile({ ...profile, organizationName: e.target.value })}
              placeholder="e.g. Helping Hands Foundation"
              className="mt-2 w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-emerald-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Contact First Name</label>
            <input
              type="text"
              value={profile?.firstName || ""}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-emerald-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Contact Last Name</label>
            <input
              type="text"
              value={profile?.lastName || ""}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-emerald-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
            <input
              type="email"
              value={profile?.email || ""}
              disabled
              className="mt-2 w-full rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Phone Number</label>
            <input
              type="text"
              value={profile?.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="mt-2 w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Address</label>
            <input
              type="text"
              value={profile?.address || ""}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              placeholder="123 NGO Street"
              className="mt-2 w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">City</label>
            <input
              type="text"
              value={profile?.city || ""}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              placeholder="New York"
              className="mt-2 w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
