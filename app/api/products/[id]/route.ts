import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust the path to your Prisma setup

// GET: Fetch product by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const product = await db.product.findUnique({
      where: { id: parseInt(params.id, 10) },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT: Update product by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { name, description, category, price, stock, origin, weight, image } = await req.json();

  try {
    const product = await db.product.update({
      where: { id: parseInt(params.id, 10) },
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

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE: Delete product by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await db.product.delete({
      where: { id: parseInt(params.id, 10) },
    });

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 204 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
