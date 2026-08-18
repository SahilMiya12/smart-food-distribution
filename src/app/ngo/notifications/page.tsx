"use client";

import NotificationList from "@/components/notifications/NotificationList";

export default function NgoNotificationsPage() {
  return (
    <div className="py-4">
      <NotificationList roleTitle="NGO Partner" backHref="/ngo/dashboard" />
    </div>
  );
}
