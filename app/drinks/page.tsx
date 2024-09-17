'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

type Product = {
  id: number;
  name: string;
  description: string;
  category: 'Savory' | 'Sweets' | 'Drinks';
  price: number;
  stock: number;
  origin: string;
};

const CategoryPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Search term state
  const router = useRouter();
  
  // Ensure category is a string, since useParams() can return an array
  const category = "Drinks"

  // Fetch products filtered by category
  useEffect(() => {
    if (!category) return;

    const fetchProducts = async () => {
      const response = await fetch('/api/products');
      const data = await response.json();
      const filtered = Array.isArray(data)
        ? data.filter((product) => product.category === "Drinks")
        : [];
      setProducts(filtered);
    };

    fetchProducts();
  }, [category]);

  // Handle search input change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div>
      <h1>{category} Products</h1>

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
              onClick={() => router.push(`/${product.id}`)}
            >
              <h3>{product.name}</h3>
              <p>{product.description.length > 50 ? `${product.description.slice(0, 50)}...` : product.description}</p>
              <p>Price: ${product.price}</p>
              <p>Stock: {product.stock}</p>
              <p>Region: {product.origin}</p>
            </li>
          ))
        ) : (
          <p>No {category} products available</p>
        )}
      </ul>
    </div>
  );
};

export default CategoryPage;
