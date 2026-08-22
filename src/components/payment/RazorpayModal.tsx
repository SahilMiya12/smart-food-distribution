"use client";

import { useState } from "react";
import { CreditCard, Loader2, CheckCircle, ShieldCheck, Sparkles } from "lucide-react";

interface RazorpayModalProps {
  defaultAmount?: number;
  purpose?: string;
  onSuccess?: (paymentDetails?: any) => void;
  buttonLabel?: string;
  compact?: boolean;
}

export default function RazorpayModal({
  defaultAmount = 500,
  purpose = "Food Rescue & Logistics Support",
  onSuccess,
  buttonLabel = "Contribute via Razorpay",
  compact = false,
}: RazorpayModalProps) {
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [customPurpose, setCustomPurpose] = useState<string>(purpose);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState<any>(null);

  const presetAmounts = compact ? [50, 100, 200, 500] : [100, 250, 500, 1000, 2500, 5000];

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Create Order via Backend API
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), purpose: customPurpose }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.message || "Failed to create payment order.");
      }

      // 2. Load Razorpay SDK Script
      const isLoaded = await loadRazorpayScript();
      const keyId = orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YourRazorpayKeyHere";

      const options = {
        key: keyId,
        amount: Math.round(orderData.amount * 100),
        currency: orderData.currency || "INR",
        name: "Smart Food Distribution Network",
        description: customPurpose,
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=100",
        order_id: orderData.orderId,
        prefill: {
          name: orderData.user?.name || "Partner User",
          email: orderData.user?.email || "user@example.com",
        },
        theme: {
          color: "#059669",
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/payments/verify-signature", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok) {
              setPaymentSuccess(verifyData.payment);
              if (onSuccess) onSuccess(verifyData.payment);
            } else {
              setError(verifyData.message || "Payment verification failed.");
            }
          } catch (err) {
            setError("Server error verifying payment.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      // Fallback test mode simulation if default test key placeholder is used
      if (keyId === "rzp_test_YourRazorpayKeyHere" || keyId.includes("YourRazorpayKeyHere")) {
        setTimeout(async () => {
          const testPaymentId = `pay_${Math.random().toString(36).substring(2, 12)}`;
          const verifyRes = await fetch("/api/payments/verify-signature", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: orderData.orderId,
              razorpayPaymentId: testPaymentId,
              razorpaySignature: "simulated_test_signature",
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            setPaymentSuccess(verifyData.payment);
            if (onSuccess) onSuccess(verifyData.payment);
          } else {
            setError(verifyData.message || "Verification failed");
          }
          setLoading(false);
        }, 1000);
      } else if (isLoaded && (window as any).Razorpay) {
        const razorpayInstance = new (window as any).Razorpay(options);
        razorpayInstance.open();
      } else {
        throw new Error("Razorpay Checkout failed to initialize.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment error occurred");
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="space-y-4">
        {paymentSuccess ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center space-y-2">
            <CheckCircle size={28} className="mx-auto text-emerald-600" />
            <h4 className="text-sm font-bold text-emerald-950">Payment Verified! ₹{paymentSuccess.amount}</h4>
            <p className="text-[11px] text-emerald-700">Order ID: {paymentSuccess.razorpayOrderId}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Logistics Contribution (₹)
              </label>
              <div className="grid grid-cols-4 gap-1.5 mb-2">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`rounded-xl py-2 text-xs font-bold transition border ${
                      amount === amt
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-xs"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Custom Amount"
                  className="w-full rounded-xl border border-slate-200 py-2 pl-8 pr-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handlePayment}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-xs font-bold text-white shadow-md hover:shadow-lg disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Opening Razorpay Gateway...
                </>
              ) : (
                <>
                  <Sparkles size={15} /> {buttonLabel} (₹{amount})
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <CreditCard size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Razorpay Payment Integration</h3>
          <p className="text-xs text-slate-500">Secure Test Mode Gateway (INR)</p>
        </div>
      </div>

      {paymentSuccess ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center space-y-3">
          <CheckCircle size={40} className="mx-auto text-emerald-600 animate-bounce" />
          <h4 className="text-base font-bold text-emerald-950">Payment Successful! 🎉</h4>
          <p className="text-xs text-emerald-700">
            Amount: <span className="font-bold">₹{paymentSuccess.amount}</span> | Purpose: "{paymentSuccess.purpose}"
          </p>
          <div className="rounded-xl bg-white p-3 text-[11px] font-mono text-slate-600 border border-emerald-200">
            <p>Razorpay Order: {paymentSuccess.razorpayOrderId}</p>
            <p>Payment ID: {paymentSuccess.razorpayPaymentId}</p>
          </div>
          <button
            onClick={() => setPaymentSuccess(null)}
            className="mt-2 text-xs font-bold text-emerald-700 hover:underline"
          >
            Make Another Payment
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Select Amount (₹ INR)
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt)}
                  className={`rounded-xl py-2.5 text-xs font-bold transition border ${
                    amount === amt
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-4 top-3.5 text-sm font-bold text-slate-400">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Custom Amount"
                className="w-full rounded-2xl border border-slate-200 py-3 pl-9 pr-4 text-sm font-bold text-slate-900 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Payment Purpose / Note
            </label>
            <input
              type="text"
              value={customPurpose}
              onChange={(e) => setCustomPurpose(e.target.value)}
              placeholder="e.g. Volunteer Fuel Transport / Community Meal Fund"
              className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-500 flex items-center gap-2 border border-slate-200">
            <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
            <span>Supported via Razorpay Test API. Test Key integrated with PostgreSQL history.</span>
          </div>

          <button
            type="button"
            onClick={handlePayment}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:shadow-emerald-600/40 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Sparkles size={16} /> {buttonLabel} (₹{amount})
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
