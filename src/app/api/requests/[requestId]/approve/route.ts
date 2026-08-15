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
          message: "Only donors can approve requests",
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
      ngo: true,
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
          message: "You are not allowed to approve this request",
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

    if (donationRequest.donation.status !== "AVAILABLE") {
      return NextResponse.json(
        {
          message: "This donation is no longer available",
        },
        {
          status: 400,
        }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
  const approvedRequest =
    await tx.donationRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: "APPROVED",
      },
      include: {
        donation: true,
        ngo: true,
      },
    });

  await tx.foodDonation.update({
    where: {
      id: donationRequest.donationId,
    },
    data: {
      status: "ACCEPTED",
    },
  });

  const delivery = await tx.delivery.create({
    data: {
      donationId: donationRequest.donationId,
      donorId: donationRequest.donation.donorId,
      pickupAddress: donationRequest.donation.pickupAddress,
      deliveryAddress:
        donationRequest.ngo.address ||
        donationRequest.ngo.city ||
        "NGO delivery address",
      status: "PENDING",
    },
  });

  await tx.donationRequest.updateMany({
    where: {
      donationId: donationRequest.donationId,
      id: {
        not: requestId,
      },
      status: "PENDING",
    },
    data: {
      status: "REJECTED",
    },
  });

  await tx.notification.create({
    data: {
      userId: donationRequest.ngoId,
      title: "Food Request Approved",
      message: `Your request for ${donationRequest.donation.foodName} has been approved.`,
    },
  });

  return {
    approvedRequest,
    delivery,
  };
});

    return NextResponse.json({
  message: "Request approved successfully",
  request: result.approvedRequest,
  delivery: result.delivery,
});
  } catch (error) {
    console.error("Approve request error:", error);

    return NextResponse.json(
      {
        message: "Failed to approve request",
      },
      {
        status: 500,
      }
    );
  }
}