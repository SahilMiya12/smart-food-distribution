import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isUserAdmin = user.role === "ADMIN";

    // Admin sees all payment transactions; other roles see their own
    const payments = await prisma.payment.findMany({
      where: isUserAdmin ? {} : { userId: user.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            organizationName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalSuccessfulAmount = payments
      .filter((p) => p.status === "SUCCESS")
      .reduce((sum, p) => sum + p.amount, 0);

    return NextResponse.json({
      payments,
      totalAmount: totalSuccessfulAmount,
      count: payments.length,
    });
  } catch (error) {
    console.error("Payment History API Error:", error);
    return NextResponse.json({ message: "Server error fetching payment history" }, { status: 500 });
  }
}
