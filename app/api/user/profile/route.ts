import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET: Fetch the user's profile
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await db.user.findUnique({
      where: { id: parseInt(session.user.id, 10) },
      include: { address: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

// PUT: Update the user's profile
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { fullName, phoneNumber, address } = await req.json();
  console.log('Received payload:', { fullName, phoneNumber, address });

  if (!fullName || !phoneNumber || !address || !address.title || !address.provinceId || !address.cityId || !address.provinceName || !address.cityName || !address.postalCode || !address.type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Update user profile and address
    const updatedUser = await db.user.update({
      where: { id: parseInt(session.user.id, 10) },
      data: {
        fullName,
        phoneNumber,
        address: {
          update: {
            title: address.title,
            provinceId: address.provinceId,
            provinceName: address.provinceName, // Update provinceName
            cityId: address.cityId,
            cityName: address.cityName,         // Update cityName
            postalCode: address.postalCode,     // Update postalCode
            type: address.type,                 // Update type (e.g., "Kota", "Kabupaten")
          },
        },
      },
      include: { address: true },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}
