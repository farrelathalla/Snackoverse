'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, OrderStatus } from '@prisma/client';
import UserAccountButton from '@/components/UserAccountButton';

type Order = {
  id: number;
  status: OrderStatus;
};

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [hasPaidOrders, setHasPaidOrders] = useState(false); // Red button indicator
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
    fetchPaidOrders(); // Check if there are any paid orders
  }, []);

  const fetchProducts = async () => {
    const response = await fetch('/api/products');
    const data = await response.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  const fetchPaidOrders = async () => {
    const response = await fetch('/api/orders/paid/count');
    const data = await response.json();
    setHasPaidOrders(data.count > 0); // Set red button indicator if there are paid orders
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const handleCreateNew = () => {
    router.push('/admin/new');
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button
        onClick={handleCreateNew}
        style={{ marginBottom: '20px', padding: '10px', backgroundColor: 'blue', color: 'white' }}
      >
        Create New Product
      </button>
      <UserAccountButton />
      <button
        onClick={() => router.push('/admin/orders/paid')}
        style={{
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: hasPaidOrders ? 'red' : 'green',
          color: 'white',
        }}
      >
        Orders
      </button>

      {/* Product List */}
      <ul>
        {products.length > 0 ? (
          products.map((product) => (
            <li key={product.id} style={{ border: '1px solid black', padding: '10px', marginBottom: '10px' }}>
              <div>
                <img src={product.image} alt={product.name} width="100" />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Category: {product.category}</p>
                <p>Price: Rp {product.price}</p>
                <p>Stock: {product.stock}</p>
                <button onClick={() => router.push(`/admin/${product.id}`)}>Edit</button>
                <button
                  onClick={() => handleDelete(product.id)}
                  style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No products available</p>
        )}
      </ul>
    </div>
  );
};

export default AdminDashboard;
