'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type NotificationWithOrder = {
  id: number;
  message: string;
  status: 'Unread' | 'Read';
  order: {
    id: number;
    status: string;
    totalAmount: number;
    deliveryFee: number;
    user: {
      email: string;
      fullName: string;
      phoneNumber: string;
      address: {
        title: string;
        provinceName: string;
        type: string;
        cityName: string;
        postalCode: string;
      };
    };
    orderItems: {
      id: number;
      product: { name: string };
      quantity: number;
      price: number;
    }[];
  };
};

const NotificationDetails = ({ params }: { params: { notificationId: string } }) => {
  const [notification, setNotification] = useState<NotificationWithOrder | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNotificationDetails = async () => {
      const response = await fetch(`/api/notifications/${params.notificationId}`);
      const data = await response.json();
      setNotification(data);
    };

    fetchNotificationDetails();
  }, [params.notificationId]);

  if (!notification) {
    return <p>Loading...</p>;
  }

  const totalProductPrice = notification.order.orderItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const finalCost = totalProductPrice + notification.order.deliveryFee;

  return (
    <div>
      <h1>Order-{notification.order.id} Details</h1>
      <p>Email: {notification.order.user.email}</p>
      <p>Full Name: {notification.order.user.fullName}</p>
      <p>Phone Number: {notification.order.user.phoneNumber}</p>

      <h2>Shipping Address</h2>
      <p>{notification.order.user.address.title}</p>
      <p>{notification.order.user.address.type} {notification.order.user.address.cityName}, {notification.order.user.address.provinceName}</p>
      <p>Postal Code: {notification.order.user.address.postalCode}</p>

      <h2>Order Items</h2>
      <ul>
        {notification.order.orderItems.map((item) => (
          <li key={item.id}>
            {item.product.name} - {item.quantity} x Rp {item.price} = Rp {item.quantity * item.price}
          </li>
        ))}
      </ul>

      <h3>Total Product Price: Rp {totalProductPrice}</h3>
      <h3>Delivery Fee: Rp {notification.order.deliveryFee}</h3>
      <h3>Final Cost: Rp {finalCost}</h3>

      <p>Status: {notification.order.status}</p>
    </div>
  );
};

export default NotificationDetails;
