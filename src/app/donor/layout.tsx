import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ClipboardList,
  Truck,
} from "lucide-react";

import { verifyToken } from "@/lib/auth";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DonorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const user = await verifyToken(token);

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "DONOR") {
    redirect("/dashboard");
  }

  const navItems = [
  {
    label: "Dashboard",
    href: "/donor/dashboard",
    icon: <LayoutDashboard size={19} />,
  },
  {
    label: "My Donations",
    href: "/donor/donations",
    icon: <Package size={19} />,
  },
  {
    label: "Create Donation",
    href: "/donor/donations/create",
    icon: <PlusCircle size={19} />,
  },
  {
    label: "Requests",
    href: "/donor/requests/received",
    icon: <ClipboardList size={19} />,
  },
  {
    label: "Deliveries",
    href: "/donor/deliveries",
    icon: <Truck size={19} />,
  },
];

  return (
    <DashboardShell
      user={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role as "DONOR" | "NGO" | "VOLUNTEER" | "ADMIN",
      }}
      navItems={navItems}
    >
      {children}
    </DashboardShell>
  );
}