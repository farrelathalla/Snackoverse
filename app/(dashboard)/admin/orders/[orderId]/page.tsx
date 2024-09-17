'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Order, User, OrderItem, Address } from '@prisma/client';

type OrderWithDetails = Order & {
  user: User & { address?: Address };
  orderItems: (OrderItem & { product: { name: string } })[];
};

const OrderDetails = ({ params }: { params: { orderId: string } }) => {
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    const response = await fetch(`/api/orders/${params.orderId}`);
    const data = await response.json();
    setOrder(data);
  };

  if (!order) {
    return <p>Loading...</p>;
  }

  const handleDeliver = async () => {
    try {
      await fetch(`/api/orders/${order.id}/ship`, { method: 'PUT' });
      setOrder({ ...order, status: 'Shipped' });
    } catch (error) {
      console.error('Error updating order status', error);
    }
  };

  const totalProductPrice = order.orderItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const finalCost = totalProductPrice + order.deliveryFee;

  return (
    <div>
      <h1>Order-{order.id} Details</h1>
      <p>Email: {order.user.email}</p>
      <p>Full Name: {order.user.fullName}</p>
      <p>Phone Number: {order.user.phoneNumber}</p>

      <h2>Shipping Address</h2>
      {order.user.address ? (
        <>
          <p>{order.user.address.title}</p>
          <p>{order.user.address.type} {order.user.address.cityName}, {order.user.address.provinceName}</p>
          <p>Postal Code: {order.user.address.postalCode}</p>
        </>
      ) : (
        <p>No address provided.</p>
      )}

      <h2>Order Items</h2>
      <ul>
        {order.orderItems.map((item) => (
          <li key={item.id}>
            {item.product.name} - {item.quantity} x Rp {item.price} = Rp {item.quantity * item.price}
          </li>
        ))}
      </ul>

      <h3>Total Product Price: Rp {totalProductPrice}</h3>
      <h3>Delivery Fee: Rp {order.deliveryFee}</h3>
      <h3>Final Cost: Rp {finalCost}</h3>

      <button onClick={handleDeliver} disabled={order.status === 'Shipped'}>
        {order.status === 'Shipped' ? 'Delivered' : 'Deliver'}
      </button>
    </div>
  );
};

export default OrderDetails;
