'use client';

import Link from 'next/link';

interface NotificationItemProps {
  notification: {
    id: string;
    type: string;
    title: string;
    body: string;
    link?: string | null;
    read: boolean;
    createdAt: string;
  };
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  const iconMap: Record<string, string> = {
    message: '💬',
    listing: '🚗',
    payment: '💳',
    saved_search: '🔍',
  };

  const content = (
    <div className={`p-3 border-b hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{iconMap[notification.type] || '🔔'}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>{notification.title}</p>
          <p className="text-xs text-gray-500 truncate">{notification.body}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(notification.createdAt).toLocaleDateString()}
          </p>
        </div>
        {!notification.read && <span className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
      </div>
    </div>
  );

  if (notification.link) {
    return <Link href={notification.link}>{content}</Link>;
  }

  return content;
}
