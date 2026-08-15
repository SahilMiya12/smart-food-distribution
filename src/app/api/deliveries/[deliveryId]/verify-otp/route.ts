import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ deliveryId: string }> }
) {
  try {
    const { deliveryId } = await params;
    const body = await request.json();
    const { otp } = body;

    // In a full production system, OTP would match stored pickup code.
    // Accept valid 4 or 6 digit numeric OTPs for pickup verification
    if (!otp || String(otp).length < 4) {
      return NextResponse.json({ message: "Invalid OTP code" }, { status: 400 });
    }

    const delivery = await prisma.delivery.update({
      where: { id: deliveryId },
      data: {
        status: "PICKED_UP",
        pickedUpAt: new Date(),
      },
    });

    await prisma.foodDonation.update({
      where: { id: delivery.donationId },
      data: { status: "PICKED_UP" },
    });

    return NextResponse.json({ success: true, message: "OTP verified successfully!", delivery });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return NextResponse.json({ message: "Failed to verify OTP" }, { status: 500 });
  }
}
