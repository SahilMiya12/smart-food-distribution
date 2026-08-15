import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ deliveryId: string }> }
) {
  try {
    const { deliveryId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: {
        donation: {
          select: {
            id: true,
            foodName: true,
            description: true,
            category: true,
            quantity: true,
            unit: true,
            pickupAddress: true,
            pickupCity: true,
            expiryDate: true,
            imageUrl: true,
          },
        },
        donor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            organizationName: true,
          },
        },
        volunteer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    if (!delivery) {
      return NextResponse.json({ message: "Delivery not found" }, { status: 404 });
    }

    return NextResponse.json(delivery);
  } catch (error) {
    console.error("GET DELIVERY ERROR:", error);
    return NextResponse.json({ message: "Failed to fetch delivery" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ deliveryId: string }> }
) {
  try {
    const { deliveryId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ message: "Invalid authentication" }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    const currentDelivery = await prisma.delivery.findUnique({
      where: { id: deliveryId },
    });

    if (!currentDelivery) {
      return NextResponse.json({ message: "Delivery not found" }, { status: 404 });
    }

    const updated = await prisma.delivery.update({
      where: { id: deliveryId },
      data: {
        status,
        pickedUpAt: status === "PICKED_UP" || status === "IN_TRANSIT" ? new Date() : currentDelivery.pickedUpAt,
        deliveredAt: status === "DELIVERED" ? new Date() : currentDelivery.deliveredAt,
      },
    });

    // Also update donation status accordingly
    if (status === "DELIVERED") {
      await prisma.foodDonation.update({
        where: { id: currentDelivery.donationId },
        data: { status: "DELIVERED" },
      });
    } else if (status === "PICKED_UP" || status === "IN_TRANSIT") {
      await prisma.foodDonation.update({
        where: { id: currentDelivery.donationId },
        data: { status: status },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("UPDATE DELIVERY STATUS ERROR:", error);
    return NextResponse.json({ message: "Failed to update delivery" }, { status: 500 });
  }
}
