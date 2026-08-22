import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { amount, purpose = "Food Rescue Support" } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ message: "Valid payment amount is required" }, { status: 400 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YourRazorpayKeyHere";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "YourRazorpayKeySecretHere";

    let razorpayOrderId = `order_${globalThis.crypto.randomUUID().replace(/-/g, "").substring(0, 16)}`;

    // If real/test key secret is configured (not default placeholder), create order via Razorpay API
    if (keyId.startsWith("rzp_test_") && keyId !== "rzp_test_YourRazorpayKeyHere" && keySecret !== "YourRazorpayKeySecretHere") {
      try {
        const authHeader = "Basic " + btoa(`${keyId}:${keySecret}`);
        const response = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100), // amount in paise
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
            notes: {
              userId: user.id,
              userRole: user.role,
              purpose,
            },
          }),
        });

        const orderData = await response.json();
        if (response.ok && orderData.id) {
          razorpayOrderId = orderData.id;
        }
      } catch (err) {
        console.warn("Razorpay API order creation fallback to local test order:", err);
      }
    }

    // Record payment in PostgreSQL
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        razorpayOrderId,
        amount: Number(amount),
        currency: "INR",
        status: "CREATED",
        purpose,
        role: user.role as any,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: razorpayOrderId,
      amount: payment.amount,
      currency: payment.currency,
      keyId,
      user: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Create Razorpay Order Error:", error);
    return NextResponse.json({ message: "Server error creating payment order" }, { status: 500 });
  }
}
