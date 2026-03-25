import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import NotificationItem from '@/components/notifications/NotificationItem';

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  const unreadCount = await db.notification.count({
    where: { userId: session.user.id, read: false },
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <span className="text-sm text-gray-500">{unreadCount} unread</span>
        )}
      </div>

      <div className="bg-white rounded-lg shadow divide-y">
        {notifications.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No notifications yet</p>
        ) : (
          notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={{ ...notification, createdAt: notification.createdAt.toISOString() }}
            />
          ))
        )}
      </div>
    </div>
  );
}
