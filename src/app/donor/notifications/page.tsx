"use client";

import NotificationList from "@/components/notifications/NotificationList";

export default function DonorNotificationsPage() {
  return (
    <div className="py-4">
      <NotificationList roleTitle="Donor" backHref="/donor/dashboard" />
    </div>
  );
}
