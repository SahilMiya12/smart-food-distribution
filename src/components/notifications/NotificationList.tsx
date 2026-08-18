"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Trash2,
  Filter,
  Loader2,
  Clock,
  Sparkles,
  Inbox,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationList({
  roleTitle,
  backHref = "/dashboard",
}: {
  roleTitle?: string;
  backHref?: string;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/notifications");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch notifications");
      }

      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load notifications list");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkRead(id: string) {
    try {
      setActionId(id);
      const res = await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.error("Mark read error:", err);
    } finally {
      setActionId(null);
    }
  }

  async function handleMarkAllRead() {
    try {
      setActionId("all");
      const res = await fetch("/api/notifications/read-all", { method: "POST" });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setSuccess("All notifications marked as read!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Mark all read error:", err);
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(id: string) {
    try {
      setActionId(id);
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (err) {
      console.error("Delete notification error:", err);
    } finally {
      setActionId(null);
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.isRead;
    if (filter === "READ") return n.isRead;
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Back Button */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <Sparkles size={16} /> Real-time System Updates
          </div>
          <h1 className="text-3xl font-black text-slate-900">
            {roleTitle ? `${roleTitle} Notifications` : "Notifications"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Stay updated on donation requests, pickup dispatches, and delivery status updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={actionId === "all"}
            className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
          >
            <CheckCheck size={16} /> Mark All as Read
          </button>
        )}
      </div>

      {/* Notifications Alerts */}
      {success && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          <CheckCircle2 size={18} /> {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Toolbar / Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-md">
        <div className="flex rounded-2xl bg-slate-100 p-1">
          <button
            onClick={() => setFilter("ALL")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              filter === "ALL"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("UNREAD")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              filter === "UNREAD"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("READ")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              filter === "READ"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>

        <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
          <Bell size={15} className="text-emerald-600" />
          <span>{unreadCount} unread alert{unreadCount !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white/60 p-12 text-center text-slate-500 shadow-sm backdrop-blur-md">
          <Inbox size={48} className="mx-auto mb-3 text-slate-300" />
          <h3 className="text-xl font-bold text-slate-800">No Notifications</h3>
          <p className="mt-1 text-sm text-slate-400">
            {filter === "UNREAD"
              ? "You have no unread notifications right now."
              : "No notification records match your filter criteria."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`relative overflow-hidden rounded-3xl border p-5 shadow-xs transition duration-200 ${
                !n.isRead
                  ? "border-emerald-200 bg-emerald-50/40 shadow-sm"
                  : "border-slate-200/80 bg-white/90"
              }`}
            >
              {!n.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500" />
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                      !n.isRead
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Bell size={18} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{n.title}</h3>
                      {!n.isRead && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-800">
                          New
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{n.message}</p>
                    <p className="mt-2.5 flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={13} /> {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      disabled={actionId === n.id}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition shadow-2xs"
                      title="Mark as read"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    disabled={actionId === n.id}
                    className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                    title="Delete notification"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
