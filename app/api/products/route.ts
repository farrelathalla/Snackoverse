import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust the path to your Prisma setup

export async function GET() {
  try {
    const products = await db.product.findMany(); // Fetch all products
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
    const { name, description, category, price, stock, origin, weight, image } = await req.json();
  
    try {
      const product = await db.product.create({
        data: {
          name,
          description,
          category,
          price: parseFloat(price),
          stock: parseInt(stock, 10),
          origin,
          weight: parseInt(weight, 10),
          image,
        },
      });
  
      return NextResponse.json(product, { status: 201 });
    } catch (error) {
      console.error('Error creating product:', error);
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
  }