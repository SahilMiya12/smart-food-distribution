"use client";

import { useEffect, useState } from "react";
import { Users, Trash2, Search, Filter, UserPlus, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create User Modal state
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "DONOR",
    phone: "",
    city: "",
    organizationName: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  function fetchUsers() {
    setLoading(true);
    setError("");
    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]);
          setError(data.message || "Failed to parse users data");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error loading users list");
        setUsers([]);
        setLoading(false);
      });
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete user "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSuccess(`User "${name}" deleted successfully.`);
        setTimeout(() => setSuccess(""), 3000);
        fetchUsers();
      } else {
        const err = await res.json();
        setError(err.message || "Failed to delete user");
      }
    } catch (err) {
      setError("An unexpected error occurred while deleting user.");
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("User created successfully!");
        setTimeout(() => setSuccess(""), 3000);
        setShowModal(false);
        setNewUser({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          role: "DONOR",
          phone: "",
          city: "",
          organizationName: "",
        });
        fetchUsers();
      } else {
        setError(data.message || "Failed to create user");
      }
    } catch (err) {
      setError("Failed to submit user creation form");
    } finally {
      setSubmitting(false);
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      `${u.firstName} ${u.lastName} ${u.email} ${u.city || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500">View, search, create, and manage registered accounts across all roles.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          <UserPlus size={18} />
          Create New User
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-emerald-800 text-sm font-semibold">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-red-800 text-sm font-semibold">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search users by name, email, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 focus:border-emerald-600 focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="DONOR">Donors</option>
            <option value="NGO">NGOs</option>
            <option value="VOLUNTEER">Volunteers</option>
            <option value="ADMIN">Administrators</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <Users size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-800">No users found.</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or role filter.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase text-slate-400">
              <tr>
                <th className="p-3">User Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Role</th>
                <th className="p-3">Phone</th>
                <th className="p-3">City</th>
                <th className="p-3">Joined Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-900">
                    {u.firstName} {u.lastName}
                    {u.organizationName && (
                      <span className="block text-xs font-normal text-slate-500">{u.organizationName}</span>
                    )}
                  </td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        u.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : u.role === "DONOR"
                          ? "bg-emerald-100 text-emerald-800"
                          : u.role === "NGO"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">{u.phone || "—"}</td>
                  <td className="p-3">{u.city || "—"}</td>
                  <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDelete(u.id, `${u.firstName} ${u.lastName}`)}
                      className="rounded-xl p-2 text-red-600 transition hover:bg-red-50"
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900">Create New Account</h3>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500">First Name</label>
                  <input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    required
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500">Last Name</label>
                  <input
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    required
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500">Email Address</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  minLength={6}
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500">Account Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm font-semibold focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="DONOR">Donor</option>
                    <option value="NGO">NGO</option>
                    <option value="VOLUNTEER">Volunteer</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500">City</label>
                  <input
                    type="text"
                    value={newUser.city}
                    onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
                    placeholder="New York"
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {newUser.role === "NGO" && (
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500">Organization Name</label>
                  <input
                    type="text"
                    value={newUser.organizationName}
                    onChange={(e) => setNewUser({ ...newUser, organizationName: e.target.value })}
                    placeholder="Organization Name"
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
