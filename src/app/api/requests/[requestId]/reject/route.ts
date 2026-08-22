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
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired session" }, { status: 401 });
    }

    const { requestId } = await context.params;

    const donationRequest = await prisma.donationRequest.findUnique({
      where: { id: requestId },
      include: { donation: true, ngo: true },
    });

    if (!donationRequest) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    const isDonor = user.role === "DONOR" && donationRequest.donation.donorId === user.id;
    const isNgo = user.role === "NGO" && donationRequest.ngoId === user.id;
    const isAdmin = user.role === "ADMIN";

    if (!isDonor && !isNgo && !isAdmin) {
      return NextResponse.json({ message: "You are not authorized to cancel/reject this request" }, { status: 403 });
    }

    if (donationRequest.status !== "PENDING" && donationRequest.status !== "APPROVED") {
      return NextResponse.json(
        { message: `Request is already ${donationRequest.status.toLowerCase()}` },
        { status: 400 }
      );
    }

    const rejectedRequest = await prisma.donationRequest.update({
      where: { id: requestId },
      data: { status: "REJECTED" },
      include: { donation: true, ngo: true },
    });

    // If NGO cancelled, notify Donor
    if (isNgo) {
      await prisma.notification.create({
        data: {
          userId: donationRequest.donation.donorId,
          title: "Food Request Withdrawn",
          message: `${donationRequest.ngo.firstName} ${donationRequest.ngo.lastName} has withdrawn their request for ${donationRequest.donation.foodName}.`,
        },
      });
    } else {
      // If Donor rejected, notify NGO
      await prisma.notification.create({
        data: {
          userId: donationRequest.ngoId,
          title: "Food Request Rejected",
          message: `Your request for ${donationRequest.donation.foodName} was rejected.`,
        },
      });
    }

    return NextResponse.json({
      message: isNgo ? "Request cancelled successfully" : "Request rejected successfully",
      request: rejectedRequest,
    });
  } catch (error) {
    console.error("Reject/Cancel request error:", error);
    return NextResponse.json({ message: "Failed to update request" }, { status: 500 });
  }
}