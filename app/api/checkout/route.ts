import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';  // Adjust the path to your auth options
import { db } from '@/lib/db';  // Adjust the path to your Prisma DB setup

// Create Snap API instance
let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '',
});

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
  
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  
    const { cartItems, deliveryFee, totalPrice } = await req.json();
  
    // Fetch user profile from the database
    const user = await db.user.findUnique({
      where: { id: parseInt(session.user.id) },
      include: { address: true },
    });
  
    if (!user || !user.address) {
      return NextResponse.json({ message: 'User or address not found' }, { status: 404 });
    }
  
    // Create a new order in the database using the auto-generated order ID
    const newOrder = await db.order.create({
        data: {
          userId: user.id,
          totalAmount: totalPrice,
          deliveryFee: deliveryFee,
          status: 'Pending',
          orderItems: {
            create: cartItems.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        select: { id: true, createdAt: true }, // Include createdAt in response
      });
  
    // Prepare customer details using user's info and address
    const customerDetails = {
      first_name: user.fullName,
      email: user.email,
      phone: user.phoneNumber,
      billing_address: {
        first_name: user.fullName,
        email: user.email,
        phone: user.phoneNumber,
        address: user.address.title,
        city: user.address.cityName,
        postal_code: user.address.postalCode,
        country_code: 'IDN',
      },
      shipping_address: {
        first_name: user.fullName,
        email: user.email,
        phone: user.phoneNumber,
        address: user.address.title,
        city: user.address.cityName,
        postal_code: user.address.postalCode,
        country_code: 'IDN',
      }
    };
  
    // Prepare item details for Midtrans
    const itemDetails = cartItems.map((item: any) => ({
      id: item.productId,
      price: item.product.price,
      quantity: item.quantity,
      name: item.product.name,
    }));
  
    // Add delivery fee as a separate item
    itemDetails.push({
      id: 'delivery_fee',
      price: deliveryFee,
      quantity: 1,
      name: 'Delivery Fee',
    });
  
    // Calculate the correct total price
    const calculatedGrossAmount = itemDetails.reduce((acc:any, item:any) => acc + item.price * item.quantity, 0);
  
    // Create transaction details for Midtrans
    const transactionParams = {
      transaction_details: {
        order_id: `order-${newOrder.id}`,  // Use the existing order `id` and concatenate 'order-' for Midtrans
        gross_amount: calculatedGrossAmount, // total amount based on item_details
      },
      item_details: itemDetails,
      customer_details: customerDetails,
    };
  
    try {
      const transaction = await snap.createTransaction(transactionParams);
      const token = transaction.token;
  
      // After successful transaction creation, delete the user's cart and cart items
      await db.cartItem.deleteMany({
        where: { cartId: user.id },
      });
      await db.cart.delete({
        where: { userId: user.id },
      });
  
      return NextResponse.json({ token, order_id: newOrder.id });
    } catch (error) {
      console.error('Error creating transaction:', error);
      return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
    }
  }
