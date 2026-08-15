import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const donation = await prisma.foodDonation.findUnique({
      where: { id },
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
      },
    });

    if (!donation) {
      return NextResponse.json({ message: "Donation not found" }, { status: 404 });
    }

    return NextResponse.json({ donation });
  } catch (error) {
    console.error("DONATION DETAILS ERROR:", error);
    return NextResponse.json({ message: "Failed to fetch donation" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ message: "Invalid session" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const existing = await prisma.foodDonation.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: "Donation not found" }, { status: 404 });
    }

    // Check ownership or admin role
    if (existing.donorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const {
      foodName,
      category,
      quantity,
      unit,
      description,
      expiryDate,
      pickupAddress,
      pickupCity,
      imageUrl,
      status,
    } = body;

    const updatedDonation = await prisma.foodDonation.update({
      where: { id },
      data: {
        foodName: foodName !== undefined ? foodName : existing.foodName,
        category: category !== undefined ? category : existing.category,
        quantity: quantity !== undefined ? Number(quantity) : existing.quantity,
        unit: unit !== undefined ? unit : existing.unit,
        description: description !== undefined ? description : existing.description,
        expiryDate: expiryDate ? new Date(expiryDate) : existing.expiryDate,
        pickupAddress: pickupAddress !== undefined ? pickupAddress : existing.pickupAddress,
        pickupCity: pickupCity !== undefined ? pickupCity : existing.pickupCity,
        imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
        status: status !== undefined ? status : existing.status,
      },
    });

    return NextResponse.json({
      message: "Donation updated successfully",
      donation: updatedDonation,
    });
  } catch (error) {
    console.error("UPDATE DONATION ERROR:", error);
    return NextResponse.json({ message: "Failed to update donation" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ message: "Invalid session" }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await prisma.foodDonation.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: "Donation not found" }, { status: 404 });
    }

    if (existing.donorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.foodDonation.delete({ where: { id } });

    return NextResponse.json({ message: "Donation deleted successfully" });
  } catch (error) {
    console.error("DELETE DONATION ERROR:", error);
    return NextResponse.json({ message: "Failed to delete donation" }, { status: 500 });
  }
}