'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UploadButton } from '@/utils/uploadthing'; // Import UploadThing component
import { useRouter } from 'next/navigation';

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

const NewProduct = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [imageUrl, setImageUrl] = useState<string>(''); // Store the uploaded image URL
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Preview image
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    const productData = { ...data, image: imageUrl };

    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    reset();
    router.push('/admin'); // Redirect to admin dashboard after creation
  };

  return (
    <div>
      <h1>Create New Product</h1>
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

        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default NewProduct;
    