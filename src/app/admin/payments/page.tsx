"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, History, Shield, Download, RefreshCw } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import RazorpayModal from "@/components/payment/RazorpayModal";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/history");
      const data = await res.json();
      if (res.ok) {
        setPayments(data.payments || []);
        setTotalAmount(data.totalAmount || 0);
      }
    } catch (err) {
      console.error("Fetch admin payments error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const exportCSV = () => {
    if (payments.length === 0) return;
    const headers = ["Payment ID", "Order ID", "User", "Role", "Amount (INR)", "Status", "Purpose", "Date"];
    const rows = payments.map((p) => [
      p.razorpayPaymentId || "N/A",
      p.razorpayOrderId,
      `"${p.user?.firstName || ""} ${p.user?.lastName || ""}"`,
      p.role || p.user?.role,
      p.amount,
      p.status,
      `"${p.purpose}"`,
      new Date(p.createdAt).toISOString(),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `razorpay_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#f8faf8] py-10">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:underline mb-2">
                <ArrowLeft size={16} /> Back to Admin Dashboard
              </Link>
              <h1 className="text-3xl font-black text-emerald-950">Razorpay Financial Overview 📊</h1>
              <p className="text-xs text-slate-500 mt-1">
                Audit global platform monetary donations, logistics funding, and Razorpay transactions across all user roles.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchPayments}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
              >
                <RefreshCw size={16} /> Refresh
              </button>

              <button
                onClick={exportCSV}
                className="flex items-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-xs font-bold text-white hover:bg-emerald-800 shadow-md"
              >
                <Download size={16} /> Export CSV Report
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Funds Collected</p>
              <p className="mt-2 text-3xl font-black text-emerald-700">₹{totalAmount.toLocaleString()}</p>
              <p className="mt-1 text-[11px] text-slate-400">Recorded via Razorpay Gateway</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Transactions</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{payments.length}</p>
              <p className="mt-1 text-[11px] text-slate-400">Donor, NGO & Volunteer Payments</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Successful Rate</p>
              <p className="mt-2 text-3xl font-black text-blue-700">
                {payments.length > 0
                  ? `${Math.round((payments.filter((p) => p.status === "SUCCESS").length / payments.length) * 100)}%`
                  : "100%"}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">PostgreSQL Verified Status</p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Razorpay Direct Order Tester (4 Cols) */}
            <div className="lg:col-span-4">
              <RazorpayModal
                defaultAmount={1000}
                purpose="Admin Platform Operations & Food Rescue Grant"
                buttonLabel="Test Razorpay Gateway"
                onSuccess={fetchPayments}
              />
            </div>

            {/* Global Transactions Table (8 Cols) */}
            <div className="lg:col-span-8">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <History size={20} className="text-emerald-600" />
                    <h3 className="text-lg font-bold text-slate-900">All System Payment Transactions</h3>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {payments.length} Records
                  </span>
                </div>

                {loading ? (
                  <div className="py-12 text-center text-xs text-slate-400">Loading all payment records...</div>
                ) : payments.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 p-8 text-center border border-dashed border-slate-200">
                    <CreditCard className="mx-auto mb-2 text-slate-400" size={32} />
                    <p className="text-xs text-slate-500">No payment transactions recorded in PostgreSQL.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                          <th className="pb-3">User & Role</th>
                          <th className="pb-3">Purpose</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {payments.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50 transition">
                            <td className="py-3 font-semibold text-slate-900">
                              <div>
                                {p.user?.firstName} {p.user?.lastName}
                              </div>
                              <div className="text-[10px] text-slate-400 font-normal">
                                {p.user?.email} • <span className="font-bold text-emerald-700">{p.role || p.user?.role}</span>
                              </div>
                            </td>
                            <td className="py-3 text-slate-600 max-w-[200px] truncate">{p.purpose}</td>
                            <td className="py-3 font-bold text-slate-900">₹{p.amount}</td>
                            <td className="py-3">
                              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                p.status === "SUCCESS" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                              }`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="py-3 text-right text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
