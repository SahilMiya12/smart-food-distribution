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

    const deliveries = await prisma.delivery.findMany({
      where: {
        OR: [
          {
            donorId: user.id,
          },
          {
            volunteerId: user.id,
          },
        ],
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
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        volunteer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
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
    console.error("Fetch deliveries error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch deliveries",
      },
      {
        status: 500,
      }
    );
  }
}