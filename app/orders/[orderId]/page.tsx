'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Order = {
  id: number;
  status: string;
  createdAt: string;
  deliveryFee: number;
  totalAmount: number;
  orderItems: {
    id: number;
    product: {
      name: string;
    };
    quantity: number;
    price: number;
  }[];
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
};

const OrderDetails = ({ params }: { params: { orderId: string } }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const { orderId } = params;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const response = await fetch(`/api/orders/history/${orderId}`);
      const data = await response.json();
      setOrder(data);
    };

    fetchOrderDetails();
  }, [orderId]);

  if (!order) {
    return <p>Loading...</p>;
  }

  const totalProductPrice = order.orderItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const finalCost = totalProductPrice + order.deliveryFee;

  return (
    <div>
      <h1>Order Details</h1>
      <p>Order ID: {order.id}</p>
      <p>Status: {order.status}</p>

      <h2>User Information</h2>
      <p>Email: {order.user.email}</p>
      <p>Full Name: {order.user.fullName}</p>
      <p>Phone Number: {order.user.phoneNumber}</p>

      <h2>Shipping Address</h2>
      <p>{order.user.address.title}</p>
      <p>{order.user.address.type} {order.user.address.cityName}, {order.user.address.provinceName}</p>
      <p>Postal Code: {order.user.address.postalCode}</p>

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
    </div>
  );
};

export default OrderDetails;
