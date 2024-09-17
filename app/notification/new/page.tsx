'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Notification = {
  id: number;
  message: string;
  createdAt: string;
};

const NewNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchNewNotifications = async () => {
      const response = await fetch('/api/notifications/unread');
      const data = await response.json();
      setNotifications(data);
    };

    fetchNewNotifications();
  }, []);

  return (
    <div>
      <h1>New Notifications</h1>
      {notifications.map((notif) => (
        <div key={notif.id}>
          <p>{new Date(notif.createdAt).toLocaleDateString()}</p>
          <Link href={`/notification/${notif.id}`}>{notif.message}</Link>
        </div>
      ))}
      <button
        style={{ marginTop: '20px', padding: '10px', backgroundColor: 'blue', color: 'white' }}
        onClick={() => router.push('/notification/read')}
      >
        Read Notifications
      </button>
    </div>
  );
};

export default NewNotifications;
