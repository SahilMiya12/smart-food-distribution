import { prisma } from "@/lib/prisma";

export async function createNotification(userId: string, title: string, message: string) {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        isRead: false,
      },
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}

export async function notifyUsersByRole(role: "DONOR" | "NGO" | "VOLUNTEER" | "ADMIN", title: string, message: string) {
  try {
    const users = await prisma.user.findMany({
      where: { role },
      select: { id: true },
    });

    if (users.length === 0) return;

    await prisma.notification.createMany({
      data: users.map((u) => ({
        userId: u.id,
        title,
        message,
        isRead: false,
      })),
    });
  } catch (error) {
    console.error(`Failed to notify role ${role}:`, error);
  }
}
