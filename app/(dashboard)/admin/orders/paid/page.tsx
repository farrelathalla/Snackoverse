'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Order, User, OrderItem, OrderStatus } from '@prisma/client';
import Link from 'next/link';

type OrderWithUser = Order & {
  user: User;
  orderItems: (OrderItem & { product: { name: string } })[];
};

const PaidOrders = () => {
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const response = await fetch('/api/orders/paid');
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
    <Link href="/admin/orders/shipped"> Shipped </Link>
      <h1>Paid Orders</h1>
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

export default PaidOrders;
