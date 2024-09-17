import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { origin, destination, weight, courier } = await req.json();

  if (!origin || !destination || !weight || !courier) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const response = await fetch('https://api.rajaongkir.com/starter/cost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        key: "2cce0ad574264a22ba7d40496c5ebc35",
      },
      body: new URLSearchParams({
        origin,
        destination,
        weight: weight.toString(),
        courier,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return NextResponse.json(data, { status: 200 });
    } else {
      throw new Error(data.rajaongkir.status.description);
    }
  } catch (error) {
    console.error('Error fetching delivery cost:', error);
    return NextResponse.json({ error: 'Failed to fetch delivery cost' }, { status: 500 });
  }
}
