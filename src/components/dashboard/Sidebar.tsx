"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  HeartHandshake,
  Truck,
  Bell,
  User,
  Settings,
  LogOut,
  Leaf,
  Inbox,
  ClipboardList,
  Package,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Donations",
    href: "/dashboard/donations",
    icon: HeartHandshake,
  },
  {
    label: "Received Requests",
    href: "/dashboard/requests/received",
    icon: ClipboardList,
  },
  {
    label: "Browse Food",
    href: "/ngo/browse",
    icon: Package,
  },
  {
    label: "Deliveries",
    href: "/dashboard/deliveries",
    icon: Truck,
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-gray-200 bg-white md:block">
      <div className="flex h-full flex-col">

        {/* Logo */}
        <div className="flex h-20 items-center gap-2 border-b border-gray-100 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
            <Leaf className="text-emerald-700" size={22} />
          </div>

          <div>
            <h1 className="font-bold text-emerald-900">
              FoodBridge
            </h1>

            <p className="text-xs text-gray-500">
              Make an impact
            </p>
          </div>
        </div>

    {/* Navigation */}
<nav className="flex-1 space-y-2 p-4">
  {menuItems.map((item) => {
    const Icon = item.icon;

    const isActive = pathname === item.href;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
          isActive
            ? "bg-emerald-100 font-semibold text-emerald-800"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        <Icon size={19} />
        {item.label}
      </Link>
    );
  })}
</nav>

        {/* Bottom Menu */}
        <div className="space-y-2 border-t border-gray-100 p-4">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-600 hover:bg-gray-50"
          >
            <Settings size={19} />
            Settings
          </Link>

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-500 hover:bg-red-50">
            <LogOut size={19} />
            Logout
          </button>
        </div>

      </div>
    </aside>
  );
}