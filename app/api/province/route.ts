// app/api/province/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(`https://api.rajaongkir.com/starter/province?key=${process.env.NEXT_PUBLIC_RAJAONGKIR_API_KEY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch provinces');
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return NextResponse.json({ error: 'Failed to fetch provinces' }, { status: 500 });
  }
}
