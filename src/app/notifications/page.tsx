"use client";

import {
  Bell,
  CheckCheck,
  Inbox,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { useEffect, useState } from "react";

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [markingAll, setMarkingAll] =
    useState(false);

  const [error, setError] =
    useState("");

  async function fetchNotifications() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/notifications",
        {
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load notifications"
        );
      }

      setNotifications(
        data.notifications || []
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function markAsRead(
    notificationId: string
  ) {
    try {
      await fetch(
        `/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
        }
      );

      setNotifications(
        (currentNotifications) =>
          currentNotifications.map(
            (notification) =>
              notification.id ===
              notificationId
                ? {
                    ...notification,
                    isRead: true,
                  }
                : notification
          )
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  }

  async function markAllAsRead() {
    try {
      setMarkingAll(true);

      const response = await fetch(
        "/api/notifications/read-all",
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to mark notifications as read"
        );
      }

      setNotifications(
        (currentNotifications) =>
          currentNotifications.map(
            (notification) => ({
              ...notification,
              isRead: true,
            })
          )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setMarkingAll(false);
    }
  }

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;

  function formatDate(
    date: string
  ) {
    return new Intl.DateTimeFormat(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    ).format(new Date(date));
  }

  return (
    <div className="mx-auto max-w-5xl">

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
            <Bell
              size={27}
              className="text-emerald-700"
            />
          </div>

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              Notifications
            </h1>

            <p className="mt-1 text-slate-500">
              Stay updated with your FoodBridge activity.
            </p>

          </div>

        </div>

        <div className="flex gap-3">

          <button
            type="button"
            onClick={fetchNotifications}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              disabled={markingAll}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {markingAll ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <CheckCheck size={17} />
              )}

              Mark all read
            </button>
          )}

        </div>

      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5">

          <p className="text-sm text-slate-500">
            Total notifications
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {notifications.length}
          </p>

        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

          <p className="text-sm text-emerald-700">
            Unread
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-800">
            {unreadCount}
          </p>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">

          <p className="text-sm text-slate-500">
            Status
          </p>

          <p className="mt-2 text-lg font-bold text-slate-900">
            {unreadCount > 0
              ? "Action required"
              : "All caught up"}
          </p>

        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex min-h-80 items-center justify-center rounded-3xl border border-slate-200 bg-white">

          <div className="flex items-center gap-3 text-slate-500">

            <Loader2
              size={22}
              className="animate-spin"
            />

            Loading notifications...

          </div>

        </div>
      )}

      {/* Empty */}
      {!loading &&
        notifications.length === 0 && (
          <div className="flex min-h-96 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 text-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">

              <Inbox
                size={38}
                className="text-slate-400"
              />

            </div>

            <h2 className="mt-6 text-xl font-bold text-slate-900">
              You're all caught up
            </h2>

            <p className="mt-2 max-w-md text-slate-500">
              New updates about donations,
              requests, and deliveries will
              appear here.
            </p>

          </div>
        )}

      {/* Notifications */}
      {!loading &&
        notifications.length > 0 && (
          <div className="space-y-3">

            {notifications.map(
              (notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() =>
                    !notification.isRead &&
                    markAsRead(
                      notification.id
                    )
                  }
                  className={`
                    flex w-full items-start gap-4
                    rounded-2xl border
                    p-5 text-left
                    transition
                    ${
                      notification.isRead
                        ? "border-slate-200 bg-white hover:border-slate-300"
                        : "border-emerald-200 bg-emerald-50/60 hover:border-emerald-300"
                    }
                  `}
                >

                  <div
                    className={`
                      flex h-11 w-11 shrink-0
                      items-center justify-center
                      rounded-xl
                      ${
                        notification.isRead
                          ? "bg-slate-100 text-slate-500"
                          : "bg-emerald-100 text-emerald-700"
                      }
                    `}
                  >
                    <Bell size={20} />
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col justify-between gap-1 sm:flex-row">

                      <h3 className="font-bold text-slate-900">
                        {notification.title}
                      </h3>

                      <span className="shrink-0 text-xs text-slate-400">
                        {formatDate(
                          notification.createdAt
                        )}
                      </span>

                    </div>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {notification.message}
                    </p>

                    {!notification.isRead && (
                      <p className="mt-3 text-xs font-bold text-emerald-600">
                        ● New notification
                      </p>
                    )}

                  </div>

                </button>
              )
            )}

          </div>
        )}

    </div>
  );
}