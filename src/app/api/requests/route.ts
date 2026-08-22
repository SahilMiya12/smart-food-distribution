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
        {
          message: "Authentication required",
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
          message: "Invalid or expired session",
        },
        {
          status: 401,
        }
      );
    }

    // Role-specific filtering:
    // If NGO, return requests created by this NGO (ngoId)
    // If DONOR, return requests received for this donor's food (donation.donorId)
    // If ADMIN, return all requests
    const whereClause =
      user.role === "NGO"
        ? { ngoId: user.id }
        : user.role === "DONOR"
        ? { donation: { donorId: user.id } }
        : {};

    const requests = await prisma.donationRequest.findMany({
      where: whereClause,
      include: {
        donation: {
          select: {
            id: true,
            foodName: true,
            category: true,
            quantity: true,
            unit: true,
            imageUrl: true,
            pickupCity: true,
            pickupAddress: true,
            status: true,
          },
        },
        ngo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            organizationName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      requests,
    });
  } catch (error) {
    console.error("Fetch requests error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch requests",
      },
      {
        status: 500,
      }
    );
  }
}