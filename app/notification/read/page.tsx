'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Notification = {
  id: number;
  message: string;
  createdAt: string;
};

const ReadNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchReadNotifications = async () => {
      const response = await fetch('/api/notifications/read');
      const data = await response.json();
      setNotifications(data);
    };

    fetchReadNotifications();
  }, []);

  return (
    <div>
      <h1>Read Notifications</h1>
      {notifications.map((notif) => (
        <div key={notif.id}>
          <p>{new Date(notif.createdAt).toLocaleDateString()}</p>
          <Link href={`/notification/${notif.id}`}>{notif.message}</Link>
        </div>
      ))}
    </div>
  );
};

export default ReadNotifications;
