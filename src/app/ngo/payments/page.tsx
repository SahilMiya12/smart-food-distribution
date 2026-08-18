"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, History, Building2, ShieldCheck } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import RazorpayModal from "@/components/payment/RazorpayModal";

export default function NgoPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/payments/history");
      const data = await res.json();
      if (res.ok) {
        setPayments(data.payments || []);
        setTotalAmount(data.totalAmount || 0);
      }
    } catch (err) {
      console.error("Fetch payments error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#f8faf8] py-10">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link href="/ngo/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:underline mb-2">
                <ArrowLeft size={16} /> Back to NGO Dashboard
              </Link>
              <h1 className="text-3xl font-black text-emerald-950">NGO Transport & Delivery Funding 🏢</h1>
              <p className="text-xs text-slate-500 mt-1">
                Contribute logistics funding to expedite volunteer pickup & meal deliveries for your shelter.
              </p>
            </div>

            <div className="rounded-2xl bg-blue-100 px-5 py-3 text-right">
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-800">Total Logistics Support</p>
              <p className="text-2xl font-black text-blue-950">₹{totalAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <RazorpayModal
                defaultAmount={1000}
                purpose="NGO Shelter Logistics & Delivery Contribution"
                buttonLabel="Fund Delivery via Razorpay"
                onSuccess={fetchPayments}
              />
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <History size={20} className="text-emerald-600" />
                    <h3 className="text-lg font-bold text-slate-900">NGO Contribution History</h3>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {payments.length} Transactions
                  </span>
                </div>

                {loading ? (
                  <div className="py-12 text-center text-xs text-slate-400">Loading payments...</div>
                ) : payments.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 p-8 text-center border border-dashed border-slate-200">
                    <CreditCard className="mx-auto mb-2 text-slate-400" size={32} />
                    <p className="text-xs text-slate-500">No logistics contributions recorded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {payments.map((p) => (
                      <div key={p.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                        <div>
                          <p className="text-sm font-bold text-slate-900">₹{p.amount}</p>
                          <p className="text-xs text-slate-500">{p.purpose}</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-mono">{p.razorpayOrderId}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                            {p.status}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
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
