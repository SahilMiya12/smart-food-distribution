import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    let volunteerId: string | null = null;

    if (token) {
      const user = await verifyToken(token);
      if (user && user.role === "VOLUNTEER") {
        volunteerId = user.id;
      }
    }

    // Available donations / deliveries
    const availableDeliveries = await prisma.foodDonation.findMany({
      where: {
        status: "AVAILABLE",
      },
      include: {
        donor: {
          select: {
            firstName: true,
            lastName: true,
            organizationName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    // Dashboard stats
    const stats = {
      available: await prisma.foodDonation.count({
        where: {
          status: "AVAILABLE",
        },
      }),

      accepted: await prisma.delivery.count({
        where: {
          status: { in: ["ASSIGNED", "PICKED_UP", "IN_TRANSIT"] },
          ...(volunteerId ? { volunteerId } : {}),
        },
      }),

      completed: await prisma.delivery.count({
        where: {
          status: "DELIVERED",
          ...(volunteerId ? { volunteerId } : {}),
        },
      }),

      rating: 4.9,
    };

    // Real Activity from database deliveries
    const activityDeliveries = await prisma.delivery.findMany({
      where: volunteerId ? { volunteerId } : {},
      include: {
        donation: {
          select: { foodName: true },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    });

    const activity = activityDeliveries.map((d) => ({
      id: d.id,
      title: `Delivery ${d.status.replace("_", " ")}`,
      description: d.donation?.foodName || d.pickupAddress,
      time: new Date(d.updatedAt).toLocaleDateString(),
      type: d.status.toLowerCase(),
    }));

    // Real Notifications from database
    const notifications = volunteerId
      ? await prisma.notification.findMany({
          where: { userId: volunteerId },
          orderBy: { createdAt: "desc" },
          take: 5,
        })
      : [];

    return NextResponse.json({
      stats,
      deliveries: availableDeliveries,
      activity,
      notifications,
    });

  } catch (error) {
    console.error("VOLUNTEER DASHBOARD ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to load volunteer dashboard",
      },
      {
        status: 500,
      }
    );
  }
}