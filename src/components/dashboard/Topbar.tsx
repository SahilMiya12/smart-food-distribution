"use client";

import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-6">

      <div>
        <h2 className="text-xl font-bold text-emerald-950">
          Dashboard
        </h2>

        <p className="text-sm text-gray-500">
          Welcome back, Sahil 👋
        </p>
      </div>

      <div className="flex items-center gap-5">

        {/* Search */}
        <div className="hidden items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 md:flex">
          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            className="w-40 bg-transparent text-sm outline-none"
          />
        </div>

        {/* Notifications */}
        <button className="relative rounded-xl p-2 hover:bg-gray-50">
          <Bell size={21} className="text-gray-600" />

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 font-semibold text-white">
            S
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-semibold">
              Sahil Miya
            </p>

            <p className="text-xs text-gray-500">
              Donor
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}