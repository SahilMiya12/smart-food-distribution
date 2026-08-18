import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ message: "Invalid session" }, { status: 401 });
    }

    const { id } = await context.params;

    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== user.id) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return NextResponse.json({ notification: updated });
  } catch (error) {
    console.error("PATCH NOTIFICATION ERROR:", error);
    return NextResponse.json({ message: "Failed to update notification" }, { status: 500 });
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

    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== user.id) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 });
    }

    await prisma.notification.delete({ where: { id } });

    return NextResponse.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("DELETE NOTIFICATION ERROR:", error);
    return NextResponse.json({ message: "Failed to delete notification" }, { status: 500 });
  }
}
