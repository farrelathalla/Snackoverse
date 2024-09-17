'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Order = {
  id: number;
  createdAt: string;
  status: string;
};

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch('/api/orders/history');
      const data = await response.json();
      setOrders(data);
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Order History</h1>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid black' }}>
            <p>{new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Order ID: {order.id}</p>
            <p>Status: {order.status}</p>
            <button
              onClick={() => router.push(`/orders/${order.id}`)}
              style={{ padding: '10px', backgroundColor: 'blue', color: 'white' }}
            >
              See More
            </button>
          </div>
        ))
      ) : (
        <p>No orders found</p>
      )}
    </div>
  );
};

export default OrderHistory;
