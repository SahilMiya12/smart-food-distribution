import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [donations, deliveries, users] = await Promise.all([
      prisma.foodDonation.findMany({
        select: {
          id: true,
          foodName: true,
          quantity: true,
          unit: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.delivery.findMany({
        select: {
          id: true,
          status: true,
          createdAt: true,
          pickedUpAt: true,
          deliveredAt: true,
        },
      }),
      prisma.user.findMany({
        select: {
          id: true,
          role: true,
          createdAt: true,
        },
      }),
    ]);

    const totalMealsRescued = donations.reduce((acc, d) => acc + d.quantity, 0);

    return NextResponse.json({
      summary: {
        totalDonations: donations.length,
        totalDeliveries: deliveries.length,
        totalUsers: users.length,
        totalMealsRescued,
      },
      donations,
      deliveries,
      users,
    });
  } catch (error) {
    console.error("ADMIN REPORTS ERROR:", error);
    return NextResponse.json({ message: "Failed to generate report" }, { status: 500 });
  }
}
