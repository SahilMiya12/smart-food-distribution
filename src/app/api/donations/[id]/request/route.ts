import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    // Get logged-in user's token
    const cookieStore = await cookies();

    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          message: "Please login first",
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

if (user.role !== "NGO") {
  return NextResponse.json(
    {
      message: "Only NGOs can request food donations",
    },
    {
      status: 403,
    }
  );
}

// Only NGO users can request food
if (user.role !== "NGO") {
  return NextResponse.json(
    {
      message: "Only NGO users can request food donations",
    },
    {
      status: 403,
    }
  );
}

    const { id: donationId } = await context.params;

    // Get optional message
    const body = await request.json().catch(() => ({}));

    const message =
      typeof body.message === "string"
        ? body.message
        : null;

    // Check if donation exists
    const donation =
      await prisma.foodDonation.findUnique({
        where: {
          id: donationId,
        },
      });

    if (!donation) {
      return NextResponse.json(
        {
          message: "Food donation not found",
        },
        {
          status: 404,
        }
      );
    }

    // Do not allow requesting your own donation
    if (donation.donorId === user.id) {
      return NextResponse.json(
        {
          message:
            "You cannot request your own food donation",
        },
        {
          status: 400,
        }
      );
    }

    // Only available food can be requested
    if (donation.status !== "AVAILABLE") {
      return NextResponse.json(
        {
          message:
            "This food donation is no longer available",
        },
        {
          status: 400,
        }
      );
    }

    // Check duplicate request
    const existingRequest =
      await prisma.donationRequest.findUnique({
        where: {
          donationId_ngoId: {
            donationId,
            ngoId: user.id,
          },
        },
      });

    if (existingRequest) {
      return NextResponse.json(
        {
          message:
            "You have already requested this food",
        },
        {
          status: 409,
        }
      );
    }

    // Create request
    const donationRequest =
      await prisma.donationRequest.create({
        data: {
          donationId,
          ngoId: user.id,
          message,
        },
      });

    return NextResponse.json(
      {
        message: "Food request submitted successfully",
        request: donationRequest,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Food request creation error:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to submit food request",
      },
      {
        status: 500,
      }
    );
  }
}