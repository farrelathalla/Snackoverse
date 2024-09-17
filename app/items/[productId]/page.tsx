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
  image: string;
};

const ProductDetails = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(0); // Quantity state with default value 0
  const [error, setError] = useState<string | null>(null); // Error handling
  const router = useRouter();
  const { productId } = useParams();

  // Fetch product details by productId
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error(`Error fetching product: ${response.statusText}`);
        }
        const productData = await response.json();
        setProduct(productData);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchProduct();
  }, [productId]);

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    try {
      const response = await fetch(`/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product?.id,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error adding to cart: ${response.statusText}`);
      }

      alert('Product added to cart!');
      router.push('/cart'); // Redirect to the cart page after adding
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} width="300" />
      <p>{product.description}</p>
      <p>Category: {product.category}</p>
      <p>Price: ${product.price}</p>
      <p>Stock: {product.stock}</p>
      <p>Region: {product.origin}</p>

      {/* Quantity selector */}
      <div>
        <button onClick={decreaseQuantity} disabled={quantity === 0}>
          -
        </button>
        <span>{quantity}</span>
        <button onClick={increaseQuantity} disabled={quantity === product.stock}>
          +
        </button>
      </div>

      {/* Add to cart button */}
      <button onClick={handleAddToCart} disabled={quantity === 0}>
        Add to Cart
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default ProductDetails;
