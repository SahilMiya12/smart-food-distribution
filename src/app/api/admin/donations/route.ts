import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const donations = await prisma.foodDonation.findMany({
      include: {
        donor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            organizationName: true,
          },
        },
        _count: {
          select: {
            requests: true,
            deliveries: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(donations);
  } catch (error) {
    console.error("ADMIN GET DONATIONS ERROR:", error);
    return NextResponse.json({ message: "Failed to fetch donations" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Donation ID required" }, { status: 400 });
    }

    await prisma.foodDonation.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Donation deleted successfully" });
  } catch (error) {
    console.error("ADMIN DELETE DONATION ERROR:", error);
    return NextResponse.json({ message: "Failed to delete donation" }, { status: 500 });
  }
}
