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
    <div className='flex flex-col mx-auto justify-center items-center'>
      <Image src="Title.svg" alt="Logo Header" height={20} width={20} className='w-screen h-screen'/>
      
      {/* Category buttons */}
      <div className='flex flex-row p-4'>
        <button onClick={() => router.push('/region')}
        className="w-[320px] h-[410px] rounded-3xl text-white overflow-hidden relative">
          <Image src="Region.svg" alt="Region Component" objectFit='cover' layout='fill' className='absolute top-0 left-0'/>
        </button>

        <div className='flex flex-col px-4 '>
          <button onClick={() => router.push('/drinks')}
          className="bg-white w-[410px] h-[200px] rounded-3xl text-white overflow-hidden relative">
            <Image src="Drinks.svg" alt="Drink Component" objectFit='cover' layout='fill' className='absolute top-0 left-0'/>
          </button>
          
          <div className='flex flex-row pt-2 space-x-2'>

            <button onClick={() => router.push('/sweets')}
            className=" w-[200px] h-[200px] rounded-3xl text-white overflow-hidden relative px-4"> 
              <Image src="Sweet.svg" alt="Sweet Component" objectFit='cover' layout='fill' className='absolute top-0 left-0'/>
            </button>
            <button onClick={() => router.push('/savory')}
            className=" w-[200px] h-[200px] rounded-3xl text-white overflow-hidden relative"> 
              <Image src="Savory.svg" alt="Savory Component" objectFit='cover' layout='fill' className='absolute top-0 left-0'/>  
          </button>
            
          </div>
          
        </div>
      </div>

      {/* Search bar */}
      <div className='flex flex-row items-center justify-center p-4 space-x-4 w-screen'>
        <div className=''>
          Or search what you want here
        </div>
        <input
          type="text"
          placeholder="Search product by title"
          value={searchTerm}
          onChange={handleSearch}
          className='p-2 border-[1px] rounded-xl w-[400px]'
        />
      </div>
      {/* Product list */}
      <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-full p-4 mx-auto'>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <li
              key={product.id}
              className='border-[1px] p-4 rounded-xl flex flex-col items-center'
              onClick={() => router.push(`/items/${product.id}`)}
            >
              <img src={product.image} alt="product" className='w-[80px] h-[80px] object-contain mb-2' />
              <h3 className="font-semibold">{product.name}</h3>
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
