import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust the path to your Prisma setup
import { hash } from 'bcrypt';

export async function POST(req: Request) {
  try {
    const { fullName, email, password, phoneNumber, address } = await req.json();

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    // Hash password before saving
    const hashedPassword = await hash(password, 10);

    // Create new user with associated address
    const newUser = await db.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phoneNumber,
        address: {
          create: {
            title: address.title,
            provinceId: address.provinceId,
            provinceName: address.provinceName, // Save province name
            cityId: address.cityId,
            type: address.type,
            cityName: address.cityName, // Save city name
            postalCode: address.postalCode,
          }
        }
      },
      include: { address: true }, // Include address in the response
    });

    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
