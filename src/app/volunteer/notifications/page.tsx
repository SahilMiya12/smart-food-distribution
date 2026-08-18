"use client";

import NotificationList from "@/components/notifications/NotificationList";

export default function VolunteerNotificationsPage() {
  return (
    <div className="py-4">
      <NotificationList roleTitle="Volunteer" backHref="/volunteer/dashboard" />
    </div>
  );
}
