'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Order, User, OrderItem, OrderStatus } from '@prisma/client';

type OrderWithUser = Order & {
  user: User;
  orderItems: (OrderItem & { product: { name: string } })[];
};

const ShippedOrders = () => {
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const response = await fetch('/api/orders/shipped');
    const data = await response.json();
    setOrders(Array.isArray(data) ? data : []);
  };

  const groupByDate = (orders: OrderWithUser[]) => {
    return orders.reduce((group: { [key: string]: OrderWithUser[] }, order) => {
      const date = new Date(order.updatedAt).toLocaleDateString();
      if (!group[date]) {
        group[date] = [];
      }
      group[date].push(order);
      return group;
    }, {});
  };

  const groupedOrders = groupByDate(orders);

  return (
    <div>
      <h1>Shipped Orders</h1>
      {Object.keys(groupedOrders).map((date) => (
        <div key={date}>
          <h2>{date}</h2>
          {groupedOrders[date].map((order) => (
            <div key={order.id} onClick={() => router.push(`/admin/orders/${order.id}`)}>
              <p>Order-{order.id}</p>
              <p>{order.user.fullName}</p>
              <p>Status: {order.status}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ShippedOrders;
