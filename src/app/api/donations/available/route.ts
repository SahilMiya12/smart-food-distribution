import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const city = searchParams.get("city") || "";

    const donations = await prisma.foodDonation.findMany({
      where: {
        status: "AVAILABLE",

        ...(search
          ? {
              OR: [
                {
                  foodName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),

        ...(category
          ? {
              category: category,
            }
          : {}),

        ...(city
          ? {
              pickupCity: {
                contains: city,
                mode: "insensitive",
              },
            }
          : {}),
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        donor: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      donations,
    });
  } catch (error) {
    console.error("AVAILABLE DONATIONS ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch available donations",
      },
      {
        status: 500,
      }
    );
  }
}