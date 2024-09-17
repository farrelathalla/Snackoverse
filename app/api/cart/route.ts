import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Adjust your NextAuth setup


export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const cart = await db.cart.findUnique({
    where: { userId: parseInt(session.user.id, 10) },
    include: {
      cartItems: {
        include: { product: true },
      },
      user: {
        include: { address: true },
      },
    },
  });

  if (!cart) {
    return NextResponse.json({ message: 'No cart found' }, { status: 404 });
  }

  return NextResponse.json({
    cartItems: cart.cartItems,
    address: cart.user.address,
  });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
  
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    const { productId, quantity } = await req.json();
    
    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json({ error: 'Invalid product or quantity' }, { status: 400 });
    }
  
    try {
      // Check if the user has an existing cart
      let cart = await db.cart.findUnique({
        where: { userId: parseInt(session.user.id, 10) },
        include: { cartItems: true },
      });
  
      if (!cart) {
        // Create a new cart for the user
        cart = await db.cart.create({
          data: {
            userId: parseInt(session.user.id, 10),
            cartItems: {
              create: {
                productId: productId,
                quantity: quantity,
              },
            },
          },
          include: { cartItems: true},
        });
      } else {
        // Check if the product is already in the cart
        const existingCartItem = cart.cartItems.find(item => item.productId === productId);
  
        if (existingCartItem) {
          // Update the quantity of the existing product in the cart
          await db.cartItem.update({
            where: { id: existingCartItem.id },
            data: { quantity: existingCartItem.quantity + quantity },
          });
        } else {
          // Add the product to the cart as a new item
          await db.cartItem.create({
            data: {
              cartId: cart.id,
              productId: productId,
              quantity: quantity,
            },
          });
        }
      }
  
      return NextResponse.json({ message: 'Product added to cart' }, { status: 200 });
    } catch (error) {
      console.error('Error adding product to cart:', error);
      return NextResponse.json({ error: 'Failed to add product to cart' }, { status: 500 });
    }
  }