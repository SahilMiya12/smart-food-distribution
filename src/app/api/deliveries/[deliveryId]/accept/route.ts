import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    deliveryId: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext
) {
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
          message: "Only volunteers can accept deliveries",
        },
        {
          status: 403,
        }
      );
    }

    const { deliveryId } = await context.params;

    const delivery = await prisma.delivery.findUnique({
      where: {
        id: deliveryId,
      },
    });

    if (!delivery) {
      return NextResponse.json(
        {
          message: "Delivery not found",
        },
        {
          status: 404,
        }
      );
    }

    if (delivery.status !== "PENDING") {
      return NextResponse.json(
        {
          message: "This delivery is no longer available",
        },
        {
          status: 400,
        }
      );
    }

    if (delivery.volunteerId) {
      return NextResponse.json(
        {
          message: "This delivery has already been assigned",
        },
        {
          status: 409,
        }
      );
    }

    const updatedDelivery = await prisma.delivery.update({
      where: {
        id: deliveryId,
      },
      data: {
        volunteerId: user.id,
        status: "ASSIGNED",
      },
      include: {
        donation: true,
      },
    });

    return NextResponse.json({
      message: "Delivery accepted successfully",
      delivery: updatedDelivery,
    });
  } catch (error) {
    console.error("Accept delivery error:", error);

    return NextResponse.json(
      {
        message: "Failed to accept delivery",
      },
      {
        status: 500,
      }
    );
  }
}