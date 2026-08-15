import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET() {
try {
const cookieStore = await cookies();

const token =
  cookieStore.get("auth_token")?.value;

if (!token) {
  return NextResponse.json(
    {
      message: "Authentication required",
    },
    {
      status: 401,
    }
  );
}

const user = await verifyToken(token);

if (!user) {
  return NextResponse.json(
    {
      message: "Invalid or expired session",
    },
    {
      status: 401,
    }
  );
}

const currentUser =
  await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    },
  });

if (!currentUser) {
  return NextResponse.json(
    {
      message: "User not found",
    },
    {
      status: 404,
    }
  );
}

return NextResponse.json({
  user: currentUser,
});

} catch (error) {
console.error(
"Fetch current user error:",
error
);

return NextResponse.json(
  {
    message: "Failed to fetch current user",
  },
  {
    status: 500,
  }
);

}
}
