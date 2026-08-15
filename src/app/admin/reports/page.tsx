"use client";

import { useEffect, useState } from "react";
import { FileText, Download, Loader2, Package, Truck, Users, CheckCircle2 } from "lucide-react";

export default function AdminReportsPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/reports")
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function handleDownloadCSV() {
    if (!report) return;

    const summary = report.summary || {};
    const csvRows = [
      ["Smart Food Distribution System - Audit Report"],
      ["Generated Date", new Date().toLocaleString()],
      [],
      ["Metric", "Value"],
      ["Total Food Donations", summary.totalDonations || 0],
      ["Total Deliveries", summary.totalDeliveries || 0],
      ["Total Registered Users", summary.totalUsers || 0],
      ["Total Meals Rescued Quantity", summary.totalMealsRescued || 0],
      [],
      ["Donation ID", "Food Name", "Quantity", "Unit", "Status", "Created At"],
    ];

    if (Array.isArray(report.donations)) {
      report.donations.forEach((d: any) => {
        csvRows.push([
          d.id,
          `"${d.foodName.replace(/"/g, '""')}"`,
          d.quantity,
          d.unit,
          d.status,
          new Date(d.createdAt).toISOString(),
        ]);
      });
    }

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `foodbridge_system_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  const summary = report?.summary || {};
  const donations = Array.isArray(report?.donations) ? report.donations : [];
  const deliveries = Array.isArray(report?.deliveries) ? report.deliveries : [];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">System Reports & Exports</h1>
          <p className="text-sm text-slate-500">Generate and export database reports for audit, analytics, and operational compliance.</p>
        </div>

        <button
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 shadow-sm"
        >
          <Download size={18} />
          Export CSV Report
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Food Donations</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{summary.totalDonations || 0}</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Deliveries</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{summary.totalDeliveries || 0}</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{summary.totalUsers || 0}</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Meals Rescued Quantity</p>
          <p className="mt-2 text-3xl font-black text-emerald-600">{summary.totalMealsRescued || 0}</p>
        </div>
      </div>

      {/* Report Breakdown */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Donation Audit Log Breakdown</h2>
        {donations.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">No donation logs found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase text-slate-400">
                <tr>
                  <th className="p-3">Item ID</th>
                  <th className="p-3">Food Name</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donations.map((d: any) => (
                  <tr key={d.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono text-xs text-slate-500">{d.id.slice(0, 8)}...</td>
                    <td className="p-3 font-semibold text-slate-900">{d.foodName}</td>
                    <td className="p-3">{d.quantity} {d.unit}</td>
                    <td className="p-3">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                        {d.status}
                      </span>
                    </td>
                    <td className="p-3">{new Date(d.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
