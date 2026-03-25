import { db } from '@/lib/db';

export async function createNotification({
  userId,
  type,
  title,
  body,
  link,
}: {
  userId: string;
  type: string;
  title: string;
  body: string;
  link?: string;
}) {
  return db.notification.create({
    data: { userId, type, title, body, link },
  });
}
