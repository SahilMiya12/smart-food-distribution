import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    requestId: string;
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

    if (user.role !== "DONOR") {
      return NextResponse.json(
        {
          message: "Only donors can reject requests",
        },
        {
          status: 403,
        }
      );
    }

    const { requestId } = await context.params;

    const donationRequest =
      await prisma.donationRequest.findUnique({
        where: {
          id: requestId,
        },
        include: {
          donation: true,
        },
      });

    if (!donationRequest) {
      return NextResponse.json(
        {
          message: "Request not found",
        },
        {
          status: 404,
        }
      );
    }

    if (donationRequest.donation.donorId !== user.id) {
      return NextResponse.json(
        {
          message: "You are not allowed to reject this request",
        },
        {
          status: 403,
        }
      );
    }

    if (donationRequest.status !== "PENDING") {
      return NextResponse.json(
        {
          message: `Request is already ${donationRequest.status.toLowerCase()}`,
        },
        {
          status: 400,
        }
      );
    }

    const rejectedRequest =
      await prisma.donationRequest.update({
        where: {
          id: requestId,
        },
        data: {
          status: "REJECTED",
        },
        include: {
          donation: true,
          ngo: true,
        },
      });

    await prisma.notification.create({
      data: {
        userId: donationRequest.ngoId,
        title: "Food Request Rejected",
        message: `Your request for ${donationRequest.donation.foodName} has been rejected.`,
      },
    });

    return NextResponse.json({
      message: "Request rejected successfully",
      request: rejectedRequest,
    });
  } catch (error) {
    console.error("Reject request error:", error);

    return NextResponse.json(
      {
        message: "Failed to reject request",
      },
      {
        status: 500,
      }
    );
  }
}