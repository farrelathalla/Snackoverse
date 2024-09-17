import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust the path to your database connection
import { getServerSession } from 'next-auth'; // For session management
import { authOptions } from '@/lib/auth'; // Your NextAuth auth options

export async function PUT(req: Request, { params }: { params: { cartItemId: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { quantity } = await req.json();
  const cartItemId = parseInt(params.cartItemId, 10);

  if (quantity < 1) {
    return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
  }

  try {
    const updatedCartItem = await db.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return NextResponse.json(updatedCartItem, { status: 200 });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { cartItemId: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cartItemId = parseInt(params.cartItemId, 10);

  try {
    await db.cartItem.delete({
      where: { id: cartItemId },
    });

    return NextResponse.json({ message: 'Cart item deleted' }, { status: 204 });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json({ error: 'Failed to delete cart item' }, { status: 500 });
  }
}
