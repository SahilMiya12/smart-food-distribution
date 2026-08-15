import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid authentication" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      foodName,
      description,
      category,
      quantity,
      unit,
      expiryDate,
      pickupAddress,
      pickupCity,
      imageUrl,
    } = body;

    const missingFields: string[] = [];

    if (!foodName) missingFields.push("foodName");
    if (!category) missingFields.push("category");
    if (!quantity) missingFields.push("quantity");
    if (!unit) missingFields.push("unit");
    if (!expiryDate) missingFields.push("expiryDate");
    if (!pickupAddress) missingFields.push("pickupAddress");
    if (!pickupCity) missingFields.push("pickupCity");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: "Required fields are missing",
          missingFields,
        },
        { status: 400 }
      );
    }

    const donation = await prisma.foodDonation.create({
      data: {
        foodName: String(foodName),
        description: description ? String(description) : null,
        category: String(category),
        quantity: Number(quantity),
        unit: String(unit),
        expiryDate: new Date(expiryDate),
        pickupAddress: String(pickupAddress),
        pickupCity: String(pickupCity),
        imageUrl: imageUrl ? String(imageUrl) : null,
        donorId: user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Donation created successfully",
        donation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE DONATION ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to create donation",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid authentication" },
        { status: 401 }
      );
    }

    const donations = await prisma.foodDonation.findMany({
      where: {
        donorId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      donations,
    });
  } catch (error) {
    console.error("GET DONATIONS ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch donations",
      },
      { status: 500 }
    );
  }
}