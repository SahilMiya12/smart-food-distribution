import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();

    // IMPORTANT:
    // This name must match the cookie name used in login route
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          message: "Authentication token not found",
        },
        {
          status: 401,
        }
      );
    }

    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid or expired token",
        },
        {
          status: 401,
        }
      );
    }

    const [
      availableFood,
      myDonations,
      pendingRequests,
      activeDeliveries,
    ] = await Promise.all([
      prisma.foodDonation.count({
        where: {
          status: "AVAILABLE",
        },
      }),

      prisma.foodDonation.count({
        where: {
          donorId: user.id,
        },
      }),

      prisma.donationRequest.count({
        where: {
          status: "PENDING",
          donation: {
            donorId: user.id,
          },
        },
      }),

      prisma.delivery.count({
        where: {
          donation: {
            donorId: user.id,
          },
          status: {
  in: [
    "PENDING",
    "ASSIGNED",
    "PICKED_UP",
    "IN_TRANSIT",
  ],
},
        },
      }),
    ]);

    return NextResponse.json({
      availableFood,
      myDonations,
      pendingRequests,
      activeDeliveries,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    return NextResponse.json(
      {
        message: "Failed to load dashboard statistics",
      },
      {
        status: 500,
      }
    );
  }
}