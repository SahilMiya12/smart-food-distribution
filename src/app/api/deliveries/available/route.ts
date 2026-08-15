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

    if (user.role !== "VOLUNTEER") {
      return NextResponse.json(
        {
          message: "Only volunteers can view available deliveries",
        },
        {
          status: 403,
        }
      );
    }

    const deliveries = await prisma.delivery.findMany({
      where: {
        status: "PENDING",
        volunteerId: null,
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
          },
        },
        donor: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      deliveries,
    });
  } catch (error) {
    console.error("Fetch available deliveries error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch available deliveries",
      },
      {
        status: 500,
      }
    );
  }
}