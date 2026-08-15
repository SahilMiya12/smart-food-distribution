import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Package, PlusCircle, ClipboardList, Truck } from "lucide-react";

export default async function DonorDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const user = await verifyToken(token);

  if (!user || user.role !== "DONOR") {
    redirect("/login");
  }

  const [availableCount, totalDonationsCount, pendingRequestsCount, activeDeliveriesCount, recentDonations] =
    await Promise.all([
      prisma.foodDonation.count({
        where: { donorId: user.id, status: "AVAILABLE" },
      }),
      prisma.foodDonation.count({
        where: { donorId: user.id },
      }),
      prisma.donationRequest.count({
        where: {
          donation: { donorId: user.id },
          status: "PENDING",
        },
      }),
      prisma.delivery.count({
        where: {
          donorId: user.id,
          status: { in: ["ASSIGNED", "PICKED_UP", "IN_TRANSIT"] },
        },
      }),
      prisma.foodDonation.findMany({
        where: { donorId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          DONOR OVERVIEW
        </p>

        <h1 className="mt-1 text-3xl font-black text-slate-900">
          Make an impact with every donation
        </h1>

        <p className="mt-1 text-slate-500">
          Manage your food donations and help connect surplus food with communities in need.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Available Food"
          value={String(availableCount)}
          description="Currently available"
          icon={<Package className="text-emerald-600" size={24} />}
        />

        <StatCard
          label="My Donations"
          value={String(totalDonationsCount)}
          description="Total donations"
          icon={<PlusCircle className="text-blue-600" size={24} />}
        />

        <StatCard
          label="Pending Requests"
          value={String(pendingRequestsCount)}
          description="Waiting for approval"
          icon={<ClipboardList className="text-amber-600" size={24} />}
        />

        <StatCard
          label="Active Deliveries"
          value={String(activeDeliveriesCount)}
          description="Currently in progress"
          icon={<Truck className="text-purple-600" size={24} />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white shadow-xl lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">
            START MAKING AN IMPACT
          </p>

          <h2 className="mt-3 max-w-xl text-3xl font-black leading-tight">
            Have extra food? Someone nearby may need it.
          </h2>

          <p className="mt-3 max-w-xl text-emerald-100">
            Create a donation and help reduce food waste in your community.
          </p>

          <Link
            href="/donor/donations/create"
            className="mt-6 inline-flex rounded-2xl bg-white px-6 py-3.5 font-bold text-emerald-800 shadow-md transition hover:bg-emerald-50"
          >
            + Create Donation
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Quick Actions
          </h2>

          <div className="mt-5 space-y-3">
            <Link
              href="/donor/donations/create"
              className="block rounded-2xl bg-slate-50 p-4 font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
            >
              + Create a Donation
            </Link>

            <Link
              href="/donor/requests/received"
              className="block rounded-2xl bg-slate-50 p-4 font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
            >
              View Received Requests
            </Link>

            <Link
              href="/donor/deliveries"
              className="block rounded-2xl bg-slate-50 p-4 font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
            >
              Track Deliveries
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Donations Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Donations</h2>
        {recentDonations.length === 0 ? (
          <p className="text-slate-500 text-sm py-4">No donations created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase text-slate-400">
                <tr>
                  <th className="p-3">Food Item</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentDonations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-900">{item.foodName}</td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3">{item.quantity} {item.unit}</td>
                    <td className="p-3">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
        {icon}
      </div>

      <p className="mt-4 text-4xl font-black text-slate-900">{value}</p>

      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </div>
  );
}