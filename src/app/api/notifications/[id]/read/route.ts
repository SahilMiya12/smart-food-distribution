import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const cookieStore = await cookies();

    const token =
      cookieStore.get("auth_token")?.value;

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

    const { id } = await context.params;

    const result =
      await prisma.notification.updateMany({
        where: {
          id,
          userId: user.id,
        },
        data: {
          isRead: true,
        },
      });

    if (result.count === 0) {
      return NextResponse.json(
        {
          message: "Notification not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error(
      "MARK NOTIFICATION READ ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to mark notification as read",
      },
      {
        status: 500,
      }
    );
  }
}