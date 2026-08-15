import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalUsers,
      totalDonors,
      totalNGOs,
      totalVolunteers,
      totalDonations,
      totalDeliveries,
      pendingRequests,
      completedDeliveries,
      recentUsers,
      recentDonations,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "DONOR" } }),
      prisma.user.count({ where: { role: "NGO" } }),
      prisma.user.count({ where: { role: "VOLUNTEER" } }),
      prisma.foodDonation.count(),
      prisma.delivery.count(),
      prisma.donationRequest.count({ where: { status: "PENDING" } }),
      prisma.delivery.count({ where: { status: "DELIVERED" } }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.foodDonation.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          donor: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalDonors,
        totalNGOs,
        totalVolunteers,
        totalDonations,
        totalDeliveries,
        pendingRequests,
        completedDeliveries,
      },
      recentUsers,
      recentDonations,
    });
  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);
    return NextResponse.json({ message: "Failed to load admin stats" }, { status: 500 });
  }
}
