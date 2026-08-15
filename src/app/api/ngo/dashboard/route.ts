import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid authentication" },
        { status: 401 }
      );
    }

    if (user.role !== "NGO") {
      return NextResponse.json(
        { message: "NGO access required" },
        { status: 403 }
      );
    }

    const [
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      availableDonations,
      recentRequests,
    ] = await Promise.all([
      prisma.donationRequest.count({
        where: {
          ngoId: user.id,
        },
      }),

      prisma.donationRequest.count({
        where: {
          ngoId: user.id,
          status: "PENDING",
        },
      }),

      prisma.donationRequest.count({
        where: {
          ngoId: user.id,
          status: "APPROVED",
        },
      }),

      prisma.donationRequest.count({
        where: {
          ngoId: user.id,
          status: "REJECTED",
        },
      }),

      prisma.foodDonation.findMany({
        where: {
          status: "AVAILABLE",
          expiryDate: {
            gt: new Date(),
          },
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
        take: 6,
      }),

      prisma.donationRequest.findMany({
        where: {
          ngoId: user.id,
        },
        include: {
          donation: {
            select: {
              id: true,
              foodName: true,
              category: true,
              quantity: true,
              unit: true,
              pickupCity: true,
              expiryDate: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        availableDonations: availableDonations.length,
      },
      availableDonations,
      recentRequests,
    });
  } catch (error) {
    console.error("NGO DASHBOARD ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to load NGO dashboard",
      },
      {
        status: 500,
      }
    );
  }
}