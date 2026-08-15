import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ deliveryId: string }> }
) {
  try {
    const { deliveryId } = await params;
    const body = await request.json();
    const { qrPayload } = body;

    if (!qrPayload) {
      return NextResponse.json({ message: "Invalid QR code payload" }, { status: 400 });
    }

    const delivery = await prisma.delivery.update({
      where: { id: deliveryId },
      data: {
        status: "DELIVERED",
        deliveredAt: new Date(),
      },
    });

    await prisma.foodDonation.update({
      where: { id: delivery.donationId },
      data: { status: "DELIVERED" },
    });

    return NextResponse.json({ success: true, message: "QR verification completed successfully!", delivery });
  } catch (error) {
    console.error("VERIFY QR ERROR:", error);
    return NextResponse.json({ message: "Failed to verify QR code" }, { status: 500 });
  }
}
