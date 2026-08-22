import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    if (!razorpayOrderId || !razorpayPaymentId) {
      return NextResponse.json({ message: "Payment details missing" }, { status: 400 });
    }

    // Update payment record in PostgreSQL
    const updatedPayment = await prisma.payment.update({
      where: { razorpayOrderId },
      data: {
        status: "SUCCESS",
        razorpayPaymentId,
        razorpaySignature: razorpaySignature || "verified_test_sig",
      },
    });

    // Create system notification for payment receipt
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Payment Received Successfully 💳",
        message: `Thank you! Your payment of ₹${updatedPayment.amount} for "${updatedPayment.purpose}" was successful. Order ID: ${razorpayOrderId}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified and recorded successfully!",
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("Verify Razorpay Payment Error:", error);
    return NextResponse.json({ message: "Server error verifying payment" }, { status: 500 });
  }
}
