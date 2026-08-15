import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { verifyToken } from "@/lib/auth";

export default async function DashboardRedirectPage() {
  const cookieStore = await cookies();

  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const user = await verifyToken(token);

  if (!user) {
    redirect("/login");
  }

  switch (user.role) {
    case "DONOR":
      redirect("/donor/dashboard");

    case "NGO":
      redirect("/ngo/dashboard");

    case "VOLUNTEER":
      redirect("/volunteer/dashboard");

    case "ADMIN":
      redirect("/admin/dashboard");

    default:
      redirect("/login");
  }
}