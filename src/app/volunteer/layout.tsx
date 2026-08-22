import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  ClipboardList,
  History,
  Bell,
} from "lucide-react";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { verifyToken } from "@/lib/auth";

export default async function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const user = await verifyToken(token);

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "VOLUNTEER") {
    redirect("/");
  }

  const navItems = [
    {
      label: "Dashboard",
      href: "/volunteer/dashboard",
      icon: <LayoutDashboard size={19} />,
    },
    {
      label: "Available Deliveries",
      href: "/volunteer/deliveries",
      icon: <Truck size={19} />,
    },
    {
      label: "My Deliveries",
      href: "/volunteer/my-deliveries",
      icon: <ClipboardList size={19} />,
    },
    {
      label: "History",
      href: "/volunteer/history",
      icon: <History size={19} />,
    },
    {
      label: "Notifications",
      href: "/volunteer/notifications",
      icon: <Bell size={19} />,
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
