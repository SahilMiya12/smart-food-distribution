import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const deliveries = await prisma.delivery.findMany({
      include: {
        donation: {
          select: {
            id: true,
            foodName: true,
            quantity: true,
            unit: true,
          },
        },
        donor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        volunteer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(deliveries);
  } catch (error) {
    console.error("ADMIN GET DELIVERIES ERROR:", error);
    return NextResponse.json({ message: "Failed to fetch deliveries" }, { status: 500 });
  }
}
