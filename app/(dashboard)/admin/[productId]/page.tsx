'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UploadButton } from '@/utils/uploadthing'; // Import UploadThing component
import { useRouter, useParams } from 'next/navigation'; // For navigation and params

type FormData = {
  name: string;
  description: string;
  category: 'Savory' | 'Sweets' | 'Drinks';
  price: number;
  stock: number;
  origin: string;
  weight: number;
  image: string;
};

const EditProduct = () => {
  const { register, handleSubmit, setValue } = useForm<FormData>();
  const [imageUrl, setImageUrl] = useState<string>(''); // Store the uploaded image URL
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Preview image
  const router = useRouter();
  const { productId } = useParams(); // Get productId from route params
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Store error messages

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  const fetchProductData = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);

      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        throw new Error(`Error fetching product: ${response.statusText}`);
      }

      const product = await response.json();
      if (!product) {
        throw new Error("Product not found or invalid response");
      }

      // Pre-fill form fields
      setValue('name', product.name);
      setValue('description', product.description);
      setValue('category', product.category);
      setValue('price', product.price);
      setValue('stock', product.stock);
      setValue('origin', product.origin);
      setValue('weight', product.weight);
      setImageUrl(product.image); // Pre-fill image URL
      setPreviewImage(product.image); // Set image preview
      setLoading(false); // Stop loading after successful fetch
    } catch (err: any) {
      setError(err.message || "Unexpected error");
      setLoading(false); // Stop loading on error
    }
  };

  const onSubmit = async (data: FormData) => {
    const productData = { ...data, image: imageUrl };

    await fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    router.push('/admin'); // Redirect to admin dashboard after update
  };

  const handleCancel = () => {
    // Redirect to admin dashboard without saving changes
    router.push('/admin');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Edit Product</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Name</label>
        <input {...register('name')} required />

        <label>Description</label>
        <textarea {...register('description')} required />

        <label>Category</label>
        <select {...register('category')} required>
          <option value="Savory">Savory</option>
          <option value="Sweets">Sweets</option>
          <option value="Drinks">Drinks</option>
        </select>

        <label>Price</label>
        <input type="number" {...register('price')} required />

        <label>Stock</label>
        <input type="number" {...register('stock')} required />

        <label>Origin</label>
        <input {...register('origin')} required />

        <label>Weight</label>
        <input type="number" {...register('weight')} required />

        <label>Upload Image</label>
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res && res[0].url) {
              setImageUrl(res[0].url); // Store the uploaded image URL
              setPreviewImage(res[0].url); // Set preview image
            }
          }}
          onUploadError={(error) => {
            console.error("Upload failed:", error.message);
          }}
        />

        {previewImage && (
          <div style={{ marginTop: '20px' }}>
            <p>Image Preview:</p>
            <img src={previewImage} alt="Preview" width="200" />
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <button type="submit" style={{ marginRight: '10px' }}>
            Update Product
          </button>
          <button type="button" onClick={handleCancel} style={{ backgroundColor: 'red', color: 'white' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
