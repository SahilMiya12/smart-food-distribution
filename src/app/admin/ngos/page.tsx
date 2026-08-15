"use client";

import { useEffect, useState } from "react";
import { Building, Search, Loader2 } from "lucide-react";

export default function AdminNgosPage() {
  const [ngos, setNgos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchNgos();
  }, []);

  function fetchNgos() {
    setLoading(true);
    fetch("/api/admin/users?role=NGO")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setNgos(data);
        } else {
          setNgos([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setNgos([]);
        setLoading(false);
      });
  }

  const filteredNgos = ngos.filter((n) =>
    `${n.firstName} ${n.lastName} ${n.email} ${n.organizationName || ""} ${n.city || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">NGO Management</h1>
        <p className="text-sm text-slate-500">View non-profit partners requesting food assistance.</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search NGOs by name, organization, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-emerald-600 focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : filteredNgos.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <Building size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-800">No NGO records found.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase text-slate-400">
              <tr>
                <th className="p-3">Organization Name</th>
                <th className="p-3">Representative</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Phone</th>
                <th className="p-3">City</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNgos.map((n) => (
                <tr key={n.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-900">{n.organizationName || `${n.firstName}'s NGO`}</td>
                  <td className="p-3">{n.firstName} {n.lastName}</td>
                  <td className="p-3">{n.email}</td>
                  <td className="p-3">{n.phone || "—"}</td>
                  <td className="p-3">{n.city || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
