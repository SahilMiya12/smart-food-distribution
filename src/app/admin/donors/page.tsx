"use client";

import { useEffect, useState } from "react";
import { HeartHandshake, Search, Loader2, Users } from "lucide-react";

export default function AdminDonorsPage() {
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDonors();
  }, []);

  function fetchDonors() {
    setLoading(true);
    fetch("/api/admin/users?role=DONOR")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDonors(data);
        } else {
          setDonors([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setDonors([]);
        setLoading(false);
      });
  }

  const filteredDonors = donors.filter((d) =>
    `${d.firstName} ${d.lastName} ${d.email} ${d.organizationName || ""} ${d.city || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Food Donors</h1>
        <p className="text-sm text-slate-500">Manage registered restaurants, food businesses, and individual donors.</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search donors by name, organization, or city..."
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
        ) : filteredDonors.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <HeartHandshake size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-800">No donor records found.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase text-slate-400">
              <tr>
                <th className="p-3">Donor / Organization</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Phone Number</th>
                <th className="p-3">City</th>
                <th className="p-3">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDonors.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-900">
                    {d.organizationName ? (
                      <>
                        <span>{d.organizationName}</span>
                        <span className="block text-xs font-normal text-slate-500">
                          {d.firstName} {d.lastName}
                        </span>
                      </>
                    ) : (
                      `${d.firstName} ${d.lastName}`
                    )}
                  </td>
                  <td className="p-3">{d.email}</td>
                  <td className="p-3">{d.phone || "—"}</td>
                  <td className="p-3">{d.city || "—"}</td>
                  <td className="p-3">{new Date(d.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
