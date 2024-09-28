'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UserAccountButton from '@/components/UserAccountButton';
import Image from 'next/image';

type Product = {
  id: number;
  name: string;
  description: string;
  category: 'Savory' | 'Sweets' | 'Drinks';
  price: number;
  stock: number;
  origin: string;
  image: string;
};

type Notification = {
  id: number;
  status: 'Unread' | 'Read';
};

const UserDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(false);
  const router = useRouter();

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    };

    fetchProducts();
  }, []);

  // Fetch notifications to check if there are any unread notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch('/api/notifications/unread');
      const data: Notification[] = await response.json();
      setHasUnreadNotifications(data.length > 0);
    };

    fetchNotifications();
  }, []);

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Filter products by search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div>
      <h1 className=''>User Dashboard</h1>

      {/* Notifications Button */}
      <button
        style={{ backgroundColor: hasUnreadNotifications ? 'red' : 'blue', color: 'white' }}
        onClick={() => router.push('/notification/new')}
      >
        Notifications
      </button>


      {/* Category buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => router.push('/savory')}>Savory</button>
        <button onClick={() => router.push('/sweets')}>Sweets</button>
        <button onClick={() => router.push('/drinks')}>Drinks</button>
        <button onClick={() => router.push('/region')}>Region</button>
      </div>

      {/* Search bar */}
      <div>
        <input
          type="text"
          placeholder="Search product by title"
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginBottom: '20px', padding: '10px' }}
        />
      </div>
      {/* Product list */}
      <ul>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <li
              key={product.id}
              style={{ border: '1px solid black', padding: '10px', marginBottom: '10px' }}
              onClick={() => router.push(`/items/${product.id}`)}
            >
              <img src={product.image} alt="product" className='w-[40px]' />
              <h3>{product.name}</h3>
              <p>{product.description.length > 50 ? `${product.description.slice(0, 50)}...` : product.description}</p>
              <p>Price: Rp {product.price}</p>
              <p>Stock: {product.stock}</p>
              <p>Region: {product.origin}</p>
            </li>
          ))
        ) : (
          <p>No products available</p>
        )}
      </ul>
    </div>
  );
};

export default UserDashboard;
